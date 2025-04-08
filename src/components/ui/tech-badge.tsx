import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import { TechnologyIcon } from "~/components/ui/technology-icon";

type TechBadgeProps = {
  readonly tech: string;
  readonly onRemove?: () => void;
};

function TechBadge({ tech, onRemove }: TechBadgeProps) {
  const [hovered, setHovered] = useState(false);
  const isInteractive = typeof onRemove === "function";

  return (
    <Badge
      variant={hovered && isInteractive ? "destructive" : "secondary"}
      className={`flex items-center gap-1 ${isInteractive ? "cursor-pointer transition duration-200 ease-in-out hover:scale-105" : ""}`}
      onClick={isInteractive ? onRemove : undefined}
      onMouseEnter={isInteractive ? () => setHovered(true) : undefined}
      onMouseLeave={isInteractive ? () => setHovered(false) : undefined}
    >
      <TechnologyIcon name={tech} colored />
      <span className="truncate">{tech}</span>
    </Badge>
  );
}

export default TechBadge;
