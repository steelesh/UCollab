import { withAuth } from '~/security/protected';
import { Metadata } from 'next';
import { getNotifications } from '~/features/notifications/notification.queries';
import { NotificationsClient } from '~/components/notifications/notifications-client';
import { User } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Notifications | UCollab',
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
  userId: User['id'];
}

async function Page({ searchParams, userId }: PageProps) {
  const { page = '1', limit = '20' } = await searchParams;

  const data = await getNotifications(Number(page), Number(limit), userId);

  return (
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
  );
}

export default withAuth(Page);
