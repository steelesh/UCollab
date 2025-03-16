'use server';

import { NotificationService } from '~/features/notifications/notification.service';
import type { NotificationPreferences } from './notification.types';
import type { Notification, User } from '@prisma/client';

export async function markNotificationAsRead(notificationId: Notification['id'], userId: User['id']) {
  return await NotificationService.markNotificationAsRead(notificationId, userId);
}

export async function markMultipleAsRead(notificationIds: Notification['id'][], userId: User['id']) {
  return await NotificationService.markMultipleNotificationsAsRead(notificationIds, userId);
}

export async function markAllAsRead(userId: User['id'], requestUserId: User['id']) {
  return await NotificationService.markAllNotificationsAsRead(userId, requestUserId);
}

export async function updateNotificationPreferences(
  userId: User['id'],
  preferences: Omit<NotificationPreferences, 'id' | 'userId'>,
) {
  return await NotificationService.updatePreferences(userId, preferences);
}

export async function deleteNotification(notificationId: Notification['id'], userId: User['id']) {
  return await NotificationService.deleteNotification(notificationId, userId);
}
