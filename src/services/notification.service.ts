import {
  type Comment,
  type Notification,
  type NotificationPreferences,
  NotificationType,
  type Post,
  Prisma,
  type User,
} from "@prisma/client";
import { mq } from "~/data/mq";
import { prisma } from "~/lib/prisma";
import { withServiceAuth } from "~/lib/auth/protected-service";
import { ErrorMessage } from "~/lib/constants";
import { AppError, AuthorizationError } from "~/lib/errors/app-error";
import { Permission } from "~/lib/permissions";
import {
  type CreateBatchNotificationData,
  type CreateNotificationData,
} from "~/schemas/notification.schema";
import { CommentService } from "./comment.service";
import { UserService } from "./user.service";

const notificationSelect = {
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
} as const;

export const NotificationService = {
  // Read Operations
  async getUserNotifications(userId: User["id"], requestUserId: string) {
    return withServiceAuth(
      requestUserId,
      Permission.VIEW_ANY_NOTIFICATION,
      async () => {
        try {
          if (
            !(await UserService.canAccessContent(
              requestUserId,
              userId,
              Permission.VIEW_ANY_NOTIFICATION,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

          return await prisma.notification.findMany({
            where: { userId },
            select: notificationSelect,
            orderBy: { createdDate: "desc" },
          });
        } catch (error) {
          if (error instanceof AppError) throw error;
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  async getUserNotificationsByStatus(
    userId: User["id"],
    isRead: boolean,
    requestUserId: string,
  ) {
    return withServiceAuth(
      requestUserId,
      Permission.VIEW_ANY_NOTIFICATION,
      async () => {
        try {
          if (
            !(await UserService.canAccessContent(
              requestUserId,
              userId,
              Permission.VIEW_ANY_NOTIFICATION,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

          return await prisma.notification.findMany({
            where: { userId, isRead },
            select: notificationSelect,
            orderBy: { createdDate: "desc" },
          });
        } catch (error) {
          if (error instanceof AppError) throw error;
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  async getPaginatedNotifications(
    userId: User["id"],
    page = 1,
    limit = 20,
    requestUserId: string,
  ) {
    return withServiceAuth(
      requestUserId,
      Permission.VIEW_ANY_NOTIFICATION,
      async () => {
        try {
          if (
            !(await UserService.canAccessContent(
              requestUserId,
              userId,
              Permission.VIEW_ANY_NOTIFICATION,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

          return await prisma.notification.findMany({
            where: { userId },
            select: notificationSelect,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdDate: "desc" },
          });
        } catch (error) {
          if (error instanceof AppError) throw error;
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  // Count Operations
  async getNotificationsCount(userId: User["id"], requestUserId: string) {
    return withServiceAuth(
      requestUserId,
      Permission.VIEW_ANY_NOTIFICATION,
      async () => {
        try {
          if (
            !(await UserService.canAccessContent(
              requestUserId,
              userId,
              Permission.VIEW_ANY_NOTIFICATION,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

          return await prisma.notification.count({
            where: { userId },
          });
        } catch (error) {
          if (error instanceof AppError) throw error;
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  async getUnreadNotificationsCount(userId: User["id"], requestUserId: string) {
    return withServiceAuth(
      requestUserId,
      Permission.VIEW_ANY_NOTIFICATION,
      async () => {
        try {
          if (
            !(await UserService.canAccessContent(
              requestUserId,
              userId,
              Permission.VIEW_ANY_NOTIFICATION,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

          return await prisma.notification.count({
            where: { userId, isRead: false },
          });
        } catch (error) {
          if (error instanceof AppError) throw error;
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  // Update Operations
  async markNotificationAsRead(id: Notification["id"], requestUserId: string) {
    return withServiceAuth(
      requestUserId,
      Permission.UPDATE_ANY_NOTIFICATION,
      async () => {
        try {
          const notification = await prisma.notification.findUnique({
            where: { id },
            select: { id: true, userId: true },
          });

          if (!notification) {
            throw new AppError(ErrorMessage.NOT_FOUND("Notification"));
          }

          if (
            !(await UserService.canAccessContent(
              requestUserId,
              notification.userId,
              Permission.UPDATE_ANY_NOTIFICATION,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

          return await prisma.notification.update({
            where: { id },
            data: { isRead: true },
            select: notificationSelect,
          });
        } catch (error) {
          if (error instanceof AppError) throw error;
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
          ) {
            throw new AppError(ErrorMessage.NOT_FOUND("Notification"));
          }
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  async markAllNotificationsAsRead(userId: User["id"], requestUserId: string) {
    return withServiceAuth(
      requestUserId,
      Permission.UPDATE_ANY_NOTIFICATION,
      async () => {
        try {
          if (
            !(await UserService.canAccessContent(
              requestUserId,
              userId,
              Permission.UPDATE_ANY_NOTIFICATION,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

          return await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
          });
        } catch (error) {
          if (error instanceof AppError) throw error;
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  async markMultipleNotificationsAsRead(
    notificationIds: Notification["id"][],
    requestUserId: string,
  ) {
    return withServiceAuth(
      requestUserId,
      Permission.UPDATE_OWN_NOTIFICATION,
      async () => {
        try {
          const notifications = await prisma.notification.findMany({
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
              throw new AuthorizationError(
                ErrorMessage.INSUFFICIENT_PERMISSIONS,
              );
            }
          }

          return await prisma.notification.updateMany({
            where: { id: { in: notificationIds } },
            data: { isRead: true },
          });
        } catch (error) {
          if (error instanceof AppError) throw error;
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  // Notification Creation and Queue Operations
  // Private Queue Methods
  async queueNotification(data: CreateNotificationData): Promise<void> {
    try {
      await mq.addNotification(data);
    } catch {
      throw new AppError(ErrorMessage.NOTIFICATION_QUEUE_FAILED);
    }
  },

  async queueBatchNotifications(
    data: CreateBatchNotificationData,
  ): Promise<void> {
    try {
      await mq.addBatchNotifications(data);
    } catch {
      throw new AppError(ErrorMessage.NOTIFICATION_QUEUE_FAILED);
    }
  },

  // Cleanup Operations
  async cleanupOldNotifications(daysToKeep = 30): Promise<void> {
    return withServiceAuth(undefined, Permission.ACCESS_ADMIN, async () => {
      try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        await prisma.notification.deleteMany({
          where: {
            createdDate: {
              lt: cutoffDate,
            },
            isRead: true,
          },
        });
      } catch {
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Notification Sending
  async sendCommentNotifications(data: {
    postId: Post["id"];
    postTitle: Post["title"];
    commentId: Comment["id"];
    postAuthorId: User["id"];
    commentAuthorId: User["id"];
    commentAuthorName: User["username"];
    content: Comment["content"];
  }): Promise<void> {
    try {
      const notifications: Promise<void>[] = [];
      const mentionedUserIds = await CommentService.extractMentionedUserIds(
        data.content,
      );

      // Handle mentions notifications
      const uniqueMentionedUsers = mentionedUserIds
        .filter((id) => id !== data.commentAuthorId)
        .filter((id, index, self) => self.indexOf(id) === index);

      if (uniqueMentionedUsers.length > 0 && uniqueMentionedUsers[0]) {
        const preferences = await this.getNotificationPreferences(
          uniqueMentionedUsers[0],
        );
        if (await this.shouldSend(NotificationType.MENTION, preferences)) {
          notifications.push(
            this.queueBatchNotifications({
              userIds: uniqueMentionedUsers,
              type: NotificationType.MENTION,
              message: `${data.commentAuthorName} mentioned you in a comment on: ${data.postTitle}`,
              postId: data.postId,
              commentId: data.commentId,
              triggeredById: data.commentAuthorId,
            }),
          );
        }
      }

      // Handle post author notification
      const shouldNotifyPostAuthor =
        data.postAuthorId !== data.commentAuthorId &&
        !mentionedUserIds.includes(data.postAuthorId);

      if (shouldNotifyPostAuthor) {
        const preferences = await this.getNotificationPreferences(
          data.postAuthorId,
        );
        if (await this.shouldSend(NotificationType.COMMENT, preferences)) {
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
      }

      await Promise.all(notifications);
    } catch (error) {
      throw new AppError(
        error instanceof Error
          ? `${ErrorMessage.NOTIFICATION_QUEUE_FAILED}: ${error.message}`
          : ErrorMessage.NOTIFICATION_QUEUE_FAILED,
      );
    }
  },

  async getNotificationPreferences(
    userId: User["id"],
  ): Promise<NotificationPreferences | null> {
    try {
      return await prisma.notificationPreferences.findUnique({
        where: { userId },
      });
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },

  async shouldSend(
    type: Notification["type"],
    preferences: NotificationPreferences | null,
  ): Promise<boolean> {
    if (!preferences?.enabled) return false;

    const preferencesMap: Record<Notification["type"], boolean> = {
      [NotificationType.COMMENT]: preferences.allowComments,
      [NotificationType.MENTION]: preferences.allowMentions,
      [NotificationType.POST_UPDATE]: preferences.allowPostUpdates,
      [NotificationType.SYSTEM]: preferences.allowSystem,
    };

    return preferencesMap[type] ?? false;
  },

  // Add this method to NotificationService
  async createNotification(data: CreateNotificationData) {
    try {
      return await prisma.notification.create({
        data: {
          message: data.message,
          type: data.type,
          userId: data.userId,
          postId: data.postId,
          commentId: data.commentId,
          triggeredById: data.triggeredById,
        },
      });
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },
};
