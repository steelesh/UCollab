import { Prisma, type User } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "~/lib/prisma";
import { withServiceAuth } from "~/lib/auth/protected-service";
import { ErrorMessage } from "~/lib/constants";
import { AppError, AuthorizationError } from "~/lib/errors/app-error";
import { Permission } from "~/lib/permissions";
import {
  type UpdateProfileInput,
  profileSelect,
  updateProfileSchema,
} from "~/schemas/profile.schema";
import { UserService } from "./user.service";

export const ProfileService = {
  // Read Operations
  async getProfile(userId: User["id"], requestUserId: string) {
    return withServiceAuth(
      requestUserId,
      Permission.VIEW_ANY_PROFILE,
      async () => {
        try {
          if (
            !(await UserService.canAccessContent(
              requestUserId,
              userId,
              Permission.VIEW_ANY_PROFILE,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

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
      },
    );
  },

  // Update Operations
  async updateProfile(
    userId: User["id"],
    data: UpdateProfileInput,
    requestUserId: string,
  ) {
    return withServiceAuth(
      requestUserId,
      Permission.UPDATE_ANY_PROFILE,
      async () => {
        try {
          if (
            !(await UserService.canAccessContent(
              requestUserId,
              userId,
              Permission.UPDATE_ANY_PROFILE,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

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
                          in: data.skills.map((name) =>
                            name.toLowerCase().trim(),
                          ),
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
            if (error.code === "P2025") notFound();
            throw new AppError(ErrorMessage.INVALID_INPUT);
          }
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  // List & Search Operations
  async getAllProfiles(requestUserId: string, page = 1, limit = 10) {
    return withServiceAuth(
      requestUserId,
      Permission.VIEW_ANY_PROFILE,
      async () => {
        try {
          return await prisma.profile.findMany({
            skip: (page - 1) * limit,
            take: limit,
            select: profileSelect,
            orderBy: { lastModifiedDate: "desc" },
          });
        } catch (error) {
          if (error instanceof AppError) throw error;
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  async searchProfiles(
    query: string,
    requestUserId: string,
    page = 1,
    limit = 10,
  ) {
    return withServiceAuth(
      requestUserId,
      Permission.VIEW_ANY_PROFILE,
      async () => {
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
            orderBy: { lastModifiedDate: "desc" },
          });
        } catch (error) {
          if (error instanceof AppError) throw error;
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  // Public Operations
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
