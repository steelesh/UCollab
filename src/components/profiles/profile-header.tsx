"use client";

import type { User } from "@prisma/client";
import type { Route } from "next";

import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SignOutButton } from "~/components/navigation/signout-button";
import { ProfileConnectButton } from "~/components/profiles/profile-connect-button";
import { Button } from "~/components/ui/button";
import { DEFAULT_POST_BANNER_IMAGE } from "~/lib/utils";

type ProfileHeaderProps = {
  readonly avatar: User["avatar"];
  readonly username: User["username"];
  readonly isOwnProfile: boolean;
  readonly initialConnected?: boolean;
};

export function ProfileHeader({
  avatar,
  username,
  isOwnProfile,
  initialConnected,
}: ProfileHeaderProps) {
  return (
    <div className="relative h-42">
      <Image
        src={DEFAULT_POST_BANNER_IMAGE}
        alt="Banner"
        fill
        priority
        className="rounded-t object-cover"
      />
      <div className="absolute -bottom-12 left-8">
        <Image
          src={avatar}
          alt={username}
          width={100}
          height={100}
          className="rounded-full border-5"
        />
      </div>
      {isOwnProfile
        ? (
            <div className="absolute right-1 -bottom-12 flex space-x-2">
              <Link
                href={`/u/${username}/settings` as Route}
                className="font-bold hover:underline"
              >
                <Button
                  size="icon"
                  className="cursor-pointer"
                  variant="outline"
                  aria-label="Settings"
                >
                  <Settings />
                </Button>
              </Link>
              <SignOutButton />
            </div>
          )
        : (
            <div className="absolute right-1 -bottom-12 flex space-x-2">
              <ProfileConnectButton
                targetUsername={username}
                initialConnected={initialConnected ?? false}
              />
            </div>
          )}
    </div>
  );
}
