"use client";

import Image from "next/image";

import { cn } from "~/lib/utils";

type Avatar = {
  readonly imageUrl: string;
  readonly profileUrl: string;
};
type AvatarCirclesProps = {
  readonly className?: string;
  readonly numPeople?: number;
  readonly avatarUrls: Avatar[];
};

export function AvatarCircles({
  numPeople,
  className,
  avatarUrls,
}: AvatarCirclesProps) {
  const visibleAvatars = avatarUrls.slice(0, 3);
  const remainingCount = avatarUrls.length > 3 ? avatarUrls.length - 3 : 0;
  const totalExtra = remainingCount + (numPeople ?? 0);

  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {visibleAvatars.map((avatar, index) => (
        <a
          key={avatar.imageUrl}
          href={avatar.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            key={avatar.imageUrl}
            className="h-10 w-10 rounded-full"
            src={avatar.imageUrl}
            width={40}
            height={40}
            alt={`Avatar ${index + 1}`}
          />
        </a>
      ))}
      {totalExtra > 0 && (
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-center text-xs font-medium text-foreground hover:bg-background/80"
          onClick={() => {}}
        >
          +
          {totalExtra}
        </button>
      )}
    </div>
  );
}
