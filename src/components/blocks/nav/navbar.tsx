import { AuthSection } from "./auth-section";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { NavLinkProps } from "./nav-link";
import { NavLogo } from "./nav-logo";

export interface NavSection {
  title: string;
  items: NavLinkProps[];
}

const routes: NavSection[] = [
  {
    title: "Explore",
    items: [
      {
        title: "All Posts",
        href: "/posts",
        description: "Browse all posts across categories",
      },
      {
        title: "Q & A",
        href: "/questions",
        description: "Ask questions and help others with solutions",
      },
      {
        title: "Code Reviews",
        href: "/feedback",
        description: "Get feedback on your code and projects",
      },
      {
        title: "Collaborations",
        href: "/collaborations",
        description: "Find teammates for your projects",
      },
      {
        title: "Mentorship",
        href: "/mentorship",
        description: "Connect with mentors or become one",
      },
      {
        title: "Discussions",
        href: "/discussions",
        description: "Start or join general discussions",
      },
      {
        title: "Trending",
        href: "/trending",
        description: "See what's popular in the community",
      },
      {
        title: "Tags",
        href: "/tags",
        description: "Browse posts by technology or topic",
      },
    ],
  },
  {
    title: "Community",
    items: [
      {
        title: "Community Guide",
        href: "/community-guide",
        description: "How to get the most out of UCollab",
      },
      {
        title: "Contribution Guide",
        href: "/contributing",
        description: "Learn how to contribute to UCollab",
      },
      {
        title: "Code of Conduct",
        href: "/code-of-conduct",
        description: "Our community values and expectations",
      },
    ],
  },
];

export default function Navbar() {
  return (
    <div className="w-full px-4 pt-8 pb-2 sm:px-6 lg:px-8">
      <nav className="bg-background mx-auto flex h-16 max-w-2xl items-center justify-between rounded-full border px-5">
        <div className="flex items-center gap-4">
          <MobileNav items={routes} />
          <NavLogo />
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