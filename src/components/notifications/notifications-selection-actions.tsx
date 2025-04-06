"use client";

import type { User } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";

import { Check, Trash, X } from "lucide-react";
import { useState } from "react";

import type { Notification } from "~/features/notifications/notification.types";

import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { deleteNotification, markMultipleAsRead } from "~/features/notifications/notification.actions";
import { emitNotificationCountChanged } from "~/lib/utils";

import { NotificationActionButton } from "./notification-action-button";

type NotificationsSelectionActionsProps = {
  readonly selectedNotifications: Notification[];
  readonly setSelectedNotificationsAction: Dispatch<SetStateAction<Notification[]>>;
  readonly setNotificationsAction: Dispatch<SetStateAction<Notification[]>>;
  readonly userId: User["id"];
};

export function NotificationsSelectionActions({
  selectedNotifications,
  setSelectedNotificationsAction,
  setNotificationsAction,
  userId,
}: NotificationsSelectionActionsProps) {
  const [isMarkingMultiple, setIsMarkingMultiple] = useState(false);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMarkReadDialog, setShowMarkReadDialog] = useState(false);

  const hasUnreadSelected = selectedNotifications.some(notification => !notification.isRead);
  const unreadSelectedCount = selectedNotifications.filter(notification => !notification.isRead).length;

  const handleMarkMultipleAsRead = () => {
    setShowMarkReadDialog(true);
  };

  const confirmMarkMultipleAsRead = async () => {
    setIsMarkingMultiple(true);
    try {
      await markMultipleAsRead(selectedNotifications.map(notification => notification.id), userId);
      setNotificationsAction(prev =>
        prev.map(notification =>
          selectedNotifications.includes(notification) ? { ...notification, isRead: true } : notification,
        ),
      );
      setSelectedNotificationsAction([]);
      emitNotificationCountChanged();
    } catch {
      // handle error, show toast or something
    } finally {
      setIsMarkingMultiple(false);
      setShowMarkReadDialog(false);
    }
  };

  const handleDeleteMultiple = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteMultiple = async () => {
    setIsDeletingMultiple(true);
    try {
      for (const notification of selectedNotifications) {
        await deleteNotification(notification.id, userId);
      }
      setNotificationsAction(prev => prev.filter(notification => !selectedNotifications.includes(notification)));
      setSelectedNotificationsAction([]);
      emitNotificationCountChanged();
    } catch {
      // handle error, show toast or something
    } finally {
      setIsDeletingMultiple(false);
      setShowDeleteDialog(false);
    }
  };

  const clearSelection = () => {
    setSelectedNotificationsAction([]);
  };

  return (
    <>
      <div className="flex gap-2">
        {selectedNotifications.length > 0 && (
          <NotificationActionButton
            icon={X}
            onClick={clearSelection}
          >
            Clear selection
          </NotificationActionButton>
        )}
        {hasUnreadSelected && (
          <NotificationActionButton
            icon={Check}
            loading={isMarkingMultiple}
            onClick={handleMarkMultipleAsRead}
            disabled={isMarkingMultiple}
          >
            Mark selected as read
          </NotificationActionButton>
        )}
        <NotificationActionButton
          icon={Trash}
          loading={isDeletingMultiple}
          onClick={handleDeleteMultiple}
          disabled={isDeletingMultiple}
        >
          Delete selected
        </NotificationActionButton>
      </div>
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChangeAction={setShowDeleteDialog}
        title="Delete Notifications"
        description={`Are you sure you want to delete ${selectedNotifications.length} selected notification${selectedNotifications.length === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirmAction={confirmDeleteMultiple}
      />
      <ConfirmDialog
        open={showMarkReadDialog}
        onOpenChangeAction={setShowMarkReadDialog}
        title="Mark Selected as Read"
        description={`Are you sure you want to mark ${unreadSelectedCount} notification${unreadSelectedCount === 1 ? "" : "s"} as read?`}
        confirmText="Mark Selected as Read"
        cancelText="Cancel"
        onConfirmAction={confirmMarkMultipleAsRead}
      />
    </>
  );
}
