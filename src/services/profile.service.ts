import { Prisma, User } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '../data/prisma';
import { withServiceAuth } from '~/lib/auth/protected-service';
import { ErrorMessage } from '~/lib/constants';
import { AppError } from '~/lib/errors/app-error';
import { UpdateProfileInput, profileSelect, updateProfileSchema } from '~/schemas/profile.schema';

export const ProfileService = {
  // Owner or admin can view profile
  async getProfile(userId: User['id'], requestUserId: string) {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        const profile = await prisma.profile.findUnique({
          where: { userId },
          select: profileSelect,
        });

        if (!profile) notFound();
        return profile;
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Owner or admin can update profile
  async updateProfile(userId: User['id'], data: UpdateProfileInput, requestUserId: string) {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        return await prisma.$transaction(async (tx) => {
          const profile = await tx.profile.findUnique({
            where: { userId },
            select: { id: true },
          });

          if (!profile) notFound();

          const verifiedSkills = data.skills?.length
            ? await tx.skill.findMany({
                where: {
                  AND: [
                    { verified: true },
                    {
                      name: {
                        in: data.skills.map((name) => name.toLowerCase().trim()),
                      },
                    },
                  ],
                },
                select: { name: true },
              })
            : [];

          const validatedData = updateProfileSchema.parse({
            ...data,
            skills: verifiedSkills.map((s) => s.name),
          });

          return tx.profile.update({
            where: { userId },
            data: validatedData,
            select: profileSelect,
          });
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') notFound();
          throw new AppError(ErrorMessage.INVALID_INPUT);
        }
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Admin only - view all profiles
  async getAllProfiles(requestUserId: string, page = 1, limit = 10) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        return await prisma.profile.findMany({
          skip: (page - 1) * limit,
          take: limit,
          select: profileSelect,
          orderBy: { lastModifiedDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Admin only - search profiles
  async searchProfiles(query: string, requestUserId: string, page = 1, limit = 10) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        return await prisma.profile.findMany({
          where: {
            OR: [
              { user: { username: { contains: query } } },
              { user: { fullName: { contains: query } } },
              { skills: { some: { name: { contains: query } } } },
            ],
          },
          skip: (page - 1) * limit,
          take: limit,
          select: profileSelect,
          orderBy: { lastModifiedDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Public method - no auth needed
  async getPublicProfile(username: string) {
    try {
      const profile = await prisma.profile.findFirst({
        where: { user: { username } },
        select: {
          ...profileSelect,
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatar: true,
            },
          },
        },
      });

      if (!profile) notFound();
      return profile;
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },
};
