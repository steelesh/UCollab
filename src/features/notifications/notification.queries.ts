'use server';

import { NotificationService } from './notification.service';
import type { Notification } from './notification.types';
import { User } from '@prisma/client';

export interface NotificationsPageData {
  notifications: Notification[];
  totalPages: number;
  currentPage: number;
  limit: number;
  totalCount: number;
}

export async function getUserNotifications(userId: User['id'], requestUserId: User['id']): Promise<Notification[]> {
  return NotificationService.getUserNotifications(userId, requestUserId);
}

export async function getUnreadCount(userId: User['id'], requestUserId: User['id']): Promise<number> {
  return NotificationService.getUnreadNotificationsCount(userId, requestUserId);
}

export async function getUnreadNotificationsCount(userId: User['id'], requestUserId: User['id']): Promise<number> {
  return getUnreadCount(userId, requestUserId);
}

export async function getCurrentUserNotifications(userId: User['id'], requestUserId: User['id']) {
  return await getUserNotifications(userId, requestUserId);
}

export async function getNotifications(page = 1, limit = 20, userId: User['id']): Promise<NotificationsPageData> {
  const [notifications, totalCount] = await Promise.all([
    NotificationService.getPaginatedNotifications(userId, page, limit, userId),
    NotificationService.getNotificationsCount(userId, userId),
  ]);

  return {
    notifications,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    limit,
    totalCount,
  };
}
