"use client";

import type { Project } from "@prisma/client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { bookmarkProject, unbookmarkProject } from "~/features/projects/project.actions";
import { toastError, toastSuccess } from "~/lib/toast";

import { ActionButton } from "../ui/action-button";
import { ConfirmDialog } from "../ui/confirm-dialog";

type ProjectBookmarkProps = {
  projectId: Project["id"];
  initialBookmarked: boolean;
  className?: string;
};

export function ProjectBookmark({ projectId, initialBookmarked, className = "" }: ProjectBookmarkProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [showUnbookmarkConfirm, setShowUnbookmarkConfirm] = useState(false);
  const router = useRouter();

  const handleBookmark = async () => {
    setIsLoading(true);
    try {
      await bookmarkProject(projectId);
      setIsBookmarked(true);
      router.refresh();
      toastSuccess("Project Bookmarked", {
        description: "Project has been added to your bookmarks",
      });
    } catch {
      toastError("Unable to Bookmark Project", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnbookmark = async () => {
    setIsLoading(true);
    try {
      await unbookmarkProject(projectId);
      setIsBookmarked(false);
      router.refresh();
      toastSuccess("Bookmark Removed", {
        description: "Project has been removed from your bookmarks",
      });
    } catch {
      toastError("Unable to Remove Bookmark", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${className}`}>
      {isBookmarked
        ? (
            <>
              <ActionButton
                icon={<BookmarkCheck className="w-5 h-5 text-yellow-500" />}
                onClick={() => setShowUnbookmarkConfirm(true)}
                disabled={isLoading}
                className="flex items-center gap-2 hover:text-foreground transition-colors duration-200"
              >
                <span className="text-sm">Bookmarked</span>
              </ActionButton>
              <ConfirmDialog
                open={showUnbookmarkConfirm}
                onOpenChange={setShowUnbookmarkConfirm}
                title="Remove Bookmark"
                description="Are you sure you want to remove this project from your bookmarks?"
                confirmText="Remove"
                cancelText="Cancel"
                onConfirm={() => {
                  setShowUnbookmarkConfirm(false);
                  handleUnbookmark();
                }}
              />
            </>
          )
        : (
            <ActionButton
              icon={<Bookmark className="w-5 h-5" />}
              onClick={handleBookmark}
              disabled={isLoading}
              className="flex items-center gap-2 hover:text-foreground transition-colors duration-200"
            >
              <span className="text-sm">Bookmark</span>
            </ActionButton>
          )}
    </div>
  );
}
