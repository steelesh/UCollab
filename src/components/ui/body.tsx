import { cn } from "~/lib/utils";

export function Body({ children, className, ...props }: React.ComponentProps<"body">) {
  return (
    <body className={cn("bg-background text-foreground flex min-h-screen w-full flex-col antialiased", className)} {...props}>
      {children}
    </body>
  );
}
