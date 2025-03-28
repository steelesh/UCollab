"use client";

import type { Route } from "next";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import type { NavLinkProps } from "./nav-link";

import { MobileNav } from "../navigation/mobile-nav";
import { NotificationBadge } from "../notifications/notification-badge";
import { AuthSection } from "./auth-section";
import { DesktopNav } from "./desktop-nav";

export type NavSection = {
  title: string;
  items: NavLinkProps[];
};

const routes: NavSection[] = [
  {
    title: "Explore",
    items: [
      {
        title: "All Projects",
        href: "/p" as Route,
        description: "Browse all projects across categories",
        requiresAuth: true,
      },
      {
        title: "Project Feedback",
        href: "/p/feedback" as Route,
        description: "Get feedback on your code and projects",
        requiresAuth: true,
      },
      {
        title: "Collaborations",
        href: "/p/collabs" as Route,
        description: "Find teammates for your projects",
        requiresAuth: true,
      },
      {
        title: "Trending",
        href: "/p/trending" as Route,
        description: "See what's popular in the community",
        requiresAuth: true,
      },
      {
        title: "Getting Started",
        href: "/c/getting-started" as Route,
        description: "Set up your account and explore UCollab",
        requiresAuth: false,
      },
    ],
  },
  {
    title: "Community",
    items: [
      {
        title: "Mentorship",
        href: "/m" as Route,
        description: "Connect with mentors or become one",
        requiresAuth: true,
      },
      {
        title: "Community Guide",
        href: "/c/community-guide" as Route,
        description: "How to get the most out of UCollab",
        requiresAuth: false,
      },
      {
        title: "Contribution Guide",
        href: "/c/contribution-guide" as Route,
        description: "Learn how to contribute to UCollab",
        requiresAuth: false,
      },
      {
        title: "Code of Conduct",
        href: "/c/code-of-conduct" as Route,
        description: "Our community values and expectations",
        requiresAuth: false,
      },
      {
        title: "User Directory",
        href: "/u" as Route,
        description: "Our user base",
        requiresAuth: true,
      },
    ],
  },
];

export default function Navbar() {
  const { data: session } = useSession();

  const filteredRoutes: NavSection[] = routes
    .map(section => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.requiresAuth && !session)
          return false;
        return true;
      }),
    }))
    .filter(section => section.items.length > 0);

  return (
    <div className="bg-background fixed top-0 right-0 left-0 z-50 w-full">
      <nav className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileNav items={filteredRoutes} />
          <Link href="/" className="cursor-pointer transition-transform hover:scale-105">
            <Image src="/images/logo-icon.svg" width={24} height={24} alt="UCollab logo" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <DesktopNav items={filteredRoutes} />
          <div className="mx-2 hidden h-6 border-l md:block" />
          <NotificationBadge />
          <AuthSection />
        </div>
      </nav>
      <hr className="via-accent mx-auto h-0.25 w-2/3 border-0 bg-gradient-to-r from-transparent to-transparent" />
    </div>
  );
}
