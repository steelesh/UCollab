import { cn } from "@/src/lib/utils";

export function LogoSvg({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn("h-6 w-6", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16V8" />
      <path d="M8 12h8" />
    </svg>
  );
}
