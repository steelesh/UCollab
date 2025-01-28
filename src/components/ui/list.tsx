import { cn } from "@/src/lib/utils";

export function List({
  children,
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul className={cn("my-6 list-disc [&>li]:mt-2", className)} {...props}>
      {children}
    </ul>
  );
}
