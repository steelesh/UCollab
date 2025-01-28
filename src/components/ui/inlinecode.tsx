import { cn } from "@/src/lib/utils";

export function InlineCode({
  children,
  className,
  ...props
}: React.ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "bg-muted relative rounded px-[0.3rem] py-[0.2rem] text-sm font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}
