"use client";

import type { User } from "@prisma/client";

import { useState } from "react";

import type { Notification } from "~/features/notifications/notification.types";

import { Pagination } from "../ui/pagination";
import { NotificationsList } from "./notifications-list";

type NotificationsClientProps = {
  initialNotifications: Notification[];
  userId: User["id"];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
};

export function NotificationsClient({ initialNotifications, userId, pagination }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedNotifications, setSelectedNotifications] = useState<Notification[]>([]);

  return (
    <>
      <NotificationsList
        notifications={notifications}
        selectedNotifications={selectedNotifications}
        setSelectedNotifications={setSelectedNotifications}
        setNotifications={setNotifications}
        userId={userId}
      />
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalCount={pagination.totalCount}
        limit={pagination.limit}
        itemsPerPageOptions={[20, 50, 100]}
        basePath="/notifications"
      />
    </>
  );
}
