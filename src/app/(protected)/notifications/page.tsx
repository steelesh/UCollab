import type { User } from "@prisma/client";
import type { Metadata } from "next";

import { NotificationsClient } from "~/components/notifications/notifications-client";
import { getNotifications } from "~/features/notifications/notification.queries";
import { withAuth } from "~/security/protected";

export const metadata: Metadata = {
  title: "Notifications | UCollab",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  userId: User["id"];
};

async function Page({ userId, searchParams }: PageProps) {
  const { page = "1", limit = "20" } = await searchParams;
  const data = await getNotifications(Number(page), Number(limit), userId);

  return (
    <div className="flex flex-col items-center">
      <NotificationsClient
        initialNotifications={data.notifications}
        userId={userId}
        pagination={{
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
          limit: Number(limit),
        }}
      />
    </div>
  );
}

export default withAuth(Page);
