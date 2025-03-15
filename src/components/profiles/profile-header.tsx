'use client';

import Image from 'next/image';
import { User } from '@prisma/client';
import Link from 'next/link';
import { Route } from 'next';
import { SignOutButton } from '~/components/navigation/signout-button';
import { Button } from '~/components/ui/button';
import { Settings } from 'lucide-react';

interface ProfileHeaderProps {
  avatar: User['avatar'];
  username: User['username'];
  isOwnProfile: boolean;
}

export function ProfileHeader({ avatar, username, isOwnProfile }: ProfileHeaderProps) {
  return (
    <div className="relative h-48">
      <Image src="/images/banner-placeholder.png" alt="Banner" fill className="rounded-t object-cover" />
      <div className="absolute -bottom-12 left-8">
        <Image src={avatar} alt={username} width={100} height={100} className="rounded-full border-5" />
      </div>
      {isOwnProfile && (
        <div className="absolute right-1 -bottom-12 flex space-x-2">
          <Link href={`/u/${username}/settings` as Route} className="font-bold hover:underline">
            <Button size="icon" className="cursor-pointer" variant="outline" aria-label="Settings">
              <Settings />
            </Button>
          </Link>
          <SignOutButton />
        </div>
      )}
    </div>
  );
}
