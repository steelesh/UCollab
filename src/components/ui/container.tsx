import React from "react";

import { cn } from "~/lib/utils";

type ContainerProps<T extends React.ElementType = "div"> = {
  as?: T;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full" | "default";
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "size" | "className" | "children">;

export function Container<T extends React.ElementType = "div">({
  children,
  className,
  size = "default",
  as,
  ...props
}: ContainerProps<T>) {
  const Component = as || "div";

  const sizeClasses = {
    "sm": "max-w-sm",
    "md": "max-w-md",
    "lg": "max-w-lg",
    "xl": "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    "full": "max-w-full",
    "default": "max-w-7xl",
  }[size];

  return (
    <Component
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        sizeClasses,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
