import { cn } from "~/lib/utils";

export function Small({ children, className, ...props }: React.ComponentProps<"small">) {
  return (
    <small
      className={cn("text-sm font-medium leading-none mb-2", className)}
      {...props}
    >
      {children}
    </small>
  );
}
