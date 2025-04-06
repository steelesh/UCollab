import { NeedType } from "@prisma/client";
import { Briefcase, GitPullRequest, Lightbulb, MessageSquare, Star, TrendingUp, UserPlus, Users } from "lucide-react";
import React from "react";

import type { PostNeed } from "~/features/posts/post.types";

import { Badge } from "./badge";
import { Small } from "./small";

type BadgeProps = React.ComponentProps<typeof Badge> & {
  children?: React.ReactNode;
  value?: string | number;
  size?: "sm" | "md" | "lg";
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
        {value ?? "0.0"}
      </Small>
    </Badge>
  );
}

export function PostTypeBadge({ type, className, size = "md", ...props }: BadgeProps & { type: NeedType }) {
  // Get size-based classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs py-0.5 px-2";
      case "lg":
        return "text-sm md:text-base py-1 px-3 md:py-1.5 md:px-4";
      case "md":
      default:
        return "text-xs md:text-sm py-0.5 px-2 md:py-1 md:px-3";
    }
  };

  // Get icon size based on badge size
  const getIconClasses = () => {
    switch (size) {
      case "sm":
        return "w-3.5 h-3.5 mr-1.5";
      case "lg":
        return "w-4 h-4 md:w-5 md:h-5 mr-2";
      case "md":
      default:
        return "w-4 h-4 mr-1.5 md:mr-2";
    }
  };

  const sizeClasses = getSizeClasses();
  const iconClasses = getIconClasses();

  if (type === NeedType.CONTRIBUTION) {
    return (
      <Badge variant="contribution" className={`inline-flex items-center ${sizeClasses} ${className}`} {...props}>
        <GitPullRequest className={iconClasses} />
        <span>Seeking Contribution</span>
      </Badge>
    );
  }
  if (type === NeedType.FEEDBACK) {
    return (
      <Badge variant="feedback" className={`inline-flex items-center ${sizeClasses} ${className}`} {...props}>
        <MessageSquare className={iconClasses} />
        <span>Seeking Feedback</span>
      </Badge>
    );
  }
  if (type === NeedType.DEVELOPER_AVAILABLE) {
    return (
      <Badge variant="secondary" className={`inline-flex items-center ${sizeClasses} ${className}`} {...props}>
        <UserPlus className={iconClasses} />
        <span>Developer Available</span>
      </Badge>
    );
  }
  if (type === NeedType.TEAM_FORMATION) {
    return (
      <Badge variant="secondary" className={`inline-flex items-center ${sizeClasses} ${className}`} {...props}>
        <Users className={iconClasses} />
        <span>Team Formation</span>
      </Badge>
    );
  }
  if (type === NeedType.SEEKING_MENTOR) {
    return (
      <Badge variant="secondary" className={`inline-flex items-center ${sizeClasses} ${className}`} {...props}>
        <Lightbulb className={iconClasses} />
        <span>Seeking Mentor</span>
      </Badge>
    );
  }
  if (type === NeedType.MENTOR_AVAILABLE) {
    return (
      <Badge variant="secondary" className={`inline-flex items-center ${sizeClasses} ${className}`} {...props}>
        <Briefcase className={iconClasses} />
        <span>Mentor Available</span>
      </Badge>
    );
  }
  return null;
}

export function PostNeedsBadges({ needs, className, size = "md" }: { readonly needs: PostNeed[]; readonly className?: string; readonly size?: "sm" | "md" | "lg" }) {
  if (!needs.length)
    return null;

  const primaryNeed = needs.find(need => need.isPrimary);
  const needsToShow = primaryNeed
    ? [primaryNeed, ...needs.filter(n => n.id !== primaryNeed.id).slice(0, 2)]
    : needs.slice(0, 3);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {needsToShow.map(need => (
        <PostTypeBadge key={need.id} type={need.needType} size={size} />
      ))}
      {needs.length > 3 && (
        <Badge variant="outline">
          <Small noMargin>
            +
            {needs.length - 3}
            {" "}
            more
          </Small>
        </Badge>
      )}
    </div>
  );
}
