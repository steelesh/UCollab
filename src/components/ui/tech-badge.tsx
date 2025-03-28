import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import { TechnologyIcon } from "~/components/ui/technology-icon";

type TechBadgeProps = {
  tech: string;
  onRemove: () => void;
};

function TechBadge({ tech, onRemove }: TechBadgeProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Badge
      variant={hovered ? "destructive" : "glossy"}
      className="flex items-center gap-1 cursor-pointer transition duration-200 ease-in-out hover:scale-105"
      onClick={onRemove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <TechnologyIcon name={tech} colored />
      <span className="truncate">{tech}</span>
    </Badge>
  );
}

export default TechBadge;
