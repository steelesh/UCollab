import { Route } from "next";
import Link from "next/link";
import { ModeToggle } from "../../ui/color-mode-toggle";
import { Container } from "../../ui/container";
import { H3 } from "../../ui/h3";
import { List } from "../../ui/list";
import { P } from "../../ui/p";
import { FooterLogo } from "./footer-logo";

export interface FooterLink {
  title: string;
  href: string;
}

interface FooterSection {
  title: string;
  items: FooterLink[];
}

const routes: FooterSection[] = [
  {
    title: "About",
    items: [
      { title: "About", href: "/about" },
      { title: "Team", href: "/team" },
      { title: "Accessibility", href: "/accessibility" },
    ],
  },
  {
    title: "Legal",
    items: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
      { title: "Code of Conduct", href: "/code-of-conduct" },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "FAQ", href: "/faq" },
      { title: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-inverse sticky bottom-0 w-full pt-8">
      <Container>
        <div className="flex flex-col gap-20 py-16 md:flex-row md:justify-between">
          <FooterLogo />
          <div className="grid grid-cols-2 gap-12 md:grid-cols-3 lg:gap-32">
            {routes.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <H3 className="text-inverse">{section.title}</H3>
                <List className="flex flex-col gap-3">
                  {section.items.map((item) => (
                    <Link
                      href={item.href as Route}
                      key={item.title}
                      className="text-inverse-muted-foreground hover:text-inverse-foreground text-sm transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                </List>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between py-6">
          <P className="text-inverse-muted-foreground text-xs">
            © {new Date().getFullYear()} UCollab. All rights reserved.
          </P>
          <ModeToggle />
        </div>
      </Container>
    </footer>
  );
}
