import { Star } from "lucide-react";
import React from "react";

import { cn } from "~/lib/utils";

type StarDisplayProps = {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
  maxStars?: number;
};

export function StarDisplay({ rating, size = "md", className, showValue = false, maxStars = 5 }: StarDisplayProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const starSizeClass = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: maxStars }).map((_, i) => {
          const starNumber = i + 1;
          const fillPercentage = Math.max(0, Math.min(1, rating - i));
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
      {showValue && (
        <span
          className={cn(
            "ml-1 font-medium",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base",
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

type StarRatingProps = {
  rating: number | null;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  maxStars?: number;
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
  };

  const starSizeClass = sizeClasses[size];

  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const starNumber = i + 1;
        const isActive = hoverRating !== null ? starNumber <= hoverRating : rating !== null && starNumber <= rating;
        return (
          <button
            key={starNumber}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(starNumber)}
            onMouseEnter={() => setHoverRating(starNumber)}
            onMouseLeave={() => setHoverRating(null)}
            className={cn(
              "focus:ring-primary relative transition-transform hover:scale-110 focus:ring-1 focus:outline-none",
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
