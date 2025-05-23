import type React from "react";

import { cn } from "~/lib/utils";

type TechnologyIconProps = {
  readonly name: string;
  readonly className?: string;
  readonly colored?: boolean;
};

export function TechnologyIcon({ name, className, colored = false }: TechnologyIconProps) {
  return <i className={cn(`devicon-${name}-plain`, colored && "colored", className)} />;
}
