"use client";

import type { Project } from "@prisma/client";

import { Trash2, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ActionButton } from "~/components/ui/action-button";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { StarRating } from "~/components/ui/star-rating";
import { deleteRating, rateProject } from "~/features/projects/project.actions";
import { toastError, toastSuccess } from "~/lib/toast";

type ProjectRatingProps = {
  projectId: Project["id"];
  initialRating?: number | null;
  userRating?: number | null;
  className?: string;
};

export function ProjectRating({ projectId, initialRating: _initialRating = 0, userRating = null, className = "" }: ProjectRatingProps) {
  const [userCurrentRating, setUserCurrentRating] = useState<number | null>(userRating);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [pendingRating, setPendingRating] = useState<number | null>(null);
  const router = useRouter();

  const handleApplyRating = async (rating: number) => {
    setIsLoading(true);
    try {
      await rateProject(projectId, rating);
      setUserCurrentRating(rating);
      router.refresh();

      toastSuccess("Project Rated", {
        description: `You rated this project ${rating} ${rating === 1 ? "star" : "stars"}`,
      });
    } catch {
      toastError("Unable to Rate Project", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = async (rating: number) => {
    if (userCurrentRating) {
      setPendingRating(rating);
      setShowEditConfirm(true);
      return;
    }
    handleApplyRating(rating);
  };

  const handleDeleteRating = async () => {
    setIsLoading(true);
    try {
      await deleteRating(projectId);
      setUserCurrentRating(null);
      router.refresh();
      toastSuccess("Rating Deleted", {
        description: "Your rating has been removed",
      });
    } catch {
      toastError("Unable to Delete Rating", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${className}`}>
      <StarRating
        rating={userCurrentRating}
        onChange={handleRating}
        size="xl"
        disabled={isLoading}
        className="[&_svg]:stroke-foreground [&_svg]:stroke-[1.5px]"
      />
      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
        <UserIcon className="h-4 w-4" />
        {userCurrentRating
          ? (
              <div className="flex items-center gap-2">
                <span>
                  You rated this project
                  {" "}
                  {userCurrentRating}
                  {" "}
                  {userCurrentRating === 1 ? "star" : "stars"}
                </span>
                <ActionButton
                  icon={<Trash2 />}
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                >
                  Delete rating
                </ActionButton>
              </div>
            )
          : (
              <span>You haven't rated this project yet</span>
            )}
      </div>
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Rating"
        description="Are you sure you want to delete your rating for this project? This action cannot be undone."
        confirmText="Delete Rating"
        cancelText="Cancel"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          handleDeleteRating();
        }}
      />
      <ConfirmDialog
        open={showEditConfirm}
        onOpenChange={setShowEditConfirm}
        title="Change Rating"
        description={`Are you sure you want to change your rating from ${userCurrentRating} to ${pendingRating} stars?`}
        confirmText="Change Rating"
        cancelText="Cancel"
        onConfirm={() => {
          setShowEditConfirm(false);
          if (pendingRating !== null) {
            handleApplyRating(pendingRating);
          }
        }}
      />
    </div>
  );
}
