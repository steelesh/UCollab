import type {
  Comment,
  NotificationPreferences,
  Post,
  Notification as PrismaNotification,
  User,
} from "@prisma/client";

import {
  NotificationType,
  Prisma,
} from "@prisma/client";

import { prisma } from "~/lib/prisma";
import { ErrorMessage, Utils } from "~/lib/utils";
import { withServiceAuth } from "~/security/protected-service";

import type { CreateBatchNotificationData, CreateNotificationData } from "./notification.types";

import { CommentService } from "../comments/comment.service";
import { UserService } from "../users/user.service";

export const NotificationService = {
  async getUserNotifications(userId: User["id"], requestUserId: string): Promise<PrismaNotification[]> {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        return await prisma.notification.findMany({
          where: { userId },
          select: {
            id: true,
            userId: true,
            message: true,
            createdDate: true,
            isRead: true,
            type: true,
            postId: true,
            commentId: true,
            triggeredById: true,
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
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPaginatedNotifications(
    userId: User["id"],
    requestUserId: User["id"],
    page = 1,
    limit = 20,
  ): Promise<PrismaNotification[]> {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        return await prisma.notification.findMany({
          where: { userId },
          select: {
            id: true,
            userId: true,
            message: true,
            createdDate: true,
            isRead: true,
            type: true,
            postId: true,
            commentId: true,
            triggeredById: true,
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
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getNotificationsCount(userId: User["id"], requestUserId: User["id"]): Promise<number> {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        return await prisma.notification.count({
          where: { userId },
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getUnreadNotificationsCount(userId: User["id"], requestUserId: User["id"]): Promise<number> {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        return await prisma.notification.count({
          where: { userId, isRead: false },
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async markNotificationAsRead(id: PrismaNotification["id"], requestUserId: User["id"]): Promise<void> {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!notification) {
        throw new Utils(ErrorMessage.NOT_FOUND("Notification"));
      }

      await withServiceAuth(requestUserId, { ownerId: notification.userId }, async () => {
        await prisma.notification.update({
          where: { id },
          data: { isRead: true },
        });
      });
    } catch (error) {
      if (error instanceof Utils)
        throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new Utils(ErrorMessage.NOT_FOUND("Notification"));
      }
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async markAllNotificationsAsRead(userId: User["id"], requestUserId: User["id"]): Promise<void> {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        await prisma.notification.updateMany({
          where: { userId, isRead: false },
          data: { isRead: true },
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async markMultipleNotificationsAsRead(
    notificationIds: PrismaNotification["id"][],
    requestUserId: User["id"],
  ): Promise<void> {
    try {
      const notifications = await prisma.notification.findMany({
        where: { id: { in: notificationIds } },
        select: { id: true, userId: true },
      });
      const firstNotification = notifications[0];
      if (!firstNotification) {
        throw new Utils(ErrorMessage.NOT_FOUND("Notifications"));
      }

      await withServiceAuth(requestUserId, { ownerId: firstNotification.userId }, async () => {
        for (const notification of notifications) {
          if (!(await UserService.canAccess(requestUserId, notification.userId))) {
            throw new Utils(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }
        }

        await prisma.notification.updateMany({
          where: { id: { in: notificationIds } },
          data: { isRead: true },
        });
      });
    } catch (error) {
      if (error instanceof Utils)
        throw error;
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async deleteNotification(id: PrismaNotification["id"], requestUserId: User["id"]): Promise<void> {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!notification) {
        throw new Utils(ErrorMessage.NOT_FOUND("Notification"));
      }

      await withServiceAuth(requestUserId, { ownerId: notification.userId }, async () => {
        await prisma.notification.delete({
          where: { id },
        });
      });
    } catch (error) {
      if (error instanceof Utils)
        throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new Utils(ErrorMessage.NOT_FOUND("Notification"));
      }
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async queueNotification(data: CreateNotificationData): Promise<void> {
    try {
      await this.createNotification(data);
    } catch {
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async queueBatchNotifications(data: CreateBatchNotificationData): Promise<void> {
    try {
      const notifications = data.userIds.map(userId => ({
        message: data.message,
        type: data.type,
        userId,
        postId: data.postId,
        commentId: data.commentId,
        triggeredById: data.triggeredById,
      }));

      await prisma.notification.createMany({
        data: notifications,
      });
    } catch {
      throw new Utils(ErrorMessage.OPERATION_FAILED);
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
    parentCommentAuthorId?: User["id"];
  }): Promise<void> {
    try {
      const notifications: Promise<void>[] = [];
      const mentionedUserIds = await CommentService.extractMentionedUserIds(data.content);

      const uniqueMentionedUsers = mentionedUserIds
        .filter(id => id !== data.commentAuthorId)
        .filter((id, index, self) => self.indexOf(id) === index);
      if (uniqueMentionedUsers.length > 0) {
        const usersToNotify: User["id"][] = [];

        for (const userId of uniqueMentionedUsers) {
          const preferences = await this.getNotificationPreferences(userId);
          if (await this.shouldSend(NotificationType.MENTION, preferences)) {
            usersToNotify.push(userId);
          }
        }

        if (usersToNotify.length > 0) {
          notifications.push(
            this.queueBatchNotifications({
              userIds: usersToNotify,
              type: NotificationType.MENTION,
              message: `${data.commentAuthorName} mentioned you in a comment on: ${data.postTitle}`,
              postId: data.postId,
              commentId: data.commentId,
              triggeredById: data.commentAuthorId,
            }),
          );
        }
      }

      if (
        data.parentCommentAuthorId
        && data.parentCommentAuthorId !== data.commentAuthorId
        && !mentionedUserIds.includes(data.parentCommentAuthorId)
      ) {
        const preferences = await this.getNotificationPreferences(data.parentCommentAuthorId);
        if (await this.shouldSend(NotificationType.COMMENT, preferences)) {
          notifications.push(
            this.queueNotification({
              userId: data.parentCommentAuthorId,
              type: NotificationType.COMMENT,
              message: `${data.commentAuthorName} replied to your comment on: ${data.postTitle}`,
              postId: data.postId,
              commentId: data.commentId,
              triggeredById: data.commentAuthorId,
            }),
          );
        }
      }

      const shouldNotifyPostAuthor
        = data.postAuthorId !== data.commentAuthorId && !mentionedUserIds.includes(data.postAuthorId);

      if (shouldNotifyPostAuthor) {
        const preferences = await this.getNotificationPreferences(data.postAuthorId);
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
      throw new Utils(
        error instanceof Error
          ? `${ErrorMessage.NOTIFICATION_QUEUE_FAILED}: ${error.message}`
          : ErrorMessage.NOTIFICATION_QUEUE_FAILED,
      );
    }
  },

  async getNotificationPreferences(userId: User["id"]): Promise<NotificationPreferences | null> {
    try {
      return await prisma.notificationPreferences.findUnique({
        where: { userId },
      });
    } catch {
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async shouldSend(type: NotificationType, preferences: NotificationPreferences | null): Promise<boolean> {
    if (!preferences?.enabled) {
      return false;
    }

    const preferencesMap: Record<NotificationType, boolean> = {
      [NotificationType.COMMENT]: preferences.allowComments,
      [NotificationType.MENTION]: preferences.allowMentions,
      [NotificationType.POST_UPDATE]: preferences.allowPostUpdates,
      [NotificationType.SYSTEM]: preferences.allowSystem,
      [NotificationType.RATING]: preferences.allowRatings,
    };

    const shouldSend = preferencesMap[type] ?? false;
    return shouldSend;
  },

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
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },
};
