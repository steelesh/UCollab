import { cn } from "~/lib/utils";

export function List({ children, className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props}>
      {children}
    </ul>
  );
}

export function OrderedList({ children, className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)} {...props}>
      {children}
    </ol>
  );
}

export function ListItem({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li className={cn("", className)} {...props}>
      {children}
    </li>
  );
}
