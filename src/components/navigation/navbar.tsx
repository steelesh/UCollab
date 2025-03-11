'use client';
import Link from 'next/link';
import { AuthSection } from './auth-section';
import { DesktopNav } from './desktop-nav';
import { MobileNav } from '../navigation/mobile-nav';
import { NavLinkProps } from './nav-link';
import type { Route } from 'next';
import Image from 'next/image';

export interface NavSection {
  title: string;
  items: NavLinkProps[];
}

const routes: NavSection[] = [
  {
    title: 'Create',
    items: [
      {
        title: 'New Project',
        href: '/p/new' as Route,
        description: 'Create a new project',
      },
      {
        title: 'New Discussion',
        href: '/discussion' as Route,
        description: 'Create a new discussion',
      },
    ],
  },
  {
    title: 'Explore',
    items: [
      {
        title: 'All Projects',
        href: '/p' as Route,
        description: 'Browse all projects across categories',
      },
      {
        title: 'Code Reviews',
        href: '/feedback' as Route,
        description: 'Get feedback on your code and projects',
      },
      {
        title: 'Collaborations',
        href: '/collaborations' as Route,
        description: 'Find teammates for your projects',
      },
      {
        title: 'Trending',
        href: '/trending' as Route,
        description: "See what's popular in the community",
      },
    ],
  },
  {
    title: 'Community',
    items: [
      {
        title: 'All Discussions',
        href: '/discussions' as Route,
        description: 'Start or join general discussions',
      },
      {
        title: 'Q & A',
        href: '/questions' as Route,
        description: 'Ask questions and help others with solutions',
      },
      {
        title: 'Mentorship',
        href: '/mentorship' as Route,
        description: 'Connect with mentors or become one',
      },
      {
        title: 'Community Guide',
        href: '/community-guide' as Route,
        description: 'How to get the most out of UCollab',
      },
      {
        title: 'Contribution Guide',
        href: '/contributing' as Route,
        description: 'Learn how to contribute to UCollab',
      },
      {
        title: 'Code of Conduct',
        href: '/code-of-conduct' as Route,
        description: 'Our community values and expectations',
      },
      {
        title: 'User Directory',
        href: '/c/all' as Route,
        description: 'Our user base',
      },
    ],
  },
];

export default function Navbar() {
  return (
    <div className="bg-background fixed top-0 right-0 left-0 z-50 w-full border-b backdrop-blur-sm">
      <nav className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileNav items={routes} />
          <Link href="/" className="cursor-pointer transition-transform hover:scale-105">
            <Image src="/images/logo-dark.svg" width={140} height={50} alt="UCollab logo" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <DesktopNav items={routes} />
          <div className="mx-2 hidden h-6 border-l md:block" />
          <AuthSection />
        </div>
      </nav>
    </div>
  );
}
