import { MentorshipStatus } from "@prisma/client";
import { GraduationCap, UserCog } from "lucide-react";
import React from "react";

import { Badge } from "./badge";
import { Small } from "./small";

type BadgeProps = React.ComponentProps<typeof Badge> & {
  children?: React.ReactNode;
};

export function MentorBadge({ children, className, ...props }: BadgeProps) {
  return (
    <Badge variant="mentor" className={className} {...props}>
      <Small noMargin className="flex items-center gap-1">
        <UserCog className="w-3 h-3" />
        Mentor
      </Small>
    </Badge>
  );
}

export function MenteeBadge({ children, className, ...props }: BadgeProps) {
  return (
    <Badge variant="mentee" className={className} {...props}>
      <Small noMargin className="flex items-center gap-1">
        <GraduationCap className="w-3 h-3" />
        Mentee
      </Small>
    </Badge>
  );
}

export function NoMentorshipBadge({ children, className, ...props }: BadgeProps) {
  return (
    <Badge variant="glossy" className={className} {...props}>
      <Small noMargin>
        n/a
      </Small>
    </Badge>
  );
}

export function MentorshipBadge({ status, className, ...props }: BadgeProps & { status: MentorshipStatus }) {
  if (status === MentorshipStatus.MENTOR) {
    return <MentorBadge className={className} {...props} />;
  }
  if (status === MentorshipStatus.MENTEE) {
    return <MenteeBadge className={className} {...props} />;
  }
  return <NoMentorshipBadge className={className} {...props} />;
}
