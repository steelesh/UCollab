import { cn } from "@/src/lib/utils";

export function LargeText({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("text-lg font-semibold", className)} {...props}>
      {children}
    </div>
  );
}
