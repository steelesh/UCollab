import {
  Comment,
  Notification,
  NotificationPreferences,
  NotificationType,
  Post,
  User,
} from "@prisma/client";
import {
  CreateBatchNotificationInput,
  UpdateNotificationPreferencesInput,
  CreateNotificationInput,
} from "../schemas/notification.schema";
import { db } from "../data/mysql";
import { mq } from "../data/mq";
import { CommentService } from "./comment.service";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { UserService } from "./user.service";
import { Permission } from "../lib/permissions";

export const NotificationService = {
  async getUserNotifications(userId: User["id"], requestUserId: string) {
    try {
      if (
        !(await UserService.canAccessContent(
          requestUserId,
          userId,
          Permission.VIEW_ANY_NOTIFICATION,
        ))
      ) {
        throw new Error("Unauthorized: Cannot view notifications");
      }
      return await db.notification.findMany({
        where: { userId },
        select: {
          id: true,
          message: true,
          createdDate: true,
          isRead: true,
          type: true,
          postId: true,
          commentId: true,
          triggeredBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdDate: "desc" },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch notifications: ${error.message}`
          : "Failed to fetch notifications",
      );
    }
  },

  async getUserNotificationsCount(userId: User["id"], requestUserId: string) {
    try {
      if (
        !(await UserService.canAccessContent(
          requestUserId,
          userId,
          Permission.VIEW_OWN_NOTIFICATION,
        ))
      ) {
        throw new Error("Unauthorized: Cannot view notification count");
      }
      return db.notification.count({
        where: { userId },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch notification count: ${error.message}`
          : "Failed to fetch notification count",
      );
    }
  },

  async getUserNotificationsByStatus(
    userId: User["id"],
    isRead: Notification["isRead"],
    requestUserId: string,
  ) {
    try {
      if (
        !(await UserService.canAccessContent(
          requestUserId,
          userId,
          Permission.VIEW_OWN_NOTIFICATION,
        ))
      ) {
        throw new Error("Unauthorized: Cannot view notifications");
      }
      return db.notification.findMany({
        where: {
          userId,
          isRead,
        },
        select: {
          id: true,
          message: true,
          createdDate: true,
          isRead: true,
          type: true,
          postId: true,
          commentId: true,
          triggeredBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdDate: "desc" },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch notifications by status: ${error.message}`
          : "Failed to fetch notifications by status",
      );
    }
  },

  async getUserNotificationPreferences(
    userId: User["id"],
    requestUserId: string,
  ) {
    try {
      if (
        !(await UserService.canAccessContent(
          requestUserId,
          userId,
          Permission.MANAGE_NOTIFICATION_PREFERENCES,
        ))
      ) {
        throw new Error("Unauthorized: Cannot view notification preferences");
      }
      return db.notificationPreferences.findUnique({
        where: { userId },
        select: {
          enabled: true,
          allowComments: true,
          allowMentions: true,
          allowPostUpdates: true,
          allowSystem: true,
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch notification preferences: ${error.message}`
          : "Failed to fetch notification preferences",
      );
    }
  },

  async getReadNotificationsCount(userId: User["id"], requestUserId: string) {
    try {
      if (
        !(await UserService.canAccessContent(
          requestUserId,
          userId,
          Permission.VIEW_OWN_NOTIFICATION,
        ))
      ) {
        throw new Error("Unauthorized: Cannot view notification count");
      }
      return db.notification.count({
        where: {
          userId,
          isRead: true,
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch read notification count: ${error.message}`
          : "Failed to fetch read notification count",
      );
    }
  },

  async getUnreadNotificationsCount(userId: User["id"], requestUserId: string) {
    try {
      if (
        !(await UserService.canAccessContent(
          requestUserId,
          userId,
          Permission.VIEW_OWN_NOTIFICATION,
        ))
      ) {
        throw new Error("Unauthorized: Cannot view notification count");
      }
      return db.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch unread notification count: ${error.message}`
          : "Failed to fetch unread notification count",
      );
    }
  },

  async markNotificationAsRead(id: Notification["id"], requestUserId: string) {
    try {
      const notification = await db.notification.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!notification) {
        notFound();
      }

      if (
        !(await UserService.canAccessContent(
          requestUserId,
          notification.userId,
          Permission.UPDATE_ANY_NOTIFICATION,
        ))
      ) {
        throw new Error("Unauthorized: Cannot update notification");
      }

      return await db.notification.update({
        where: { id },
        data: { isRead: true },
        select: {
          id: true,
          isRead: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          notFound();
        }
      }
      throw new Error(
        error instanceof Error
          ? `Failed to mark notification as read: ${error.message}`
          : "Failed to mark notification as read",
      );
    }
  },

  async markAllNotificationsAsRead(userId: User["id"], requestUserId: string) {
    try {
      if (
        !(await UserService.canAccessContent(
          requestUserId,
          userId,
          Permission.UPDATE_OWN_NOTIFICATION,
        ))
      ) {
        throw new Error("Unauthorized: Cannot update notifications");
      }
      return await db.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to mark all notifications as read: ${error.message}`
          : "Failed to mark all notifications as read",
      );
    }
  },

  async createNotification(data: CreateNotificationInput) {
    try {
      return await db.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          message: data.message,
          postId: data.postId,
          commentId: data.commentId,
          triggeredById: data.triggeredById,
        },
        select: {
          id: true,
          message: true,
          type: true,
          createdDate: true,
          isRead: true,
          postId: true,
          commentId: true,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        throw error;
      }
      throw new Error(
        error instanceof Error
          ? `Failed to create notification: ${error.message}`
          : "Failed to create notification",
      );
    }
  },

  async queueNotification(data: CreateNotificationInput) {
    try {
      const preferences = await db.notificationPreferences.findUnique({
        where: { userId: data.userId },
        select: {
          id: true,
          userId: true,
          enabled: true,
          allowComments: true,
          allowMentions: true,
          allowPostUpdates: true,
          allowSystem: true,
        },
      });

      if (!preferences || !this.shouldSend(data.type, preferences)) {
        return null;
      }

      return await mq.addNotification(data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to queue notification: ${error.message}`
          : "Failed to queue notification",
      );
    }
  },

  async queueBatchNotifications(data: CreateBatchNotificationInput) {
    const preferences = await db.notificationPreferences.findMany({
      where: { userId: { in: data.userIds } },
      select: {
        id: true,
        userId: true,
        enabled: true,
        allowComments: true,
        allowMentions: true,
        allowPostUpdates: true,
        allowSystem: true,
      },
    });

    const validUserIds = data.userIds.filter((userId) => {
      const userPrefs = preferences.find((p) => p.userId === userId);
      return userPrefs && this.shouldSend(data.type, userPrefs);
    });

    if (validUserIds.length === 0) return [];

    return mq.addBatchNotifications({
      ...data,
      userIds: validUserIds,
    });
  },

  async updateNotificationPreferences(
    data: UpdateNotificationPreferencesInput,
    requestUserId: string,
  ) {
    try {
      if (
        !(await UserService.canAccessContent(
          requestUserId,
          data.userId,
          Permission.UPDATE_ANY_NOTIFICATION,
        ))
      ) {
        throw new Error("Unauthorized: Cannot update notification preferences");
      }

      const { userId, ...preferences } = data;

      return await db.notificationPreferences.upsert({
        where: { userId },
        create: {
          userId,
          ...preferences,
        },
        update: preferences,
        select: {
          enabled: true,
          allowComments: true,
          allowMentions: true,
          allowPostUpdates: true,
          allowSystem: true,
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to update notification preferences: ${error.message}`
          : "Failed to update notification preferences",
      );
    }
  },

  async deleteNotification(id: Notification["id"], requestUserId: string) {
    try {
      const notification = await db.notification.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!notification) {
        notFound();
      }

      if (
        !(await UserService.canAccessContent(
          requestUserId,
          notification.userId,
          Permission.DELETE_OWN_NOTIFICATION,
        ))
      ) {
        throw new Error("Unauthorized: Cannot delete notification");
      }

      await db.notification.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          notFound();
        }
      }
      throw new Error(
        error instanceof Error
          ? `Failed to delete notification: ${error.message}`
          : "Failed to delete notification",
      );
    }
  },

  async cleanupOldNotifications(daysToKeep: number = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      await db.notification.deleteMany({
        where: {
          createdDate: {
            lt: cutoffDate,
          },
          isRead: true,
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to cleanup notifications: ${error.message}`
          : "Failed to cleanup notifications",
      );
    }
  },

  async sendCommentNotifications(data: {
    postId: Post["id"];
    postTitle: Post["title"];
    commentId: Comment["id"];
    postAuthorId: User["id"];
    commentAuthorId: User["id"];
    commentAuthorName: User["username"];
    content: Comment["content"];
  }) {
    try {
      const notifications = [];

      const mentionedUserIds = await CommentService.extractMentionedUserIds(
        data.content,
      );

      if (mentionedUserIds.length > 0) {
        notifications.push(
          this.queueBatchNotifications({
            userIds: mentionedUserIds.filter(
              (id) => id !== data.commentAuthorId,
            ),
            type: NotificationType.MENTION,
            message: `${data.commentAuthorName} mentioned you in a comment on: ${data.postTitle}`,
            postId: data.postId,
            commentId: data.commentId,
            triggeredById: data.commentAuthorId,
          }),
        );
      }

      if (
        data.postAuthorId !== data.commentAuthorId &&
        !mentionedUserIds.includes(data.postAuthorId)
      ) {
        notifications.push(
          this.queueNotification({
            userId: data.postAuthorId,
            type: NotificationType.COMMENT,
            message: `${data.commentAuthorName} commented on your post: ${data.postTitle}`,
            postId: data.postId,
            commentId: data.commentId,
            triggeredById: data.commentAuthorId,
          }),
        );
      }

      return Promise.all(notifications);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to send comment notifications: ${error.message}`
          : "Failed to send comment notifications",
      );
    }
  },

  async getPaginatedNotifications(
    userId: User["id"],
    page: number = 1,
    limit: number = 20,
    requestUserId: string,
  ) {
    try {
      if (
        !(await UserService.canAccessContent(
          requestUserId,
          userId,
          Permission.VIEW_OWN_NOTIFICATION,
        ))
      ) {
        throw new Error("Unauthorized: Cannot view notifications");
      }
      return await db.notification.findMany({
        where: { userId },
        select: {
          id: true,
          message: true,
          createdDate: true,
          isRead: true,
          type: true,
          postId: true,
          commentId: true,
          triggeredBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdDate: "desc" },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch paginated notifications: ${error.message}`
          : "Failed to fetch paginated notifications",
      );
    }
  },

  async markMultipleNotificationsAsRead(
    notificationIds: Notification["id"][],
    requestUserId: string,
  ) {
    try {
      // First verify ownership of all notifications
      const notifications = await db.notification.findMany({
        where: { id: { in: notificationIds } },
        select: { id: true, userId: true },
      });

      for (const notification of notifications) {
        if (
          !(await UserService.canAccessContent(
            requestUserId,
            notification.userId,
            Permission.UPDATE_OWN_NOTIFICATION,
          ))
        ) {
          throw new Error("Unauthorized: Cannot update some notifications");
        }
      }

      return await db.notification.updateMany({
        where: { id: { in: notificationIds } },
        data: { isRead: true },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to mark notifications as read: ${error.message}`
          : "Failed to mark notifications as read",
      );
    }
  },

  async shouldSend(
    type: Notification["type"],
    preferences: NotificationPreferences,
  ): Promise<boolean> {
    if (!preferences.enabled) return false;

    const preferencesMap: Record<Notification["type"], boolean> = {
      [NotificationType.COMMENT]: preferences.allowComments,
      [NotificationType.MENTION]: preferences.allowMentions,
      [NotificationType.POST_UPDATE]: preferences.allowPostUpdates,
      [NotificationType.SYSTEM]: preferences.allowSystem,
    };

    return preferencesMap[type] ?? false;
  },
};
