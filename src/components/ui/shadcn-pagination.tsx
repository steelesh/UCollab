import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import * as React from "react";

import type { Button } from "~/components/ui/button";

import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

function ShadcnPagination({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav role="navigation" aria-label="pagination" data-slot="pagination" className={cn(className)} {...props} />;
}

function ShadcnPaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex flex-row items-center gap-1", className)} {...props} />;
}

function ShadcnPaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  children: React.ReactNode;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
React.ComponentProps<"a">;

function ShadcnPaginationLink({ className, isActive, size = "icon", children, ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

function ShadcnPaginationPrevious({ className, ...props }: React.ComponentProps<typeof ShadcnPaginationLink>) {
  return (
    <ShadcnPaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </ShadcnPaginationLink>
  );
}

function ShadcnPaginationNext({ className, ...props }: React.ComponentProps<typeof ShadcnPaginationLink>) {
  return (
    <ShadcnPaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </ShadcnPaginationLink>
  );
}

function ShadcnPaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  ShadcnPagination,
  ShadcnPaginationContent,
  ShadcnPaginationEllipsis,
  ShadcnPaginationItem,
  ShadcnPaginationLink,
  ShadcnPaginationNext,
  ShadcnPaginationPrevious,
};
