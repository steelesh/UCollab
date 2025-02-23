import { auth } from '~/security/auth';
import { ErrorMessage } from '~/lib/utils';
import { CreateSystemNotificationInput } from '~/features/notifications/notification.schema';
import { NotificationService } from '~/features/notifications/notification.service';

export async function markAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  await NotificationService.markNotificationAsRead(notificationId, session.user.id);
}

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return NotificationService.markAllNotificationsAsRead(session.user.id, session.user.id);
}

export async function markMultipleAsRead(notificationIds: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return NotificationService.markMultipleNotificationsAsRead(notificationIds, session.user.id);
}

export async function createSystemNotification(data: CreateSystemNotificationInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return NotificationService.queueBatchNotifications({
    userIds: data.userIds,
    message: data.message,
    type: data.type,
    triggeredById: session.user.id,
  });
}

export async function cleanupOldNotifications(daysToKeep = 30) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return NotificationService.cleanupOldNotifications(daysToKeep);
}
