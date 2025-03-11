'use client';

import Image from 'next/image';
import { Avatar } from '../../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { useSession } from 'next-auth/react';
import { Skeleton } from '../../ui/skeleton';
import { LogInButton } from '../auth/login-button';
import { LogOutButton } from '../auth/logout-button';

export function AuthSection() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!session) {
    return <LogInButton />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="dark:border-primary hover:bg-primary/10 dark:bg-primary/30 dark:hover:bg-primary/20 data-[state=open]:bg-primary/10 dark:data-[state=open]:bg-primary/20 h-8 w-8 rounded-full border border-black hover:border-[1.5px] data-[state=open]:border-[1.5px]">
          {session.user.avatar ? (
            <Image src={session.user.avatar} alt="avatar image" width={32} height={32} />
          ) : (
            <Skeleton className="h-8 w-8 rounded-full" />
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <LogOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
