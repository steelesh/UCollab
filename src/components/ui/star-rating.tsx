import { Star } from "lucide-react";
import React from "react";

import { cn } from "~/lib/utils";

type StarDisplayProps = {
  readonly rating: number | null;
  readonly size?: "sm" | "md" | "lg";
  readonly className?: string;
  readonly showValue?: boolean;
  readonly maxStars?: number;
};

export function StarDisplay({ rating, size = "md", className, showValue = false, maxStars = 5 }: StarDisplayProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const starSizeClass = sizeClasses[size];
  const displayRating = rating && rating > 0 ? rating : 0;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: maxStars }).map((_, i) => {
          const starNumber = i + 1;
          const fillPercentage = rating && rating > 0 ? Math.max(0, Math.min(1, rating - i)) : 0;
          return (
            <div key={starNumber} className={cn("relative", starSizeClass)}>
              <Star className={cn("absolute inset-0", starSizeClass, "text-yellow-400")} fill="none" strokeWidth={2} />
              {fillPercentage > 0 && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage * 100}%` }}>
                  <Star className={cn(starSizeClass, "text-yellow-400")} fill="currentColor" strokeWidth={2} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showValue && rating && rating > 0 && (
        <span
          className={cn(
            "ml-1 font-medium",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base",
          )}
        >
          {displayRating.toFixed(1)}
        </span>
      )}
      {showValue && (!rating || rating <= 0) && (
        <span
          className={cn(
            "ml-1 font-medium text-muted-foreground",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base",
          )}
        >
          Not rated
        </span>
      )}
    </div>
  );
}

type StarRatingProps = {
  readonly rating: number | null;
  readonly onChange?: (rating: number) => void;
  readonly size?: "sm" | "md" | "lg" | "xl";
  readonly disabled?: boolean;
  readonly className?: string;
  readonly maxStars?: number;
};

export function StarRating({
  rating,
  onChange,
  size = "md",
  disabled = false,
  className,
  maxStars = 5,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6",
  };

  const starSizeClass = sizeClasses[size];

  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const starNumber = i + 1;
        const isActive = hoverRating !== null ? starNumber <= hoverRating : rating !== null && rating > 0 && starNumber <= rating;
        return (
          <button
            key={starNumber}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(starNumber)}
            onMouseEnter={() => setHoverRating(starNumber)}
            onMouseLeave={() => setHoverRating(null)}
            className={cn(
              "focus:ring-primary relative transition-transform hover:scale-110 focus:ring-1 focus:outline-none cursor-pointer",
              starSizeClass,
              disabled && "cursor-not-allowed opacity-50",
            )}
            aria-label={`Rate ${starNumber} stars`}
          >
            <Star
              className={cn(starSizeClass, "text-yellow-400")}
              fill={isActive ? "currentColor" : "none"}
              strokeWidth={2}
            />
          </button>
        );
      })}
    </div>
  );
}
