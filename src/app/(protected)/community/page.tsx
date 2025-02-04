import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '../../../../prisma';
import { withAuth } from '~/lib/auth/protected';

export const metadata = {
  title: 'UCollab — Community',
};

interface _User {
  avatar: string | null;
  username: string;
  email: string;
  createdDate: string;
  lastLogin: string;
}

async function CommunityPage() {
  const users = await prisma.user.findMany({
    select: {
      avatar: true,
      username: true,
      email: true,
      createdDate: true,
      lastLogin: true,
    },
  });

  const formattedUsers: {
    createdDate: string | undefined;
    lastLogin: string | undefined;
    username: string;
    email: string;
    avatar: string;
  }[] = users.map((user) => ({
    ...user,
    createdDate: user.createdDate.toISOString().split('T')[0],
    lastLogin: user.lastLogin.toISOString().split('T')[0],
  }));

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
      {formattedUsers.map((user, index) => (
        <div key={index} className="flex w-full max-w-3xl items-center border-b p-4">
          <Image src={user.avatar} alt={user.username} width={50} height={50} className="rounded-full" />
          <div className="ml-4">
            <Link href={`/users/${user.username}`} className="font-bold hover:underline">
              {user.username}
            </Link>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm">Created: {user.createdDate}</p>
            <p className="text-sm">Last Login: {user.lastLogin}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default withAuth(CommunityPage);
