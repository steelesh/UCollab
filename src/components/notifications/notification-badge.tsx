'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUnreadNotificationsCount } from '~/features/notifications/notification.queries';
import { useSession } from 'next-auth/react';
import { NOTIFICATION_COUNT_CHANGED } from '~/lib/utils';

export function NotificationBadge() {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    if (!session?.user?.id) return;
    const userId = session.user.id;

    const fetchCount = async () => {
      try {
        const unreadCount = await getUnreadNotificationsCount(userId, userId);
        setCount(unreadCount);
      } catch {
        // handle error, show toast or something
      }
    };
    // initial fetch
    fetchCount();

    // poll every 15 seconds
    const interval = setInterval(fetchCount, 15000);

    // listen for notification count changes
    const handleNotificationCountChanged = () => fetchCount();
    window.addEventListener(NOTIFICATION_COUNT_CHANGED, handleNotificationCountChanged);

    // clean up
    return () => {
      clearInterval(interval);
      window.removeEventListener(NOTIFICATION_COUNT_CHANGED, handleNotificationCountChanged);
    };
  }, [session, pathname]);

  if (!session) return null;

  return (
    <Link href="/notifications" className="hover:bg-accent relative rounded-full p-2 transition-colors">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="bg-primary text-primary-foreground absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
