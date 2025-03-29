import type { VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Button } from "~/components/ui/button";

type ActionButtonProps = {
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "outline" | "destructive";
  onClick?: () => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> &
Omit<VariantProps<typeof Button>, "variant">;

export function ActionButton({
  icon,
  children,
  variant = "outline",
  onClick,
  className = "",
  ...props
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant as any}
      size="sm"
      className={`h-7 px-2 cursor-pointer ${className}`}
      {...props}
    >
      {icon && <span className="h-4 w-4 mr-1">{icon}</span>}
      <span>{children}</span>
    </Button>
  );
}
