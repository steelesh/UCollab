import { cn } from "~/lib/utils";

export function Small({ noMargin = false, children, className, ...props }: React.ComponentProps<"small"> & { noMargin?: boolean }) {
  return (
    <small
      className={cn("text-sm font-medium leading-none", !noMargin && "mb-2", className)}
      {...props}
    >
      {children}
    </small>
  );
}
