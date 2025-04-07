"use client";

import type { User } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";

import type { Notification } from "~/features/notifications/notification.types";

import { Button } from "~/components/ui/button";
import { deleteNotification, markNotificationAsRead } from "~/features/notifications/notification.actions";
import { emitNotificationCountChanged } from "~/lib/utils";

import { NotificationItem } from "./notification-item";
import { NotificationsSelectionActions } from "./notifications-selection-actions";

type NotificationsListProps = {
  readonly notifications: Notification[];
  readonly selectedNotifications: Notification[];
  readonly setSelectedNotificationsAction: Dispatch<SetStateAction<Notification[]>>;
  readonly setNotificationsAction: Dispatch<SetStateAction<Notification[]>>;
  readonly userId: User["id"];
};

export function NotificationsList({
  notifications,
  selectedNotifications,
  setSelectedNotificationsAction,
  setNotificationsAction,
  userId,
}: NotificationsListProps) {
  const hasNotifications = notifications.length > 0;
  const allSelected = hasNotifications && selectedNotifications.length === notifications.length;

  const selectAll = () => {
    setSelectedNotificationsAction(notifications);
  };

  const handleSelect = (notification: Notification) => {
    setSelectedNotificationsAction((prev: Notification[]) => {
      return prev.includes(notification)
        ? prev.filter((n: Notification) => n !== notification)
        : [...prev, notification];
    });
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId, userId);
      setNotificationsAction((prev: Notification[]) => {
        return prev.map((n: Notification) =>
          n.id === notificationId ? { ...n, isRead: true } : n,
        );
      });
      emitNotificationCountChanged();
    } catch {
      // TODO: handle error, show toast or something
    }
  };

  const handleDelete = async (notificationId: Notification["id"]) => {
    try {
      await deleteNotification(notificationId, userId);
      setNotificationsAction((prev: Notification[]) => {
        return prev.filter((n: Notification) => n.id !== notificationId);
      });
      setSelectedNotificationsAction((prev: Notification[]) => {
        return prev.filter((n: Notification) => n.id !== notificationId);
      });
      emitNotificationCountChanged();
    } catch {
      // TODO: handle error, show toast or something
    }
  };

  return (
    <>
      {hasNotifications && (
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {!allSelected && (
              <Button variant="ghost" size="sm" onClick={selectAll}>
                Select all
              </Button>
            )}
            {selectedNotifications.length > 0 && (
              <NotificationsSelectionActions
                selectedNotifications={selectedNotifications}
                setSelectedNotificationsAction={setSelectedNotificationsAction}
                setNotificationsAction={setNotificationsAction}
                userId={userId}
              />
            )}
          </div>
        </div>
      )}
      <div className="bg-card rounded-lg border">
        {!hasNotifications
          ? <div className="text-muted-foreground p-6 text-center">No notifications yet</div>
          : (
              <ul className="divide-y">
                {notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isSelected={selectedNotifications.includes(notification)}
                    onSelectAction={() => handleSelect(notification)}
                    onMarkAsReadAction={() => handleMarkAsRead(notification.id)}
                    onDeleteAction={() => handleDelete(notification.id)}
                  />
                ))}
              </ul>
            )}
      </div>
    </>
  );
}
