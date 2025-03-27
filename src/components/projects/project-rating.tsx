"use client";

import type { Project } from "@prisma/client";

import { User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { StarRating } from "~/components/ui/star-rating";
import { rateProject } from "~/features/projects/project.actions";

type ProjectRatingProps = {
  projectId: Project["id"];
  initialRating: number;
  userRating: number;
};

export function ProjectRating({ projectId, userRating = 0 }: ProjectRatingProps) {
  const [userCurrentRating, setUserCurrentRating] = useState<number>(userRating);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRating = async (rating: number) => {
    setIsLoading(true);
    try {
      await rateProject(projectId, rating);
      setUserCurrentRating(rating);
      router.refresh();
    } catch {
      // handle err, show toast or something
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <div className="mb-2">
        <h3 className="text-sm font-medium">Rate this project</h3>
      </div>
      <StarRating rating={userCurrentRating} onChange={handleRating} size="md" disabled={isLoading} />
      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
        <UserIcon className="h-4 w-4" />
        {userCurrentRating > 0
          ? (
              <span>
                You rated this project
                {" "}
                {userCurrentRating}
                {" "}
                {userCurrentRating === 1 ? "star" : "stars"}
              </span>
            )
          : (
              <span>You haven't rated this project yet</span>
            )}
      </div>
    </div>
  );
}
