import type { User } from "@prisma/client";
import type { Route } from "next";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Comment } from "~/features/projects/project.types";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import { CommentTimestamp } from "./comment-timestamp";

export function CommentHeader({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  isReply = false,
}: {
  comment: Comment;
  currentUserId: User["id"];
  onEdit: () => void;
  onDelete: () => void;
  onReply?: () => void;
  isReply?: boolean;
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
            <Button onClick={onReply} size="sm" variant="outline" className="w-full cursor-pointer sm:w-auto">
              Reply
            </Button>
          )}
          {isOwnComment && (
            <>
              <Button onClick={onEdit} variant="outline" className="w-full cursor-pointer sm:w-auto">
                Edit
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="outline"
                className="hover:bg-primary w-full cursor-pointer sm:w-auto"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete
              {isReply ? "Reply" : "Comment"}
            </DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
