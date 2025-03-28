import { cn } from "~/lib/utils";

export function Main({ children, className, ...props }: React.ComponentProps<"main">) {
  return (
    <main className={cn("mt-28 grow", className)} {...props}>
      {children}
    </main>
  );
}
