"use client";

import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getUnreadNotificationsCount } from "~/features/notifications/notification.queries";
import { toastError } from "~/lib/toast";
import { NOTIFICATION_COUNT_CHANGED } from "~/lib/utils";

export function NotificationBadge() {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    if (!session?.user?.id)
      return;
    const userId = session.user.id;

    const fetchCount = async () => {
      try {
        const unreadCount = await getUnreadNotificationsCount(userId, userId);
        setCount(unreadCount);
      } catch {
        toastError("Failed to Fetch Notifications", {
          description: "An error occurred while fetching your notifications.",
        });
      }
    };
    // initial fetch
    fetchCount();

    const interval = setInterval(fetchCount, 15000);

    const handleNotificationCountChanged = () => fetchCount();
    window.addEventListener(NOTIFICATION_COUNT_CHANGED, handleNotificationCountChanged);

    return () => {
      clearInterval(interval);
      window.removeEventListener(NOTIFICATION_COUNT_CHANGED, handleNotificationCountChanged);
    };
  }, [session, pathname]);

  if (!session)
    return null;

  return (
    <Link href="/notifications" className="hover:bg-accent relative rounded-full p-2 transition-colors">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="bg-primary text-primary-foreground absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
