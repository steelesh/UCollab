import { cn } from "~/lib/utils";

export function Large({ noMargin, children, className, ...props }: React.ComponentProps<"div"> & { noMargin?: boolean }) {
  return (
    <div
      className={cn("text-lg font-semibold", !noMargin && "mb-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}
