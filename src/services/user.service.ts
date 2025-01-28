import { lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Account, AvatarSource, Prisma, Role, User } from "@prisma/client";
import { notFound } from "next/navigation";
import { db } from "../data/mysql";
import { s3 } from "../data/s3";
import { hasPermission, Permission } from "../lib/permissions";
import { UpdateUserInput } from "../schemas/user.schema";

export const UserService = {
  async getUser(username: User["username"]) {
    try {
      return await db.user.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          fullName: true,
          avatar: true,
        },
      });
    } catch {
      throw new Error("Failed to fetch user");
    }
  },

  async getHomePageUser(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        fullName: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
      },
    });
    return user;
  },

  async getUsers() {
    try {
      return await db.user.findMany({
        select: {
          id: true,
          username: true,
          fullName: true,
          avatar: true,
        },
        orderBy: { createdDate: "desc" },
      });
    } catch {
      throw new Error("Failed to fetch users");
    }
  },

  async getDirectoryUsers() {
    try {
      // if (
      //   requestUserId &&
      //   !(await this.hasPermission(requestUserId, Permission.VIEW_USERS_LIST))
      // ) {
      //   throw new Error("Unauthorized: Cannot view users list");
      // }

      return await db.user.findMany({
        select: {
          id: true,
          username: true,
          fullName: true,
          avatar: true,
          role: true,
          createdDate: true,
        },
        orderBy: { createdDate: "desc" },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch directory users: ${error.message}`
          : "Failed to fetch directory users",
      );
    }
  },

  async searchUsers(query: string) {
    try {
      return await db.user.findMany({
        where: { username: { startsWith: query } },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
        take: 5,
        orderBy: { username: "asc" },
      });
    } catch {
      throw new Error("Failed to search users");
    }
  },

  async getUserDetails(userId: User["id"], requestUserId: User["id"]) {
    try {
      if (
        !(await this.canAccessContent(
          requestUserId,
          userId,
          Permission.VIEW_USERS,
        ))
      ) {
        throw new Error("Unauthorized: Cannot access user details");
      }

      return await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          firstName: true,
          lastName: true,
          avatar: true,
          avatarSource: true,
          onboardingStep: true,
        },
      });
    } catch {
      throw new Error("Failed to fetch user details");
    }
  },

  async updateUser(
    userId: User["id"],
    data: UpdateUserInput,
    requestUserId: User["id"],
  ) {
    try {
      if (
        !(await this.canAccessContent(
          requestUserId,
          userId,
          Permission.UPDATE_ANY_USER,
        ))
      ) {
        throw new Error("Unauthorized: Cannot update user");
      }

      const { avatar: avatarFile, ...updateFields } = data;
      const updates: Prisma.UserUpdateInput = { ...updateFields };

      if (avatarFile !== undefined) {
        updates.avatar = await this.processUserAvatar(avatarFile, userId);
        updates.avatarSource = updates.avatar
          ? AvatarSource.UPLOAD
          : AvatarSource.DEFAULT;
      }

      return await db.user.update({
        where: { id: userId },
        data: updates,
        select: {
          id: true,
          username: true,
          fullName: true,
          avatar: true,
          avatarSource: true,
          onboardingStep: true,
        },
      });
    } catch {
      throw new Error("Failed to update user");
    }
  },

  async getAdminUserDetails(userId: User["id"], requestUserId: User["id"]) {
    try {
      if (!(await this.hasPermission(requestUserId, Permission.VIEW_USERS))) {
        throw new Error("Unauthorized: Insufficient permissions");
      }

      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          firstName: true,
          lastName: true,
          createdDate: true,
          lastLogin: true,
          role: true,
          onboardingStep: true,
          avatar: true,
          avatarSource: true,
          profile: true,
        },
      });

      if (!user) notFound();
      return user;
    } catch {
      throw new Error("Failed to fetch admin user details");
    }
  },

  async updateUserRole(
    userId: User["id"],
    newRole: Role,
    requestUserId: User["id"],
  ) {
    try {
      if (!(await this.hasPermission(requestUserId, Permission.MANAGE_ROLES))) {
        throw new Error("Unauthorized: Cannot manage roles");
      }

      return await db.user.update({
        where: { id: userId },
        data: { role: newRole },
        select: {
          id: true,
          username: true,
          role: true,
        },
      });
    } catch {
      throw new Error("Failed to update user role");
    }
  },

  async deleteUser(userId: User["id"], requestUserId: User["id"]) {
    try {
      if (
        !(await this.hasPermission(requestUserId, Permission.DELETE_ANY_USER))
      ) {
        throw new Error("Unauthorized: Cannot delete user");
      }

      await db.$transaction(async (tx) => {
        return tx.user.delete({ where: { id: userId } });
      });
    } catch {
      throw new Error("Failed to delete user");
    }
  },

  async getAvatarFileName(userId: User["id"], originalName?: string) {
    try {
      const extension = originalName
        ? (originalName.split(".").pop() ?? "jpg")
        : "jpg";
      return `${userId}.${extension}`;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to generate avatar filename: ${error.message}`
          : "Failed to generate avatar filename",
      );
    }
  },

  async processUserAvatar(avatar: File | null, userId: User["id"]) {
    try {
      if (avatar === null) {
        return this.generateDefaultAvatar(userId);
      }
      if (avatar instanceof File) {
        return this.uploadUserAvatar(avatar, userId);
      }
      return undefined;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to process avatar: ${error.message}`
          : "Failed to process avatar",
      );
    }
  },

  async uploadUserAvatar(file: File, userId: User["id"]) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = await this.getAvatarFileName(userId, file.name);
      return s3.uploadProfilePhoto(buffer, fileName);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to upload avatar: ${error.message}`
          : "Failed to upload avatar",
      );
    }
  },

  async generateDefaultAvatar(userId: User["id"]) {
    try {
      return createAvatar(lorelei, {
        seed: userId,
        scale: 125,
      }).toDataUri();
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to generate default avatar: ${error.message}`
          : "Failed to generate default avatar",
      );
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
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) return null;

      const blob = await response.blob();
      const buffer = Buffer.from(await blob.arrayBuffer());
      const fileName = await this.getAvatarFileName(userId);

      return s3.uploadProfilePhoto(buffer, fileName);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch Microsoft avatar: ${error.message}`
          : "Failed to fetch Microsoft avatar",
      );
    }
  },

  async getUserRole(userId: User["id"]) {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        notFound();
      }

      return user.role;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch user role: ${error.message}`
          : "Failed to fetch user role",
      );
    }
  },

  async hasPermission(userId: User["id"], permission: Permission) {
    try {
      const userRole = await this.getUserRole(userId);
      return hasPermission(userRole, permission);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to check permission: ${error.message}`
          : "Failed to check permission",
      );
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
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to check content access: ${error.message}`
          : "Failed to check content access",
      );
    }
  },
};
