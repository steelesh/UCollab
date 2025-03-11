'use client';

import Image from 'next/image';
import { User } from '@prisma/client';
import Link from 'next/link';
import { Route } from 'next';
import { SignOutButton } from '~/components/signout-button';

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
        <Image src={avatar} alt={username} width={100} height={100} className="border-base-100 rounded-full border-5" />
      </div>
      {isOwnProfile && (
        <div className="absolute right-1 -bottom-12 flex space-x-2">
          <Link href={`/u/${username}/settings` as Route} className="font-bold hover:underline">
            <button className="btn btn-accent-content" aria-label="Settings">
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065" />
                  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0" />
                </g>
              </svg>
            </button>
          </Link>
          <SignOutButton />
        </div>
      )}
    </div>
  );
}
