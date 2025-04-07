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
  readonly icon: typeof Trash | typeof CheckCheck;
  readonly loading?: boolean;
  readonly onClick: () => void;
  readonly disabled?: boolean;
  readonly variant?: "outline";
  readonly className?: string;
  readonly children: React.ReactNode;
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
