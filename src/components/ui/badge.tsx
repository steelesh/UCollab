import type { VariantProps } from "class-variance-authority";

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        glossy: "relative overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-100 border border-neutral-700/30 shadow-[0_0_10px_rgba(0,0,0,0.25),0_0_2px_rgba(255,255,255,0.08)] backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/10 after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-[0_0_15px_rgba(0,0,0,0.35),0_0_3px_rgba(255,255,255,0.12)] group-hover:border-neutral-600/50",
        glossyPrimary: "relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary text-primary-foreground border border-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.3),0_0_2px_rgba(255,255,255,0.1)] backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.1] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/20 after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-[0_0_15px_rgba(var(--primary),0.4),0_0_3px_rgba(255,255,255,0.15)] group-hover:border-primary/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
