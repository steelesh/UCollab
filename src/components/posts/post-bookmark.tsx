"use client";

import type { Post } from "@prisma/client";

import { BookmarkCheck, BookmarkPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { bookmarkPost, unbookmarkPost } from "~/features/posts/post.actions";
import { toastError, toastSuccess } from "~/lib/toast";

import { ActionButton } from "../ui/action-button";
import { ConfirmDialog } from "../ui/confirm-dialog";

type PostBookmarkProps = {
  readonly postId: Post["id"];
  readonly initialBookmarked: boolean;
  readonly className?: string;
};

export function PostBookmark({ postId, initialBookmarked, className = "" }: PostBookmarkProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [showUnbookmarkConfirm, setShowUnbookmarkConfirm] = useState(false);
  const router = useRouter();

  const handleBookmark = async () => {
    setIsLoading(true);
    try {
      await bookmarkPost(postId);
      setIsBookmarked(true);
      router.refresh();
      toastSuccess("Post Bookmarked", {
        description: "Post has been added to your bookmarks",
      });
    } catch {
      toastError("Unable to Bookmark Post", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnbookmark = async () => {
    setIsLoading(true);
    try {
      await unbookmarkPost(postId);
      setIsBookmarked(false);
      router.refresh();
      toastSuccess("Bookmark Removed", {
        description: "Post has been removed from your bookmarks",
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
                variant="ghost"
                icon={<BookmarkCheck className="text-yellow-500 h-5 w-5" />}
                onClick={() => setShowUnbookmarkConfirm(true)}
                disabled={isLoading}
              >
                Bookmarked
              </ActionButton>
              <ConfirmDialog
                open={showUnbookmarkConfirm}
                onOpenChange={setShowUnbookmarkConfirm}
                title="Remove Bookmark"
                description="Are you sure you want to remove this post from your bookmarks?"
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
              variant="ghost"
              icon={<BookmarkPlus className="h-5 w-5" />}
              onClick={handleBookmark}
              disabled={isLoading}
            >
              Bookmark
            </ActionButton>
          )}
    </div>
  );
}
