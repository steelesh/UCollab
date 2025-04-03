"use client";

import type { Route } from "next";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SignInButton } from "~/components/navigation/signin-button";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

export function AuthSection() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = () => setIsOpen(prev => !prev);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsOpen(false);
  }, [pathname]);

  const links = [
    { title: "My Profile", route: `/u/${session?.user.username}` },
    { title: "My Settings", route: `/u/${session?.user.username}/settings` },
    { title: "My Posts", route: `/u/${session?.user.username}/posts` },
    { title: "My Bookmarks", route: `/u/${session?.user.username}/bookmarks` },
    { title: "My Connections", route: `/u/${session?.user.username}/connections` },
    { title: "Sign out", action: signOut },
  ];

  return (
    <>
      {status === "loading"
        ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          )
        : !session
            ? (
                <SignInButton />
              )
            : (
                <>
                  <Avatar
                    onClick={handleToggle}
                    className="border-uc-red h-8 w-8 cursor-pointer rounded-full border hover:border-[2px]"
                  >
                    {session.user.avatar
                      ? (
                          <Image src={session.user.avatar} alt="avatar image" width={32} height={32} />
                        )
                      : (
                          <Skeleton className="h-8 w-8 rounded-full" />
                        )}
                  </Avatar>
                  {isOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        role="button"
                        tabIndex={0}
                        aria-label="Close overlay"
                        onClick={handleToggle}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleToggle();
                          }
                        }}
                      />
                      <div className="bg-background fixed top-0 right-0 z-50 h-full w-62">
                        <div className="p-4 py-18">
                          <div className="mb-4 flex items-center gap-2">
                            <Avatar className="h-10 w-10 rounded-full border">
                              {session.user.avatar
                                ? (
                                    <Image src={session.user.avatar} alt="avatar image" width={40} height={40} />
                                  )
                                : (
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                  )}
                            </Avatar>
                            <div>
                              <p className="font-medium">{session.user.username}</p>
                              <p className="text-muted-foreground text-sm">{session.user.email}</p>
                            </div>
                          </div>
                          <hr className="my-4" />
                          {links.map(link => (
                            <div key={link.title} className="mb-2">
                              <Button
                                variant="ghost"
                                className="flex w-full cursor-pointer justify-start font-thin tracking-wide"
                                onClick={() => {
                                  setIsOpen(false);
                                  if (link.action) {
                                    link.action();
                                  } else {
                                    router.push(link.route as Route);
                                  }
                                }}
                              >
                                {link.title}
                              </Button>
                              <hr className="from-accent ml-4 h-0.25 w-2/3 border-0 bg-gradient-to-r to-transparent" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
    </>
  );
}
