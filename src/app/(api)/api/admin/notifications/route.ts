import { withApiAuth } from "@/src/lib/auth/protected-api";
import { Permission } from "@/src/lib/permissions";
import { NotificationService } from "@/src/services/notification.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return withApiAuth(req, Permission.ACCESS_ADMIN, async (userId) => {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    return {
      notifications: await NotificationService.getPaginatedNotifications(
        userId,
        page,
        limit,
        userId,
      ),
      unreadCount: await NotificationService.getUnreadNotificationsCount(
        userId,
        userId,
      ),
    };
  });
}
