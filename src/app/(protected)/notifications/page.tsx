import type { User } from "@prisma/client";
import type { Metadata } from "next";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { NotificationsClient } from "~/components/notifications/notifications-client";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { getNotifications } from "~/features/notifications/notification.queries";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notifications | UCollab",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  userId: User["id"];
};

async function Page({ userId, searchParams }: PageProps) {
  const { page = "1", limit = "20" } = await searchParams;
  const data = await getNotifications(Number(page), Number(limit), userId);

  return (
    <Container>
      <PageBreadcrumb
        items={[
          { label: "Notifications", isCurrent: true },
        ]}
      />
      <Header>
        <H1>Notifications</H1>
      </Header>
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
    </Container>
  );
}

export default withAuth(Page);
