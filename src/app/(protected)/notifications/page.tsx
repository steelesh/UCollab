import { withAuth } from '~/security/protected';
import { Metadata } from 'next';
import { getNotifications } from '~/features/notifications/notification.queries';
import { NotificationsClient } from '~/components/notifications/notifications-client';
import { User } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Notifications | UCollab',
};

interface PageProps {
  searchParams: {
    page?: string;
    limit?: string;
  };
  userId: User['id'];
}

async function Page({ searchParams, userId }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 20;

  const data = await getNotifications(currentPage, limit, userId);

  return (
    <NotificationsClient
      initialNotifications={data.notifications}
      userId={userId}
      pagination={{
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalCount: data.totalCount,
        limit: data.limit,
      }}
    />
  );
}

export default withAuth(Page);
