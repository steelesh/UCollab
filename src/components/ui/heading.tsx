import { createElement } from "react";

import { cn } from "~/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = {
  level: HeadingLevel;
  noMargin?: boolean;
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<"h1">, "className" | "children">;

const headingStyles: Record<HeadingLevel, string> = {
  h1: "scroll-m-20 border-b pb-2 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors mb-4",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight mb-3",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight mb-2",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight mb-2",
  h6: "scroll-m-20 text-base font-semibold tracking-tight mb-1",
};

export function Heading({ ref, level, children, className, noMargin, ...props }: HeadingProps & { ref?: React.RefObject<HTMLHeadingElement | null> }) {
  return createElement(
    level,
    {
      className: cn(headingStyles[level], !noMargin && "mb-6", className),
      ref,
      ...props,
    },
    children,
  );
}

Heading.displayName = "Heading";

export const H1 = ({ ref, ...props }: Omit<HeadingProps, "level"> & { ref?: React.RefObject<HTMLHeadingElement | null> }) => <Heading ref={ref} level="h1" {...props} />;
H1.displayName = "H1";

export const H2 = ({ ref, ...props }: Omit<HeadingProps, "level"> & { ref?: React.RefObject<HTMLHeadingElement | null> }) => <Heading ref={ref} level="h2" {...props} />;
H2.displayName = "H2";

export const H3 = ({ ref, ...props }: Omit<HeadingProps, "level"> & { ref?: React.RefObject<HTMLHeadingElement | null> }) => <Heading ref={ref} level="h3" {...props} />;
H3.displayName = "H3";

export const H4 = ({ ref, ...props }: Omit<HeadingProps, "level"> & { ref?: React.RefObject<HTMLHeadingElement | null> }) => <Heading ref={ref} level="h4" {...props} />;
H4.displayName = "H4";

export const H5 = ({ ref, ...props }: Omit<HeadingProps, "level"> & { ref?: React.RefObject<HTMLHeadingElement | null> }) => <Heading ref={ref} level="h5" {...props} />;
H5.displayName = "H5";

export const H6 = ({ ref, ...props }: Omit<HeadingProps, "level"> & { ref?: React.RefObject<HTMLHeadingElement | null> }) => <Heading ref={ref} level="h6" {...props} />;
H6.displayName = "H6";
