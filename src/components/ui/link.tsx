import Link from "next/link";

import { cn } from "~/lib/utils";

type TypographyLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  isExternal?: boolean;
};

export function TypographyLink({ href, children, className, isExternal = false }: TypographyLinkProps) {
  const isInternal = href.startsWith("/");
  const Comp = isInternal ? Link : "a";

  return (
    <Comp
      href={href}
      className={cn(
        "text-foreground font-medium border-b border-foreground/30 hover:border-foreground transition-colors duration-200 pb-0.5",
        className,
      )}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </Comp>
  );
}
