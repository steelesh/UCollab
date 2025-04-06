"use client";

import { format, formatDistanceToNow } from "date-fns";
import { Check, Trash } from "lucide-react";
import { useState } from "react";

import type { Notification } from "~/features/notifications/notification.types";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";

type NotificationItemProps = {
  readonly notification: Notification;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
  readonly onMarkAsRead: () => Promise<void>;
  readonly onDelete: () => Promise<void>;
};

export function NotificationItem({
  notification,
  isSelected,
  onSelect,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  return (
    <>
      <li className={`p-4 ${notification.isRead ? "bg-background/50" : "bg-accent/5"}`}>
        <div className="flex items-start">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            id={`select-${notification.id}`}
            className="mt-1 mr-3"
          />
          <div className="relative flex-1">
            <div className="pr-16">
              <p className="text-sm first-letter:uppercase">{notification.message}</p>
              <p className="text-muted-foreground text-xs">
                {formatDistanceToNow(new Date(notification.createdDate), { addSuffix: true })}
                {" · "}
                {format(new Date(notification.createdDate), "MMM d, yyyy")}
              </p>
            </div>
            <div className="absolute top-0 right-0 flex items-center space-x-1">
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAsRead}
                  title="Mark as read"
                >
                  <Check />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                title="Delete notification"
              >
                <Trash />
              </Button>
            </div>
            {!notification.isRead && (
              <div className="bg-primary absolute top-[2px] right-[-8px] h-2 w-2 rounded-full" />
            )}
          </div>
        </div>
      </li>
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Notification"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        cancelText="Cancel"
        confirmText="Delete"
        onConfirm={onDelete}
      />
    </>
  );
}
