import { cn } from "~/lib/utils";

export function Large({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-lg font-semibold mb-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}
