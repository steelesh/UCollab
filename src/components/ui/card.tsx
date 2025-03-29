import * as React from "react";

import { cn } from "~/lib/utils";

const cardVariants = {
  default: "bg-card text-card-foreground border shadow-sm",
  glossy: "relative overflow-hidden bg-gradient-to-br from-background to-background/95 text-foreground border border-border/30 shadow-md backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-foreground/[0.02] before:to-transparent before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-t after:from-background/10 after:to-transparent after:pointer-events-none dark:shadow-xl dark:before:from-white/[0.03] dark:after:from-black/20",
};

function Card({ className, variant = "default", ...props }: React.ComponentProps<"div"> & { variant?: keyof typeof cardVariants }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-xl py-6 transition-all duration-500 ease-in-out",
        cardVariants[variant],
        variant === "glossy" && "hover:shadow-lg hover:border-border/50 dark:hover:shadow-2xl dark:hover:border-border/50",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-1.5 px-6 relative z-10", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("leading-none font-semibold relative z-10", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-muted-foreground text-sm relative z-10", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6 relative z-10", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center px-6 relative z-10", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
