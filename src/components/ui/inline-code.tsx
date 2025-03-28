import { cn } from "~/lib/utils";

export function InlineCode({ children, className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "relative font-mono text-sm",
        "bg-muted text-foreground px-[0.3rem] py-[0.2rem] rounded border border-border/50",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}
