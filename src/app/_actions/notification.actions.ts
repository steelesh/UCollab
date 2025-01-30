"use server";

import { auth } from "@/auth";
import { CreateSystemNotificationInput } from "@/src/schemas/notification.schema";
import { NotificationService } from "@/src/services/notification.service";
import { revalidatePath } from "next/cache";

export async function markAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await NotificationService.markNotificationAsRead(
    notificationId,
    session.user.id,
  );
  revalidatePath("/notifications");
}

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await NotificationService.markAllNotificationsAsRead(
    session.user.id,
    session.user.id,
  );
  revalidatePath("/notifications");
}

export async function markMultipleAsRead(notificationIds: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await NotificationService.markMultipleNotificationsAsRead(
    notificationIds,
    session.user.id,
  );
  revalidatePath("/notifications");
}

// Admin actions
export async function createSystemNotification(
  data: CreateSystemNotificationInput,
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await NotificationService.queueBatchNotifications({
    userIds: data.userIds,
    message: data.message,
    type: data.type,
    triggeredById: session.user.id,
  });

  revalidatePath("/admin/notifications");
  revalidatePath("/notifications");
}

export async function cleanupOldNotifications(daysToKeep: number = 30) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await NotificationService.cleanupOldNotifications(daysToKeep);
  revalidatePath("/admin/notifications");
}
