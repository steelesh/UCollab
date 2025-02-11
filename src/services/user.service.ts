import { lorelei } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { Account, AvatarSource, Prisma, Role, User } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '~/data/prisma';
import { s3 } from '~/data/s3';
import { withServiceAuth } from '~/lib/auth/protected-service';
import { ErrorMessage } from '~/lib/constants';
import { AppError } from '~/lib/errors/app-error';
import { isDevelopment } from '~/lib/utils';
import { publicUserSelect, UpdateUserInput, userSelect } from '~/schemas/user.schema';
import { CompleteOnboardingData, onboardingSchema } from '~/schemas/onboarding.schema';

export const UserService = {
  async getUser(username: User['username']) {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        select: publicUserSelect,
      });

      if (!user) notFound();
      return user;
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },

  async completeOnboarding(userId: User['id'], requestUserId: string, rawData: unknown) {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        // 1. Parse and validate the incoming data with Zod.
        const data: CompleteOnboardingData = onboardingSchema.parse(rawData);

        // 2. Map postType to mentorship status.
        let mentorship: 'MENTOR' | 'MENTEE' | 'NONE' = 'NONE';
        if (data.postType === 'Mentorship Status') {
          mentorship = 'MENTOR';
        } else if (data.postType === 'Feedback') {
          mentorship = 'MENTEE';
        }

        // 3. Convert gradYear from string to number.
        const gradYearNumber = data.gradYear ? parseInt(data.gradYear, 10) : null;

        // 4. Use a transaction to update the user.
        return await prisma.$transaction(async (tx) => {
          return tx.user.update({
            where: { id: userId },
            data: {
              onboardingStep: 'COMPLETE',
              githubProfile: data.githubProfile,
              gradYear: gradYearNumber,
              mentorship: mentorship,
              Skill: {
                deleteMany: {},
                create: data.skills
                  ? data.skills
                      .split(',')
                      .map((s) => ({ name: s.trim(), userId: userId }))
                      .filter(({ name }) => name.length > 0)
                  : [],
              },
            },
            select: userSelect,
          });
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          notFound();
        }
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getHomePageUser(userId: string, requestUserId: string) {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: userSelect,
        });

        if (!user) notFound();
        return user;
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getUsers(requestUserId?: string) {
    if (isDevelopment()) {
      return prisma.user.findMany({
        orderBy: { createdDate: 'desc' },
      });
    }

    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      return prisma.user.findMany({
        orderBy: { createdDate: 'desc' },
      });
    });
  },

  async searchUsers(query: string, requestUserId: string, limit = 5) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        return await prisma.user.findMany({
          where: { username: { startsWith: query.toLowerCase().trim() } },
          select: publicUserSelect,
          take: limit,
          orderBy: { username: 'asc' },
        });
      } catch {
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getAdminUserDetails(userId: User['id'], requestUserId: string) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            ...userSelect,
            profile: true,
            lastLogin: true,
          },
        });

        if (!user) notFound();
        return user;
      } catch {
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async updateUserRole(userId: User['id'], newRole: Role, requestUserId: string) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        return await prisma.user.update({
          where: { id: userId },
          data: { role: newRole },
          select: { id: true, username: true, role: true },
        });
      } catch {
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async deleteUser(userId: User['id'], requestUserId: string) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        await prisma.$transaction(async (tx) => {
          return tx.user.delete({ where: { id: userId } });
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') notFound();
        }
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async updateUser(userId: User['id'], data: UpdateUserInput, requestUserId: string) {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        const { avatar: avatarFile, ...updateFields } = data;
        const updates: Prisma.UserUpdateInput = { ...updateFields };

        if (avatarFile !== undefined) {
          updates.avatar = await this.processUserAvatar(avatarFile, userId);
          updates.avatarSource = updates.avatar ? AvatarSource.UPLOAD : AvatarSource.DEFAULT;
        }

        return await prisma.user.update({
          where: { id: userId },
          data: updates,
          select: userSelect,
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') notFound();
        }
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getUserRole(userId: User['id']) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) notFound();
      return user.role;
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },

  async processUserAvatar(avatar: File | null, userId: User['id']) {
    try {
      if (avatar === null) {
        return this.generateDefaultAvatar(userId);
      }
      if (avatar instanceof File) {
        return this.uploadUserAvatar(avatar, userId);
      }
      return undefined;
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },

  async uploadUserAvatar(file: File, userId: User['id']) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = await this.getAvatarFileName(userId, file.name);
      return s3.uploadProfilePhoto(buffer, fileName);
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },

  async getAvatarFileName(userId: User['id'], originalName?: string) {
    const extension = originalName ? (originalName.split('.').pop() ?? 'jpg') : 'jpg';
    return `${userId}.${extension}`;
  },

  async generateDefaultAvatar(userId: User['id']) {
    try {
      return createAvatar(lorelei, {
        seed: userId,
        scale: 125,
      }).toDataUri();
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },

  async fetchMicrosoftAvatar(accessToken: Account['access_token'], userId: User['id']) {
    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) return null;

      const blob = await response.blob();
      const buffer = Buffer.from(await blob.arrayBuffer());
      const fileName = await this.getAvatarFileName(userId);

      return s3.uploadProfilePhoto(buffer, fileName);
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },
};
