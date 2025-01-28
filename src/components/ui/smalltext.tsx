import { cn } from "@/src/lib/utils";

export function SmallText({
  children,
  className,
  ...props
}: React.ComponentProps<"small">) {
  return (
    <small
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    >
      {children}
    </small>
  );
}
