"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PostBookmark } from "~/components/posts/post-bookmark";
import { ActionButton } from "~/components/ui/action-button";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { deletePost } from "~/features/posts/post.actions";
import { toastError } from "~/lib/toast";

type PostActionsProps = {
  readonly postId: string;
  readonly isOwnPost: boolean;
  readonly isBookmarked: boolean;
};

export function PostActions({ postId, isOwnPost, isBookmarked }: PostActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(postId);
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        return;
      }
      toastError("Failed to Delete Post", {
        description: "An error occurred while deleting your post. Please try again.",
      });

      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isOwnPost) {
    return (
      <>
        <div className="flex gap-2">
          <Link href={`/p/${postId}/edit`}>
            <ActionButton icon={<Edit />}>
              Edit
            </ActionButton>
          </Link>
          <ActionButton
            icon={<Trash2 />}
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
          >
            Delete
          </ActionButton>
        </div>
        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Delete Post"
          description="Are you sure you want to delete this post? This action cannot be undone and will delete all comments and ratings."
          confirmText="Delete Post"
          cancelText="Cancel"
          onConfirm={handleDelete}
        />
      </>
    );
  }

  return (
    <PostBookmark
      postId={postId}
      initialBookmarked={isBookmarked}
    />
  );
}
