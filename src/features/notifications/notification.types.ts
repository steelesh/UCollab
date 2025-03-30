import type {
  Comment,
  NotificationType,
  Post,
  Notification as PrismaNotification,
  NotificationPreferences as PrismaNotificationPreferences,
  User,
} from "@prisma/client";

export type Notification = {
  id: PrismaNotification["id"];
  userId: PrismaNotification["userId"];
  message: PrismaNotification["message"];
  createdDate: PrismaNotification["createdDate"];
  isRead: PrismaNotification["isRead"];
  type: PrismaNotification["type"];
  postId: PrismaNotification["postId"];
  commentId: PrismaNotification["commentId"];
  triggeredById: PrismaNotification["triggeredById"];
  triggeredBy?: {
    id: User["id"];
    username: User["username"];
    avatar: User["avatar"];
  };
};

export type NotificationPreferences = {
  id: PrismaNotificationPreferences["id"];
  userId: PrismaNotificationPreferences["userId"];
  enabled: PrismaNotificationPreferences["enabled"];
  allowComments: PrismaNotificationPreferences["allowComments"];
  allowMentions: PrismaNotificationPreferences["allowMentions"];
  allowPostUpdates: PrismaNotificationPreferences["allowPostUpdates"];
  allowSystem: PrismaNotificationPreferences["allowSystem"];
};

export type NotificationsPageData = {
  notifications: Notification[];
  totalPages: number;
  currentPage: number;
  limit: number;
  totalCount: number;
};

export type CreateNotificationData = {
  userId: User["id"];
  type: NotificationType;
  message: PrismaNotification["message"];
  postId?: Post["id"];
  commentId?: Comment["id"];
  triggeredById?: User["id"];
};

export type CreateBatchNotificationData = Omit<CreateNotificationData, "userId"> & {
  userIds: User["id"][];
};
