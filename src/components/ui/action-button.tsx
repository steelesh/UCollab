import type { VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type ActionButtonProps = {
  icon?: ReactNode;
  children?: ReactNode;
  variant?: "default" | "outline" | "destructive" | "ghost";
  iconOnly?: boolean;
  onClick?: () => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> &
Omit<VariantProps<typeof Button>, "variant">;

export function ActionButton({
  icon,
  children,
  variant = "outline",
  iconOnly = false,
  onClick,
  className = "",
  ...props
}: ActionButtonProps) {
  if (iconOnly && icon) {
    return (
      <Button
        onClick={onClick}
        variant={variant as any}
        size="sm"
        className={cn(
          "flex items-center justify-center p-0 bg-transparent border-none hover:bg-transparent focus:ring-0 cursor-pointer",
          className,
        )}
        {...props}
      >
        <span className="h-3.5 w-3.5">{icon}</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      variant={variant as any}
      size="sm"
      className={`h-6 px-1.5 text-xs cursor-pointer ${className}`}
      {...props}
    >
      {icon && <span className="h-3.5 w-3.5">{icon}</span>}
      {children && <span>{children}</span>}
    </Button>
  );
}
