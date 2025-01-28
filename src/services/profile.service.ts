import { Prisma, User } from "@prisma/client";
import { db } from "../data/mysql";
import {
  UpdateProfileInput,
  UpdateProfilePayload,
  updateProfileSchema,
} from "../schemas/profile.schema";
import { notFound } from "next/navigation";
import { UserService } from "./user.service";
import { Permission } from "../lib/permissions";

export const ProfileService = {
  async getProfile(userId: User["id"], requestUserId?: string) {
    try {
      // Check if user has permission to view this profile
      if (requestUserId) {
        const canView = await UserService.canAccessContent(
          requestUserId,
          userId,
          Permission.VIEW_ANY_PROFILE,
        );
        if (!canView) {
          throw new Error("Unauthorized: Cannot view this profile");
        }
      }

      const profile = await db.profile.findUnique({
        where: { userId },
        select: {
          id: true,
          lastModifiedDate: true,
          gradYear: true,
          bio: true,
          skills: {
            where: { verified: true },
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatar: true,
              email: true,
            },
          },
        },
      });

      if (!profile) {
        notFound();
      }

      return profile;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch profile: ${error.message}`
          : "Failed to fetch profile",
      );
    }
  },

  async updateProfile(
    userId: User["id"],
    data: UpdateProfileInput,
    requestUserId: string,
  ) {
    try {
      // Check if user has permission to update this profile
      const canUpdate = await UserService.canAccessContent(
        requestUserId,
        userId,
        Permission.UPDATE_ANY_PROFILE,
      );
      if (!canUpdate) {
        throw new Error("Unauthorized: Cannot update this profile");
      }

      return await db.$transaction(async (tx) => {
        const profile = await tx.profile.findUnique({
          where: { userId },
          select: { id: true },
        });

        if (!profile) {
          notFound();
        }

        // Only connect verified skills
        let verifiedSkills: { name: string }[] = [];
        if (data.skills?.length) {
          verifiedSkills = await tx.skill.findMany({
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
          });
        }

        const validatedData: UpdateProfilePayload = updateProfileSchema.parse({
          ...data,
          skills: verifiedSkills.map((s) => s.name),
        });

        return tx.profile.update({
          where: { userId },
          data: {
            ...validatedData,
            skills: verifiedSkills.length
              ? {
                  connect: verifiedSkills,
                }
              : undefined,
          },
          select: {
            id: true,
            lastModifiedDate: true,
            gradYear: true,
            bio: true,
            skills: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          notFound();
        }
      }
      throw new Error(
        error instanceof Error
          ? `Failed to update profile: ${error.message}`
          : "Failed to update profile",
      );
    }
  },

  // Admin methods
  async getAllProfiles(requestUserId: string, page = 1, limit = 10) {
    try {
      if (
        !(await UserService.hasPermission(
          requestUserId,
          Permission.VIEW_ANY_PROFILE,
        ))
      ) {
        throw new Error("Unauthorized: Cannot view all profiles");
      }

      return await db.profile.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          lastModifiedDate: true,
          gradYear: true,
          bio: true,
          skills: {
            where: { verified: true },
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          lastModifiedDate: "desc",
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch profiles: ${error.message}`
          : "Failed to fetch profiles",
      );
    }
  },

  async searchProfiles(query: string, requestUserId: string, limit = 10) {
    try {
      if (
        !(await UserService.hasPermission(
          requestUserId,
          Permission.VIEW_ANY_PROFILE,
        ))
      ) {
        throw new Error("Unauthorized: Cannot search profiles");
      }

      return await db.profile.findMany({
        where: {
          OR: [
            { user: { username: { contains: query } } },
            { user: { fullName: { contains: query } } },
            { skills: { some: { name: { contains: query } } } },
          ],
        },
        take: limit,
        select: {
          id: true,
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatar: true,
            },
          },
          skills: {
            where: { verified: true },
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to search profiles: ${error.message}`
          : "Failed to search profiles",
      );
    }
  },

  // Add this public method
  async getPublicProfile(username: string) {
    try {
      const profile = await db.profile.findFirst({
        where: { user: { username } },
        select: {
          bio: true,
          gradYear: true,
          skills: {
            where: { verified: true },
            select: {
              id: true,
              name: true,
            },
          },
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

      if (!profile) {
        notFound();
      }

      return profile;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch public profile: ${error.message}`
          : "Failed to fetch public profile",
      );
    }
  },
};
