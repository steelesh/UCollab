import { lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { type Account, AvatarSource, Prisma, Role, type User } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "~/lib/prisma";
import { s3 } from "~/data/s3";
import { withServiceAuth } from "~/lib/auth/protected-service";
import { ErrorMessage } from "~/lib/constants";
import { AppError, AuthorizationError } from "~/lib/errors/app-error";
import { hasPermission, Permission } from "~/lib/permissions";
import {
  publicUserSelect,
  type UpdateUserInput,
  userSelect,
} from "~/schemas/user.schema";

export const UserService = {
  async getUser(username: User["username"]) {
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

  async getHomePageUser(userId: string, requestUserId: string) {
    return withServiceAuth(
      requestUserId,
      Permission.VIEW_OWN_PROFILE,
      async () => {
        try {
          if (
            !(await this.canAccessContent(
              requestUserId,
              userId,
              Permission.VIEW_OWN_PROFILE,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

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
      },
    );
  },

  async getUsers(userId?: string, isLocalDev = false): Promise<User[]> {
    if (isLocalDev) {
      return prisma.user.findMany({
          orderBy: {createdDate: "desc"},
      });
    }

    if (!userId) {
      throw new AuthorizationError(ErrorMessage.AUTHENTICATION_REQUIRED);
    }

    return withServiceAuth(userId, Permission.VIEW_USERS_LIST, async () => {
      return prisma.user.findMany({
          orderBy: {createdDate: "desc"},
      });
    });
  },

  // Search Operations
  async searchUsers(query: string, requestUserId: string, limit = 5) {
    return withServiceAuth(
      requestUserId,
      Permission.VIEW_USERS_LIST,
      async () => {
        try {
          return await prisma.user.findMany({
            where: { username: { startsWith: query.toLowerCase().trim() } },
            select: publicUserSelect,
            take: limit,
            orderBy: { username: "asc" },
          });
        } catch {
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  // Admin Operations
  async getAdminUserDetails(userId: User["id"], requestUserId: string) {
    return withServiceAuth(requestUserId, Permission.VIEW_USERS, async () => {
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

  async updateUserRole(
    userId: User["id"],
    newRole: Role,
    requestUserId: string,
  ) {
    return withServiceAuth(requestUserId, Permission.MANAGE_ROLES, async () => {
      try {
        return await prisma.user.update({
          where: { id: userId },
          data: { role: newRole },
          select: {
            id: true,
            username: true,
            role: true,
          },
        });
      } catch {
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async deleteUser(userId: User["id"], requestUserId: string) {
    return withServiceAuth(
      requestUserId,
      Permission.DELETE_ANY_USER,
      async () => {
        try {
          await prisma.$transaction(async (tx) => {
            return tx.user.delete({ where: { id: userId } });
          });
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") notFound();
          }
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  // User Management Operations
  async updateUser(
    userId: User["id"],
    data: UpdateUserInput,
    requestUserId: string,
  ) {
    return withServiceAuth(
      requestUserId,
      Permission.UPDATE_ANY_USER,
      async () => {
        try {
          if (
            !(await this.canAccessContent(
              requestUserId,
              userId,
              Permission.UPDATE_ANY_USER,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

          const { avatar: avatarFile, ...updateFields } = data;
          const updates: Prisma.UserUpdateInput = { ...updateFields };

          if (avatarFile !== undefined) {
            updates.avatar = await this.processUserAvatar(avatarFile, userId);
            updates.avatarSource = updates.avatar
              ? AvatarSource.UPLOAD
              : AvatarSource.DEFAULT;
          }

          return await prisma.user.update({
            where: { id: userId },
            data: updates,
            select: userSelect,
          });
        } catch (error) {
          if (error instanceof AppError) throw error;
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") notFound();
          }
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  // Internal Helper Methods
  async getUserRole(userId: User["id"]) {
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

  async hasPermission(userId: User["id"], permission: Permission) {
    try {
      const userRole = await this.getUserRole(userId);
      return hasPermission(userRole, permission);
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },

  async canAccessContent(
    userId: User["id"],
    ownerId: User["id"],
    permission: Permission,
  ) {
    try {
      const userRole = await this.getUserRole(userId);

      if (userRole === Role.ADMIN) return true;
      if (hasPermission(userRole, permission)) return true;

      if (userId === ownerId) {
        const ownPermission = permission.replace("ANY", "OWN") as Permission;
        return hasPermission(userRole, ownPermission);
      }

      return false;
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },

  // Avatar Methods
  async processUserAvatar(avatar: File | null, userId: User["id"]) {
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

  async uploadUserAvatar(file: File, userId: User["id"]) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = await this.getAvatarFileName(userId, file.name);
      return s3.uploadProfilePhoto(buffer, fileName);
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },

  async getAvatarFileName(userId: User["id"], originalName?: string) {
    const extension = originalName
      ? (originalName.split(".").pop() ?? "jpg")
      : "jpg";
    return `${userId}.${extension}`;
  },

  async generateDefaultAvatar(userId: User["id"]) {
    try {
      return createAvatar(lorelei, {
        seed: userId,
        scale: 125,
      }).toDataUri();
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },

  async fetchMicrosoftAvatar(
    accessToken: Account["access_token"],
    userId: User["id"],
  ) {
    try {
      const response = await fetch(
        "https://graph.microsoft.com/v1.0/me/photo/$value",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

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
