"use server";

import type { User } from "@prisma/client";

import type { Notification, NotificationsPageData } from "./notification.types";

import { NotificationService } from "./notification.service";

export async function getUserNotifications(userId: User["id"], requestUserId: User["id"]): Promise<Notification[]> {
  return NotificationService.getUserNotifications(userId, requestUserId);
}

export async function getUnreadCount(userId: User["id"], requestUserId: User["id"]): Promise<number> {
  return NotificationService.getUnreadNotificationsCount(userId, requestUserId);
}

export async function getUnreadNotificationsCount(userId: User["id"], requestUserId: User["id"]): Promise<number> {
  return getUnreadCount(userId, requestUserId);
}

export async function getCurrentUserNotifications(userId: User["id"], requestUserId: User["id"]) {
  return await getUserNotifications(userId, requestUserId);
}

export async function getNotifications(page: number, limit: number, userId: User["id"]): Promise<NotificationsPageData> {
  const [notifications, totalCount] = await Promise.all([
    NotificationService.getPaginatedNotifications(userId, userId, page, limit),
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
