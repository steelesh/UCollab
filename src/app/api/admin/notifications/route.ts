import { withApiAuth } from '~/lib/auth/protected-api';
import { NotificationService } from '~/services/notification.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return withApiAuth(null, async (userId) => {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');

    return {
      notifications: await NotificationService.getPaginatedNotifications(userId, page, limit, userId),
      unreadCount: await NotificationService.getUnreadNotificationsCount(userId, userId),
    };
  });
}
