import * as React from "react";

import { cn } from "~/lib/utils";

const cardVariants = {
  default: "bg-card text-card-foreground border shadow-sm",
  glossy: "relative overflow-hidden bg-gradient-to-br from-neutral-950 to-neutral-900 text-neutral-100 border border-neutral-800/30 shadow-[0_0_20px_rgba(0,0,0,0.35),0_0_4px_rgba(255,255,255,0.12)] backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/20 after:to-transparent [&_a]:relative [&_a]:z-10 [&_button]:relative [&_button]:z-10",
};

function Card({ className, variant = "default", ...props }: React.ComponentProps<"div"> & { variant?: keyof typeof cardVariants }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-xl py-6 transition-all duration-500 ease-in-out",
        cardVariants[variant],
        variant === "glossy" && "hover:shadow-[0_0_30px_rgba(0,0,0,0.45),0_0_6px_rgba(255,255,255,0.18)] hover:border-neutral-700/50",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-1.5 px-6", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("leading-none font-semibold", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center px-6", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
