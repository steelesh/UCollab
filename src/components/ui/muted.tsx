import { cn } from "@/src/lib/utils";

export function Muted({
  children,
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}
