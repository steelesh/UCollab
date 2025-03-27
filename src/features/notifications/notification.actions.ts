"use server";

import type { Notification, User } from "@prisma/client";

import { NotificationService } from "~/features/notifications/notification.service";

export async function markNotificationAsRead(notificationId: Notification["id"], userId: User["id"]) {
  return await NotificationService.markNotificationAsRead(notificationId, userId);
}

export async function markMultipleAsRead(notificationIds: Notification["id"][], userId: User["id"]) {
  return await NotificationService.markMultipleNotificationsAsRead(notificationIds, userId);
}

export async function markAllAsRead(userId: User["id"], requestUserId: User["id"]) {
  return await NotificationService.markAllNotificationsAsRead(userId, requestUserId);
}

export async function deleteNotification(notificationId: Notification["id"], userId: User["id"]) {
  return await NotificationService.deleteNotification(notificationId, userId);
}
