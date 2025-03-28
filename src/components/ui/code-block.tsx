import { cn } from "~/lib/utils";

export function CodeBlock({ children, className, ...props }: React.ComponentProps<"pre">) {
  return (
    <pre
      className={cn(
        "relative font-mono text-sm bg-muted text-foreground rounded-md border border-border/50",
        "p-4 my-4 overflow-x-auto",
        className,
      )}
      {...props}
    >
      <code className="block whitespace-pre font-mono text-sm">{children}</code>
    </pre>
  );
}
