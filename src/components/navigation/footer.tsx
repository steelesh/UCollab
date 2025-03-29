import type { Route } from "next";

import Link from "next/link";

import { ModeToggle } from "~/components/ui/mode-toggle";

export default function Footer() {
  const navigation = {
    main: [
      { name: "Accessibility", href: "/accessibility" },
      { name: "Privacy", href: "/privacy" },
      { name: "License", href: "/license" },
      { name: "About Us", href: "/about" },
    ],
  };

  return (
    <footer className="mt-6 py-10">
      <hr className="mx-auto mb-8 h-0.25 w-1/3 border-0 bg-gradient-to-r from-transparent via-border to-transparent" />
      <nav aria-label="Footer" className="flex items-center justify-center gap-8 text-sm">
        {navigation.main.map(item => (
          <Link
            key={item.name}
            href={item.href as Route}
            className="font-medium text-foreground/80 hover:text-foreground transition-colors duration-200"
          >
            {item.name}
          </Link>
        ))}
        <ModeToggle />
      </nav>
    </footer>
  );
}
