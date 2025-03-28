import type { CheckCheck, Trash } from "lucide-react";

import { Button } from "../ui/button";

export function NotificationActionButton({
  icon: Icon,
  loading,
  onClick,
  disabled,
  variant = "outline",
  className,
  children,
}: {
  icon: typeof Trash | typeof CheckCheck;
  loading?: boolean;
  onClick: () => void;
  disabled?: boolean;
  variant?: "outline";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
    >
      {loading
        ? (
            <>Loading...</>
          )
        : (
            <>
              <Icon className="mr-2 h-4 w-4" />
              {children}
            </>
          )}
    </Button>
  );
}
