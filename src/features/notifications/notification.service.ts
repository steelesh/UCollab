import {
  Comment,
  Notification as PrismaNotification,
  NotificationPreferences,
  NotificationType,
  Project,
  Prisma,
  User,
} from '@prisma/client';
import { mq } from '~/lib/mq';
import { withServiceAuth } from '~/security/protected-service';
import { ErrorMessage, Utils } from '~/lib/utils';
import { canAccess } from '~/security/protected-role';
import { CommentService } from '../comments/comment.service';
import { UserService } from '../users/user.service';
import { prisma } from '~/lib/prisma';
import { CreateBatchNotificationData } from './notification.types';
import { CreateNotificationData } from './notification.types';

export const NotificationService = {
  async getUserNotifications(userId: User['id'], requestUserId: string): Promise<PrismaNotification[]> {
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
            projectId: true,
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
          orderBy: { createdDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPaginatedNotifications(
    userId: User['id'],
    page = 1,
    limit = 20,
    requestUserId: User['id'],
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
            projectId: true,
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
          orderBy: { createdDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getNotificationsCount(userId: User['id'], requestUserId: User['id']): Promise<number> {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        return await prisma.notification.count({
          where: { userId },
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getUnreadNotificationsCount(userId: User['id'], requestUserId: User['id']): Promise<number> {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        return await prisma.notification.count({
          where: { userId, isRead: false },
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async markNotificationAsRead(id: PrismaNotification['id'], requestUserId: User['id']): Promise<void> {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!notification) {
        throw new Utils(ErrorMessage.NOT_FOUND('Notification'));
      }

      await withServiceAuth(requestUserId, { ownerId: notification.userId }, async () => {
        await prisma.notification.update({
          where: { id },
          data: { isRead: true },
        });
      });
    } catch (error) {
      if (error instanceof Utils) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Utils(ErrorMessage.NOT_FOUND('Notification'));
      }
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async markAllNotificationsAsRead(userId: User['id'], requestUserId: User['id']): Promise<void> {
    return withServiceAuth(requestUserId, { ownerId: userId }, async () => {
      try {
        await prisma.notification.updateMany({
          where: { userId, isRead: false },
          data: { isRead: true },
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async markMultipleNotificationsAsRead(
    notificationIds: PrismaNotification['id'][],
    requestUserId: User['id'],
  ): Promise<void> {
    try {
      const notifications = await prisma.notification.findMany({
        where: { id: { in: notificationIds } },
        select: { id: true, userId: true },
      });
      const firstNotification = notifications[0];
      if (!firstNotification) {
        throw new Utils(ErrorMessage.NOT_FOUND('Notifications'));
      }

      await withServiceAuth(requestUserId, { ownerId: firstNotification.userId }, async () => {
        const userRole = await UserService.getUserRole(requestUserId);

        for (const notification of notifications) {
          if (!canAccess(requestUserId, notification.userId, userRole)) {
            throw new Utils(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }
        }

        await prisma.notification.updateMany({
          where: { id: { in: notificationIds } },
          data: { isRead: true },
        });
      });
    } catch (error) {
      if (error instanceof Utils) throw error;
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async deleteNotification(id: PrismaNotification['id'], requestUserId: User['id']): Promise<void> {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!notification) {
        throw new Utils(ErrorMessage.NOT_FOUND('Notification'));
      }

      await withServiceAuth(requestUserId, { ownerId: notification.userId }, async () => {
        await prisma.notification.delete({
          where: { id },
        });
      });
    } catch (error) {
      if (error instanceof Utils) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Utils(ErrorMessage.NOT_FOUND('Notification'));
      }
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async queueNotification(data: CreateNotificationData): Promise<void> {
    try {
      await mq.addNotification(data);
    } catch {
      throw new Utils(ErrorMessage.NOTIFICATION_QUEUE_FAILED);
    }
  },

  async queueBatchNotifications(data: CreateBatchNotificationData): Promise<void> {
    try {
      await mq.addBatchNotifications(data);
    } catch {
      throw new Utils(ErrorMessage.NOTIFICATION_QUEUE_FAILED);
    }
  },

  async sendCommentNotifications(data: {
    projectId: Project['id'];
    projectTitle: Project['title'];
    commentId: Comment['id'];
    projectAuthorId: User['id'];
    commentAuthorId: User['id'];
    commentAuthorName: User['username'];
    content: Comment['content'];
    parentCommentAuthorId?: User['id'];
  }): Promise<void> {
    try {
      const notifications: Promise<void>[] = [];
      const mentionedUserIds = await CommentService.extractMentionedUserIds(data.content);

      const uniqueMentionedUsers = mentionedUserIds
        .filter((id) => id !== data.commentAuthorId)
        .filter((id, index, self) => self.indexOf(id) === index);
      if (uniqueMentionedUsers.length > 0) {
        const usersToNotify: User['id'][] = [];

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
              message: `${data.commentAuthorName} mentioned you in a comment on: ${data.projectTitle}`,
              projectId: data.projectId,
              commentId: data.commentId,
              triggeredById: data.commentAuthorId,
            }),
          );
        }
      }

      if (
        data.parentCommentAuthorId &&
        data.parentCommentAuthorId !== data.commentAuthorId &&
        !mentionedUserIds.includes(data.parentCommentAuthorId)
      ) {
        const preferences = await this.getNotificationPreferences(data.parentCommentAuthorId);
        if (await this.shouldSend(NotificationType.COMMENT, preferences)) {
          notifications.push(
            this.queueNotification({
              userId: data.parentCommentAuthorId,
              type: NotificationType.COMMENT,
              message: `${data.commentAuthorName} replied to your comment on: ${data.projectTitle}`,
              projectId: data.projectId,
              commentId: data.commentId,
              triggeredById: data.commentAuthorId,
            }),
          );
        }
      }

      const shouldNotifyPostAuthor =
        data.projectAuthorId !== data.commentAuthorId && !mentionedUserIds.includes(data.projectAuthorId);

      if (shouldNotifyPostAuthor) {
        const preferences = await this.getNotificationPreferences(data.projectAuthorId);
        if (await this.shouldSend(NotificationType.COMMENT, preferences)) {
          notifications.push(
            this.queueNotification({
              userId: data.projectAuthorId,
              type: NotificationType.COMMENT,
              message: `${data.commentAuthorName} commented on your post: ${data.projectTitle}`,
              projectId: data.projectId,
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

  async getNotificationPreferences(userId: User['id']): Promise<NotificationPreferences | null> {
    try {
      return await prisma.notificationPreferences.findUnique({
        where: { userId },
      });
    } catch {
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async shouldSend(type: NotificationType, preferences: NotificationPreferences | null): Promise<boolean> {
    console.log('Checking notification preferences:', { type, preferences });
    if (!preferences?.enabled) {
      console.log('Notifications disabled or no preferences found');
      return false;
    }

    const preferencesMap: Record<NotificationType, boolean> = {
      [NotificationType.COMMENT]: preferences.allowComments,
      [NotificationType.MENTION]: preferences.allowMentions,
      [NotificationType.PROJECT_UPDATE]: preferences.allowProjectUpdates,
      [NotificationType.SYSTEM]: preferences.allowSystem,
    };

    const shouldSend = preferencesMap[type] ?? false;
    console.log(`Should send ${type} notification:`, shouldSend);
    return shouldSend;
  },

  async createNotification(data: CreateNotificationData) {
    try {
      return await prisma.notification.create({
        data: {
          message: data.message,
          type: data.type,
          userId: data.userId,
          projectId: data.projectId,
          commentId: data.commentId,
          triggeredById: data.triggeredById,
        },
      });
    } catch {
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async updatePreferences(userId: User['id'], preferences: Omit<NotificationPreferences, 'id' | 'userId'>) {
    return prisma.notificationPreferences.upsert({
      where: { userId },
      create: {
        userId,
        ...preferences,
      },
      update: preferences,
    });
  },
};
