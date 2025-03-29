"use client";

import type { Route } from "next";

import { useSession } from "next-auth/react";
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
          <Link href="/" className="cursor-pointer text-foreground transition-transform hover:scale-105">
            <svg
              width="40"
              height="40"
              viewBox="0 0 1200.88 1762.6694"
              fill="none"
              className="fill-current"
            >
              <g clipPath="url(#clip0_1_15)" transform="translate(-2601,-681.00062)">
                <path d="m 3175.59,2032.55 c 1.4,0 2.6,0.2 3.8,0.2 z" />
                <path d="m 3694.86,1154.25 c -0.91,-13.8 -2.27,-27.6 -4.08,-41.3 -4.31,-31.8 -12.58,-62.8 -23.79,-93.2 -17.22,-46.4 -41.58,-89.8 -73.2,-130 -25.38,-32.3 -54.73,-61.6 -87.81,-87.8 -38.3,-30.3 -80.79,-55.3 -127.13,-75 -37.16,-15.8 -75.91,-27.5 -116.25,-35.5 -25.72,-5.1 -51.78,-8.2 -78.07,-9.8 -14.5,-0.9 -29.01,-0.4 -43.51,-0.6 -17.34,-0.3 -34.44,0.8 -51.67,2.4 -30.03,2.8 -59.6,8 -88.72,15.4 -55.07,14 -106.17,35.4 -153.42,64 -41.47,25.2 -78.41,54.7 -110.93,88.6 -38.07,39.6 -68.44,83.4 -91.1,131.4 -16.32,34.5 -28.1,70.2 -35.46,107.1 -5.54,28.1 -8.94,56.4 -8.71,84.9 0,11.7 1.25,23.3 1.25,34.9 0,21.6 3.29,42.8 7.48,63.9 9.97,49.7 27.65,97.2 53.82,142.1 2.27,3.9 4.99,7.6 7.14,11.6 3.63,6.7 6.91,13.5 10.54,20.2 16.43,30.9 33.43,61.5 49.51,92.5 27.53,52.7 52.01,106.4 73.54,161.2 20.73,52.7 38.41,106.2 48.95,161.3 3.74,19.2 6.46,38.5 7.36,57.9 0.34,6.6 0.23,13.2 0.79,19.8 0.91,10 2.27,19.9 3.4,29.9 1.13,10.1 1.59,20.4 3.74,30.4 3.17,15 9.29,29.4 18.36,42.5 10.08,14.6 23.23,26.2 41.47,32.8 10.99,3.9 22.32,5.6 33.99,5.6 h 362.46 c 7.48,0 14.96,-0.2 22.43,-0.9 21.07,-1.9 38.75,-10 52.46,-24.2 17.9,-18.6 27.53,-40.4 30.03,-64.6 2.38,-22.5 5.1,-45 6.46,-67.6 1.25,-20.9 3.85,-41.6 7.82,-62.1 8.27,-42.8 20.96,-84.6 35.92,-125.9 18.13,-50.1 39.09,-99.3 62.54,-147.6 13.71,-28.2 27.87,-56.3 42.49,-84.1 11.67,-22.2 23.79,-44.2 36.71,-65.9 16.32,-27.4 30.71,-55.5 42.15,-84.8 20.28,-52 30.71,-105.5 31.95,-160.4 0.34,-13.1 -0.11,-26.1 -0.91,-39.1 z m -114.89,252.7 c -57.22,97 -106.85,197 -145.82,300.9 -16.2,43.5 -30.14,87.5 -39.66,132.6 -5.1,24.3 -9.4,48.7 -10.31,73.4 -0.91,25.5 -4.19,50.8 -7.02,76.2 -1.25,10.8 -5.55,20.7 -12.46,29.7 -6.46,8.4 -15.41,12.7 -27.08,12.7 H 3155.2 c -0.34,0 -0.79,0.1 -1.13,0.1 h -5.33 c -2.72,0 -5.44,0 -8.16,0.1 -1.25,0.2 -2.38,0.3 -3.63,0.3 -3.51,0 -6.91,-0.1 -10.42,-0.4 -0.45,0 -0.79,0 -1.25,-0.1 h -0.68 c 0,0.1 -3.4,0.1 -3.4,0.1 h -5.33 c -51.21,0 -102.43,-0.2 -153.64,0 -13.82,0 -23.57,-5.1 -30.37,-15.2 -7.36,-10.9 -11.22,-22.7 -12.46,-35.3 -1.47,-15.6 -3.17,-31.2 -4.76,-46.8 -0.23,-2.6 -0.45,-5.2 -0.45,-7.8 -0.91,-47.7 -11.22,-94.1 -24.36,-140.1 -20.85,-72.9 -50.19,-143.3 -82.94,-212.7 -28.67,-60.8 -60.62,-120.4 -94.38,-179.1 -26.97,-46.8 -44.87,-96 -53.03,-148 -2.38,-15.2 -3.74,-30.3 -4.08,-45.6 -0.23,-10.8 -1.13,-21.7 -0.91,-32.5 0.91,-39.2 7.48,-77.6 19.6,-115.2 26.17,-80.7 73.54,-150.1 142.65,-207.7 66.96,-55.7 145.48,-92.4 235.79,-108.9 24.02,-4.4 48.38,-6.8 72.97,-8 20.28,-1 40.56,-0.7 60.73,0.7 52.35,3.7 102.99,13.9 150.92,32.9 142.31,56.3 235.68,151.1 283.26,281.6 11.44,31.4 18.24,63.7 20.96,96.7 1.02,12.6 2.15,25.3 2.15,37.9 -0.23,80.3 -21.3,156.1 -63.45,227.5 h -0.11 z" />
                <path d="m 2972.19,2270.45 c -21.5,-7.3 -33,-21.1 -33.2,-42.4 -0.3,-21.8 11.4,-36 33,-43.7 -2.3,-0.9 -3.5,-1.3 -4.6,-1.8 -29.5,-11.3 -38.2,-48.3 -16.7,-71.4 7,-7.6 15.8,-12.2 26.4,-12.9 2,0 4,-0.2 6,-0.2 h 330.2 c 15.1,0 27.4,5.6 36.2,17.9 15.7,21.8 8.1,56.5 -21.6,66.6 -1.3,0.4 -2.6,0.9 -5,1.7 23.1,7.7 35.6,22.4 34.2,46.4 -1.2,20.6 -13.6,33 -33.6,39.6 2.6,1.1 4.2,1.8 5.7,2.4 17.2,6.3 31.8,24.1 27.4,49.3 -3.5,20.3 -21.4,34.8 -42.4,34.8 h -332 c -23.8,0 -39.2,-16.6 -42.6,-35 -4,-21.3 7.2,-41.5 27.4,-49.4 1.2,-0.5 2.5,-1 5.2,-2 z" />
                <path d="m 3015.49,2373.35 h 265.9 c -6.5,11.3 -15.3,20 -24.4,28.2 -26.1,23.5 -56.7,37.4 -91.8,41.2 -67.4,7.3 -124.7,-29.8 -149.7,-69.4 z" />
                <path d="m 3020.05,831.3 c -64.52,-3.34 -127.8,24.83 -175.76,68.92 -55.15,50.7 -88.17,122.33 -103.56,195.42 -9.66,45.86 -12.19,92.65 -11.79,139.31 0.05,5.74 8.74,5.53 8.69,-0.23 -0.67,-78.68 8.27,-158.28 42.29,-230.31 29.36,-62.15 76.56,-114.75 138.29,-143.55 31.98,-14.92 67.02,-22.45 101.93,-20.64 5.58,0.29 5.47,-8.64 -0.09,-8.93 z" strokeWidth="51" strokeMiterlimit="10" />
                <path d="m 3131.15,1861.24 c -149.4,0 -244.54,-94.95 -244.54,-248.87 V 979.34 h 95.77 v 638 c 0,98.68 56.82,161.98 148.13,161.98 91.31,0 146.85,-57.1 146.85,-156.4 v -48.41 h 95.77 v 52.75 c 0,143.98 -96.41,233.97 -241.98,233.97 z" />
                <path d="m 3179.73,1117.87 h -66.67 v 573.14 h 66.67 z" />
                <path d="M 3148.85,979.34 H 3024.7 c -0.05,19.81 -0.13,39.63 -0.23,59.44 -0.06,11.4 -0.13,22.81 -0.2,34.21 h 129.2 c 91.85,0 150.76,55.57 150.76,144.85 0,19.4 -2.8,37.41 -8.19,53.68 h 80.23 c 2.77,-16.8 4.21,-34.51 4.21,-53.05 0,-146.1 -88.38,-239.13 -231.63,-239.13 z" />
              </g>
              <defs>
                <clipPath id="clip0_1_15">
                  <rect width="1094.88" height="1762.67" transform="translate(2601,681)" />
                </clipPath>
              </defs>
            </svg>
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
