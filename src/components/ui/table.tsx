import { cn } from "~/lib/utils";

type TableProps = {
  wrapperClassName?: string;
} & React.ComponentProps<"table">;

export function Table({ children, className, wrapperClassName, ...props }: TableProps) {
  return (
    <div className={cn("my-6 w-full overflow-y-auto", wrapperClassName)}>
      <table className={cn("w-full", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead className={cn("", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody className={cn("", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr className={cn("m-0 border-t p-0 even:bg-muted", className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn("border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right", className)}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn("border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right", className)}
      {...props}
    >
      {children}
    </td>
  );
}
