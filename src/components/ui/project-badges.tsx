import { ProjectType } from "@prisma/client";
import { GitPullRequest, MessageSquare, Star, TrendingUp } from "lucide-react";
import React from "react";

import { Badge } from "./badge";
import { Small } from "./small";

type BadgeProps = React.ComponentProps<typeof Badge> & {
  children?: React.ReactNode;
  value?: string | number;
};

export function ContributionBadge({ children, className, ...props }: BadgeProps) {
  return (
    <Badge variant="contribution" className={className} {...props}>
      <Small noMargin className="flex items-center gap-1">
        <GitPullRequest className="w-4 h-4" />
        {children}
      </Small>
    </Badge>
  );
}

export function FeedbackBadge({ children, className, ...props }: BadgeProps) {
  return (
    <Badge variant="feedback" className={className} {...props}>
      <Small noMargin className="flex items-center gap-1">
        <MessageSquare className="w-4 h-4" />
        {children || "Looking for feedback"}
      </Small>
    </Badge>
  );
}

export function TrendingBadge({ className, ...props }: BadgeProps) {
  return (
    <Badge variant="trending" className={className} {...props}>
      <Small noMargin className="flex items-center gap-1">
        Trending
        <TrendingUp className="w-4 h-4" />
      </Small>
    </Badge>
  );
}

export function RatingBadge({ value, className, ...props }: BadgeProps) {
  return (
    <Badge variant="rating" className={className} {...props}>
      <Small noMargin className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 stroke-background stroke-[1.5px]" />
        {value || "0.0"}
      </Small>
    </Badge>
  );
}

export function ProjectTypeBadge({ type, className, ...props }: BadgeProps & { type: ProjectType }) {
  if (type === ProjectType.CONTRIBUTION) {
    return (
      <Badge variant="contribution" className={`inline-flex items-center ${className}`} {...props}>
        <GitPullRequest className="w-4 h-4 md:w-5 md:h-5 mr-2" />
        <span>Seeking Contribution</span>
      </Badge>
    );
  }
  if (type === ProjectType.FEEDBACK) {
    return (
      <Badge variant="feedback" className={`inline-flex items-center ${className}`} {...props}>
        <MessageSquare className="w-4 h-4 md:w-5 md:h-5 mr-2" />
        <span>Seeking Feedback</span>
      </Badge>
    );
  }
  return null;
}
