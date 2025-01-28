import { cn } from "@/src/lib/utils";

export function Lead({
  children,
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-muted-foreground text-xl", className)} {...props}>
      {children}
    </p>
  );
}
