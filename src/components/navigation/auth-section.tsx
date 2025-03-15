'use client';

import Image from 'next/image';
import { Avatar } from '~/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { Skeleton } from '~/components/ui/skeleton';
import { SignInButton } from '~/components/navigation/signin-button';
import Link from 'next/link';
import { Route } from 'next';

export function AuthSection() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!session) {
    return <SignInButton />;
  }

  return (
    <Avatar className="dark:border-primary h-8 w-8 rounded-full border border-black hover:border-[1.5px]">
      {session.user.avatar ? (
        <Link href={`/u/${session.user.username}` as Route}>
          <Image src={session.user.avatar} alt="avatar image" width={32} height={32} />
        </Link>
      ) : (
        <Skeleton className="h-8 w-8 rounded-full" />
      )}
    </Avatar>
  );
}
