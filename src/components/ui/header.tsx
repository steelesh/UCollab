import { cn } from "~/lib/utils";

export function Header({ children, className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      className={cn("mb-8", className)}
      {...props}
    >
      {children}
    </header>
  );
}
