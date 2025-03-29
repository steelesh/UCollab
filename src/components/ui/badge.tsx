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
        glossy: "relative overflow-hidden bg-gradient-to-br from-background to-background/95 text-foreground border border-border/30 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-foreground/[0.02] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-background/10 after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-border/50 dark:shadow dark:before:from-white/[0.02] dark:after:from-black/10 dark:group-hover:shadow-lg dark:group-hover:border-border/50",
        glossyPrimary: "relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary text-primary-foreground border border-primary/20 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.05] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/10 after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-primary/30 dark:shadow dark:before:from-white/[0.1] dark:after:from-black/20 dark:group-hover:shadow-lg dark:group-hover:border-primary/30",
        contribution: "relative overflow-hidden bg-gradient-to-br from-green-400/10 to-green-500/5 text-green-400 border border-green-400/30 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-foreground/[0.02] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-background/10 after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-green-400/50 dark:shadow dark:group-hover:shadow-lg",
        feedback: "relative overflow-hidden bg-gradient-to-br from-blue-400/10 to-blue-500/5 text-blue-400 border border-blue-400/30 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-foreground/[0.02] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-background/10 after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-blue-400/50 dark:shadow dark:group-hover:shadow-lg",
        trending: "relative overflow-hidden bg-gradient-to-br from-orange-400/10 to-orange-500/5 text-orange-400 border border-orange-400/30 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-foreground/[0.02] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-background/10 after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-orange-400/50 dark:shadow dark:group-hover:shadow-lg",
        mentor: "relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/5 text-blue-400 border border-blue-500/30 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-foreground/[0.02] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-background/10 after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-blue-500/50 dark:shadow dark:group-hover:shadow-lg",
        mentee: "relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/5 text-purple-400 border border-purple-500/30 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-foreground/[0.02] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-background/10 after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-purple-500/50 dark:shadow dark:group-hover:shadow-lg",
        rating: "relative overflow-hidden bg-gradient-to-br from-yellow-400/10 to-yellow-500/5 text-yellow-500 border border-yellow-400/30 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-foreground/[0.02] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-background/10 after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-yellow-400/50 dark:shadow dark:group-hover:shadow-lg",
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
