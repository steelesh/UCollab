import { lorelei } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { Account, AvatarSource, Prisma, Role, User } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '~/lib/prisma';
import { s3 } from '~/lib/s3';
import { withServiceAuth } from '~/security/protected-service';
import { ErrorMessage, Utils } from '~/lib/utils';
import { isDevelopment } from '~/lib/env';
import { UpdateUserInput, userSelect, CompleteOnboardingData, onboardingSchema } from '~/features/users/user.schema';
import { UserProfile } from './user.types';

export const UserService = {
  async getUserProfile(username: User['username']): Promise<UserProfile> {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          avatar: true,
          username: true,
          email: true,
          fullName: true,
          createdDate: true,
          lastLogin: true,
          gradYear: true,
          bio: true,
          mentorship: true,
          technologies: {
            select: { name: true },
          },
          projects: {
            take: 3,
            orderBy: { createdDate: 'desc' },
            select: {
              id: true,
              title: true,
              createdDate: true,
            },
          },
          comments: {
            take: 3,
            orderBy: { createdDate: 'desc' },
            select: {
              id: true,
              content: true,
              createdDate: true,
              projectId: true,
              project: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      });
      if (!user) notFound();
      return user as UserProfile;
    } catch {
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async completeOnboarding(userId: User['id'], requestUserId: string, rawData: unknown) {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        const data: CompleteOnboardingData = onboardingSchema.parse(rawData);
        const mentorship: 'MENTOR' | 'MENTEE' | 'NONE' = 'NONE';
        const gradYearNumber = data.gradYear ? parseInt(data.gradYear, 10) : null;
        return await prisma.$transaction(async (tx) => {
          return tx.user.update({
            where: { id: userId },
            data: {
              onboardingStep: 'COMPLETE',
              githubProfile: data.githubProfile,
              gradYear: gradYearNumber,
              mentorship: mentorship,
              technologies: {
                deleteMany: {},
                connectOrCreate: Array.isArray(data.technologies)
                  ? data.technologies.map((tech: string) => {
                      const trimmed = tech.trim();
                      return {
                        where: { name: trimmed },
                        create: { name: trimmed, verified: false },
                      };
                    })
                  : [],
              },
            },
            select: userSelect,
          });
        });
      } catch (error) {
        console.log(error);
        if (error instanceof Utils) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2005') {
          notFound();
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
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
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
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

  async searchUsers(query: string, currentUserId: User['id']) {
    try {
      return await prisma.user.findMany({
        where: {
          username: {
            contains: query,
          },
          NOT: {
            id: currentUserId,
          },
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
        take: 5,
      });
    } catch (error) {
      if (error instanceof Utils) throw error;
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async getAdminUserDetails(userId: User['id'], requestUserId: string) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            ...userSelect,
            lastLogin: true,
          },
        });

        if (!user) notFound();
        return user;
      } catch {
        throw new Utils(ErrorMessage.OPERATION_FAILED);
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
        throw new Utils(ErrorMessage.OPERATION_FAILED);
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
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async updateUser(userId: User['id'], data: UpdateUserInput, requestUserId: string) {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        const { avatar: avatarFile, notificationPreferences, ...updateFields } = data;
        const updates: Prisma.UserUpdateInput = { ...updateFields };

        if (avatarFile !== undefined) {
          updates.avatar = await this.processUserAvatar(avatarFile, userId);
          updates.avatarSource = updates.avatar ? AvatarSource.UPLOAD : AvatarSource.DEFAULT;
        }

        if (notificationPreferences !== undefined) {
          updates.notificationPreferences = {
            update: notificationPreferences,
          };
        }

        return await prisma.user.update({
          where: { id: userId },
          data: updates,
          select: userSelect,
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') notFound();
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
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
      throw new Utils(ErrorMessage.OPERATION_FAILED);
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
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async uploadUserAvatar(file: File, userId: User['id']) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = await this.getAvatarFileName(userId, file.name);
      return s3.uploadProfilePhoto(buffer, fileName);
    } catch {
      throw new Utils(ErrorMessage.OPERATION_FAILED);
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
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async searchTechnologies(query: string, requestUserId: User['id'], limit = 5) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.technology.findMany({
          where: {
            name: {
              startsWith: query.toLowerCase().trim(),
            },
          },
          select: {
            name: true,
          },
          take: limit,
          orderBy: {
            name: 'asc',
          },
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
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
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },
};
