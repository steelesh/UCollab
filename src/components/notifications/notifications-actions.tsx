"use client";

import type { User } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";

import { CheckCheck, Trash } from "lucide-react";
import { useState } from "react";

import type { Notification } from "~/features/notifications/notification.types";

import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { deleteNotification, markAllAsRead } from "~/features/notifications/notification.actions";
import { emitNotificationCountChanged } from "~/lib/utils";

import { NotificationActionButton } from "./notification-action-button";

type NotificationsActionsProps = {
  notifications: Notification[];
  selectedNotifications: Notification[];
  setSelectedNotifications: Dispatch<SetStateAction<Notification[]>>;
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  userId: User["id"];
};

export function NotificationsActions({
  notifications,
  selectedNotifications,
  setSelectedNotifications,
  setNotifications,
  userId,
}: NotificationsActionsProps) {
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showMarkAllReadDialog, setShowMarkAllReadDialog] = useState(false);

  const hasSelection = selectedNotifications.length > 0;
  const hasUnreadSelected = selectedNotifications.some(notification => !notification.isRead);

  const handleMarkAllAsRead = () => {
    setShowMarkAllReadDialog(true);
  };

  const confirmMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      await markAllAsRead(userId, userId);
      setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
      setSelectedNotifications([]);
      emitNotificationCountChanged();
    } catch {
      // handle error, show toast or something
    } finally {
      setIsMarkingAll(false);
      setShowMarkAllReadDialog(false);
    }
  };

  const handleDeleteAll = () => {
    setShowDeleteAllDialog(true);
  };

  const confirmDeleteAll = async () => {
    setIsDeletingMultiple(true);
    try {
      const allIds = notifications.map(notification => notification.id);
      for (const id of allIds) {
        await deleteNotification(id, userId);
      }
      setNotifications([]);
      setSelectedNotifications([]);
      emitNotificationCountChanged();
    } catch {
      // handle error, show toast or something
    } finally {
      setIsDeletingMultiple(false);
      setShowDeleteAllDialog(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        {hasSelection && hasUnreadSelected && (
          <NotificationActionButton
            icon={CheckCheck}
            loading={isMarkingAll}
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
          >
            Mark selected as read
          </NotificationActionButton>
        )}
        {hasSelection && (
          <NotificationActionButton
            icon={Trash}
            loading={isDeletingMultiple}
            onClick={handleDeleteAll}
          >
            Delete selected
          </NotificationActionButton>
        )}
        {!hasSelection && (
          <NotificationActionButton
            icon={CheckCheck}
            loading={isMarkingAll}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </NotificationActionButton>
        )}
        {!hasSelection && (
          <NotificationActionButton
            icon={Trash}
            loading={isDeletingMultiple}
            onClick={handleDeleteAll}
            className="text-destructive hover:text-destructive"
          >
            Delete all
          </NotificationActionButton>
        )}
      </div>
      <ConfirmDialog
        open={showDeleteAllDialog}
        onOpenChange={setShowDeleteAllDialog}
        title="Delete Notifications"
        description="Are you sure you want to delete all notifications? This action cannot be undone."
        confirmText="Delete All"
        cancelText="Cancel"
        onConfirm={confirmDeleteAll}
      />
      <ConfirmDialog
        open={showMarkAllReadDialog}
        onOpenChange={setShowMarkAllReadDialog}
        title="Mark All as Read"
        description="Are you sure you want to mark all notifications as read?"
        confirmText="Mark All as Read"
        cancelText="Cancel"
        onConfirm={confirmMarkAllAsRead}
      />
    </>
  );
}
