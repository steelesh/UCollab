'use client';

import { useState } from 'react';
import { Notification } from '~/features/notifications/notification.types';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Check, Trash, CheckCheck } from 'lucide-react';
import {
  markNotificationAsRead,
  markAllAsRead,
  markMultipleAsRead,
  deleteNotification,
} from '~/features/notifications/notification.actions';
import { User } from '@prisma/client';
import { format, formatDistanceToNow } from 'date-fns';
import { NotificationsPagination } from './notifications-pagination';
import { emitNotificationCountChanged } from '~/lib/utils';

interface NotificationsClientProps {
  initialNotifications: Notification[];
  userId: User['id'];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

export function NotificationsClient({ initialNotifications, userId, pagination }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isMarkingMultiple, setIsMarkingMultiple] = useState(false);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const handleMarkAsRead = async (notificationId: Notification['id']) => {
    try {
      await markNotificationAsRead(notificationId, userId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      );
      emitNotificationCountChanged();
    } catch {
      // handle error, show toast or something
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      await markAllAsRead(userId, userId);
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
      emitNotificationCountChanged();
    } catch {
      // handle error, show toast or something
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleMarkMultipleAsRead = async () => {
    if (selectedNotifications.length === 0) return;

    setIsMarkingMultiple(true);
    try {
      if (notifications.length === 0) return;

      await markMultipleAsRead(selectedNotifications, userId);
      setNotifications((prev) =>
        prev.map((notification) =>
          selectedNotifications.includes(notification.id) ? { ...notification, isRead: true } : notification,
        ),
      );
      emitNotificationCountChanged();
    } catch {
      // handle error, show toast or something
    } finally {
      setIsMarkingMultiple(false);
    }
  };

  const handleDelete = async (notificationId: Notification['id']) => {
    try {
      await deleteNotification(notificationId, userId);
      setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));
      setSelectedNotifications((prev) => prev.filter((id) => id !== notificationId));
      emitNotificationCountChanged();
    } catch {
      // handle error, show toast or something
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedNotifications.length === 0) return;

    setIsDeletingMultiple(true);
    try {
      if (notifications.length === 0) return;

      for (const id of selectedNotifications) {
        await deleteNotification(id, userId);
      }
      setNotifications((prev) => prev.filter((notification) => !selectedNotifications.includes(notification.id)));
      setSelectedNotifications([]);
      emitNotificationCountChanged();
    } catch {
      // handle error, show toast or something
    } finally {
      setIsDeletingMultiple(false);
    }
  };

  const toggleSelectNotification = (notificationId: Notification['id']) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId) ? prev.filter((id) => id !== notificationId) : [...prev, notificationId],
    );
  };

  const selectAll = () => {
    const allIds = notifications.map((notification) => notification.id);
    setSelectedNotifications(allIds);
  };

  const clearSelection = () => {
    setSelectedNotifications([]);
  };

  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const hasSelection = selectedNotifications.length > 0;
  const hasNotifications = totalCount > 0;
  const allSelected = hasNotifications && selectedNotifications.length === totalCount;
  const hasUnreadSelected = selectedNotifications.some((id) => notifications.find((n) => n.id === id && !n.isRead));

  return (
    <main className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-8">
      <div className="w-full max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <div className="flex gap-2">
            {hasSelection && hasUnreadSelected && (
              <Button variant="outline" size="sm" onClick={handleMarkMultipleAsRead} disabled={isMarkingMultiple}>
                {isMarkingMultiple ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Mark selected as read
                  </>
                )}
              </Button>
            )}

            {hasSelection && (
              <Button variant="outline" size="sm" onClick={handleDeleteMultiple} disabled={isDeletingMultiple}>
                {isDeletingMultiple ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete selected
                  </>
                )}
              </Button>
            )}

            {unreadCount > 0 && !hasSelection && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={isMarkingAll}>
                {isMarkingAll ? (
                  <>Loading...</>
                ) : (
                  <>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Mark all as read
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {hasNotifications && (
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              Notifications: {totalCount} {totalCount !== 1 ? 's' : ''}
              {unreadCount > 0 && ` (${unreadCount} unread)`}
            </div>
            <div className="flex gap-2">
              {!allSelected && (
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Select all
                </Button>
              )}

              {hasSelection && (
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Clear selection
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="bg-card rounded-lg border">
          {!hasNotifications ? (
            <div className="text-muted-foreground p-6 text-center">No notifications yet</div>
          ) : (
            <ul className="divide-y">
              {notifications.map((notification) => (
                <li key={notification.id} className={`p-4 ${notification.isRead ? 'bg-background/50' : 'bg-accent/5'}`}>
                  <div className="flex items-start">
                    <Checkbox
                      checked={selectedNotifications.includes(notification.id)}
                      onCheckedChange={() => toggleSelectNotification(notification.id)}
                      id={`select-${notification.id}`}
                      className="mt-1 mr-3"
                    />
                    <div className="relative flex-1">
                      <div className="pr-16">
                        <p className="text-sm first-letter:uppercase">{notification.message}</p>
                        <p className="text-muted-foreground text-xs">
                          {formatDistanceToNow(new Date(notification.createdDate), { addSuffix: true })}
                          {' · '}
                          {format(new Date(notification.createdDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="absolute top-0 right-0 flex items-center space-x-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="Mark as read">
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                          title="Delete notification">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      {!notification.isRead && (
                        <div className="bg-primary absolute top-[2px] right-[-8px] h-2 w-2 rounded-full" />
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {pagination && (
          <NotificationsPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            limit={pagination.limit}
          />
        )}
      </div>
    </main>
  );
}
