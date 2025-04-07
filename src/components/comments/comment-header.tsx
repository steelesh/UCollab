import type { User } from "@prisma/client";
import type { Route } from "next";

import { Edit, Reply, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Comment } from "~/features/posts/post.types";

import { ActionButton } from "~/components/ui/action-button";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";

import { CommentTimestamp } from "./comment-timestamp";

export function CommentHeader({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  isReply = false,
}: {
  readonly comment: Comment;
  readonly currentUserId: User["id"];
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onReply?: () => void;
  readonly isReply?: boolean;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isOwnComment = comment.createdBy.id === currentUserId;

  const message = isReply
    ? "Are you sure you want to delete this reply?"
    : `Are you sure you want to delete this comment?${
      comment.replies?.length ? " This will also delete all replies." : ""}`;

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {comment.createdBy.avatar && (
            <Image
              src={comment.createdBy.avatar}
              alt={comment.createdBy.username}
              className="h-8 w-8 rounded-full object-cover"
              loading="lazy"
              width={32}
              height={32}
            />
          )}
          <div className="flex flex-col">
            <Link href={`/u/${comment.createdBy.username}` as Route} className="font-semibold hover:underline">
              {comment.createdBy.username}
            </Link>
            <CommentTimestamp comment={comment} />
          </div>
        </div>

        <div className="flex gap-2">
          {!isReply && onReply && (
            <ActionButton icon={<Reply />} onClick={onReply}>
              Reply
            </ActionButton>
          )}
          {isOwnComment && (
            <>
              <ActionButton icon={<Edit />} onClick={onEdit}>
                Edit
              </ActionButton>
              <ActionButton
                icon={<Trash2 />}
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete
              </ActionButton>
            </>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChangeAction={setShowDeleteDialog}
        title={`Delete ${isReply ? "Reply" : "Comment"}`}
        description={message}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirmAction={() => {
          onDelete();
          setShowDeleteDialog(false);
        }}
      />
    </>
  );
}
