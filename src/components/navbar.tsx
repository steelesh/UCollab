'use client';

import { AuthSection } from './auth-section';
import { DesktopNav } from './desktop-nav';
import { FloatingNavWrapper } from './floating-nav-wrapper';
import { MobileNav } from './mobile-nav';
import { NavLinkProps } from './nav-link';
import { NavLogo } from './nav-logo';

export interface NavSection {
  title: string;
  items: NavLinkProps[];
}

const routes: NavSection[] = [
  {
    title: 'Explore',
    items: [
      {
        title: 'All Projects',
        href: '/explore',
        description: 'Browse all posts across categories',
      },
      {
        title: 'Code Reviews',
        href: '/feedback',
        description: 'Get feedback on your code and projects',
      },
      {
        title: 'Collaborations',
        href: '/collaborations',
        description: 'Find teammates for your projects',
      },
      {
        title: 'Trending',
        href: '/trending',
        description: "See what's popular in the community",
      },
    ],
  },
  {
    title: 'Community',
    items: [
      {
        title: 'Community Guide',
        href: '/community-guide',
        description: 'How to get the most out of UCollab',
      },
      {
        title: 'Contribution Guide',
        href: '/contributing',
        description: 'Learn how to contribute to UCollab',
      },
      {
        title: 'Code of Conduct',
        href: '/code-of-conduct',
        description: 'Our community values and expectations',
      },
      {
        title: 'User Directory',
        href: '/community',
        description: 'Our user base',
      },
      {
        title: 'Mentorship',
        href: '/mentorship',
        description: 'Connect with mentors or become one',
      },
      {
        title: 'Q & A',
        href: '/questions',
        description: 'Ask questions and help others with solutions',
      },
      {
        title: 'Discussions',
        href: '/discussions',
        description: 'Start or join general discussions',
      },
    ],
  },
];

export default function Navbar() {
  return (
    <div className="bg-background w-full border-b backdrop-blur-sm">
      <nav className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileNav items={routes} />
          <NavLogo />
        </div>
        <div className="flex items-center gap-4">
          <DesktopNav items={routes} />
          <div className="mx-2 hidden h-6 border-l md:block" />
        </div>
      </nav>
    </div>
  );
}
