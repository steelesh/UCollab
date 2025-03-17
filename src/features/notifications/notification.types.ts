import {
  NotificationType,
  Comment,
  Project,
  User,
  Notification as PrismaNotification,
  NotificationPreferences as PrismaNotificationPreferences,
} from '@prisma/client';

export interface Notification {
  id: PrismaNotification['id'];
  userId: PrismaNotification['userId'];
  message: PrismaNotification['message'];
  createdDate: PrismaNotification['createdDate'];
  isRead: PrismaNotification['isRead'];
  type: PrismaNotification['type'];
  projectId: PrismaNotification['projectId'];
  commentId: PrismaNotification['commentId'];
  triggeredById: PrismaNotification['triggeredById'];
  triggeredBy?: {
    id: User['id'];
    username: User['username'];
    avatar: User['avatar'];
  };
}

export interface NotificationPreferences {
  id: PrismaNotificationPreferences['id'];
  userId: PrismaNotificationPreferences['userId'];
  enabled: PrismaNotificationPreferences['enabled'];
  allowComments: PrismaNotificationPreferences['allowComments'];
  allowMentions: PrismaNotificationPreferences['allowMentions'];
  allowProjectUpdates: PrismaNotificationPreferences['allowProjectUpdates'];
  allowSystem: PrismaNotificationPreferences['allowSystem'];
}

export interface CreateNotificationData {
  userId: User['id'];
  type: NotificationType;
  message: PrismaNotification['message'];
  projectId?: Project['id'];
  commentId?: Comment['id'];
  triggeredById?: User['id'];
}

export type CreateBatchNotificationData = Omit<CreateNotificationData, 'userId'> & {
  userIds: User['id'][];
};
