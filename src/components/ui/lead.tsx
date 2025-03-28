import { cn } from "~/lib/utils";

export function Lead({ children, className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-xl text-muted-foreground mb-4", className)}
      {...props}
    >
      {children}
    </p>
  );
}
