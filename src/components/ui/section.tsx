import { cn } from "~/lib/utils";

export function Section({ children, className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("mt-12", className)}
      {...props}
    >
      {children}
    </section>
  );
}
