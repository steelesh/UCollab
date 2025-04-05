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
        contribution: "relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-600/5 text-green-600 border border-green-500/20 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-green-500/[0.05] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-green-500/[0.05] after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-green-500/30 dark:from-green-400/10 dark:to-green-500/5 dark:text-green-400 dark:border-green-400/30 dark:before:from-green-400/[0.05] dark:after:from-green-400/[0.05] dark:group-hover:border-green-400/50 dark:group-hover:shadow-lg",
        feedback: "relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/5 text-blue-600 border border-blue-500/20 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-blue-500/[0.05] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-blue-500/[0.05] after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-blue-500/30 dark:from-blue-400/10 dark:to-blue-500/5 dark:text-blue-400 dark:border-blue-400/30 dark:before:from-blue-400/[0.05] dark:after:from-blue-400/[0.05] dark:group-hover:border-blue-400/50 dark:group-hover:shadow-lg",
        trending: "relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-orange-600/5 text-orange-600 border border-orange-500/20 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-orange-500/[0.05] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-orange-500/[0.05] after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-orange-500/30 dark:from-orange-400/10 dark:to-orange-500/5 dark:text-orange-400 dark:border-orange-400/30 dark:before:from-orange-400/[0.05] dark:after:from-orange-400/[0.05] dark:group-hover:border-orange-400/50 dark:group-hover:shadow-lg",
        mentor: "relative overflow-hidden bg-gradient-to-br from-blue-600/10 to-blue-700/5 text-blue-600 border border-blue-600/20 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-blue-600/[0.05] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-blue-600/[0.05] after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-blue-600/30 dark:from-blue-500/10 dark:to-blue-600/5 dark:text-blue-400 dark:border-blue-500/30 dark:before:from-blue-500/[0.05] dark:after:from-blue-500/[0.05] dark:group-hover:border-blue-500/50 dark:group-hover:shadow-lg",
        mentee: "relative overflow-hidden bg-gradient-to-br from-purple-600/10 to-purple-700/5 text-purple-600 border border-purple-600/20 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-purple-600/[0.05] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-purple-600/[0.05] after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-purple-600/30 dark:from-purple-500/10 dark:to-purple-600/5 dark:text-purple-400 dark:border-purple-500/30 dark:before:from-purple-500/[0.05] dark:after:from-purple-500/[0.05] dark:group-hover:border-purple-500/50 dark:group-hover:shadow-lg",
        rating: "relative overflow-hidden bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 text-yellow-600 border border-yellow-500/20 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-yellow-500/[0.05] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-yellow-500/[0.05] after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-yellow-500/30 dark:from-yellow-400/10 dark:to-yellow-500/5 dark:text-yellow-500 dark:border-yellow-400/30 dark:before:from-yellow-400/[0.05] dark:after:from-yellow-400/[0.05] dark:group-hover:border-yellow-400/50 dark:group-hover:shadow-lg",
        developer_available: "relative overflow-hidden bg-gradient-to-br from-gray-600/10 to-gray-700/5 text-gray-600 border border-gray-600/20 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-gray-600/[0.05] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-gray-600/[0.05] after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-gray-600/30 dark:from-gray-400/10 dark:to-gray-500/5 dark:text-gray-500 dark:border-gray-400/30 dark:before:from-gray-400/[0.05] dark:after:from-gray-400/[0.05] dark:group-hover:border-gray-400/50 dark:group-hover:shadow-lg",
        seeking_mentor: "relative overflow-hidden bg-gradient-to-br from-amber-600/10 to-amber-700/5 text-amber-600 border border-amber-600/20 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-amber-600/[0.05] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-amber-600/[0.05] after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-amber-600/30 dark:from-amber-400/10 dark:to-amber-500/5 dark:text-amber-500 dark:border-amber-400/30 dark:before:from-amber-400/[0.05] dark:after:from-amber-400/[0.05] dark:group-hover:border-amber-400/50 dark:group-hover:shadow-lg",
        mentor_available: "relative overflow-hidden bg-gradient-to-br from-emerald-600/10 to-emerald-700/5 text-emerald-600 border border-emerald-600/20 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-emerald-600/[0.05] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-emerald-600/[0.05] after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-emerald-600/30 dark:from-emerald-400/10 dark:to-emerald-500/5 dark:text-emerald-500 dark:border-emerald-400/30 dark:before:from-emerald-400/[0.05] dark:after:from-emerald-400/[0.05] dark:group-hover:border-emerald-400/50 dark:group-hover:shadow-lg",
        team_formation: "relative overflow-hidden bg-gradient-to-br from-indigo-600/10 to-indigo-700/5 text-indigo-600 border border-indigo-600/20 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-indigo-600/[0.05] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-indigo-600/[0.05] after:to-transparent transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:border-indigo-600/30 dark:from-indigo-400/10 dark:to-indigo-500/5 dark:text-indigo-500 dark:border-indigo-400/30 dark:before:from-indigo-400/[0.05] dark:after:from-indigo-400/[0.05] dark:group-hover:border-indigo-400/50 dark:group-hover:shadow-lg",
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
