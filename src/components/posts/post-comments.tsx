"use client";

import type { Post, User } from "@prisma/client";

import { useState } from "react";

import type { Comment } from "~/features/posts/post.types";

import { createComment, createReply, deleteComment, updateComment } from "~/features/comments/comment.actions";

import { CommentForm } from "../comments/comment-form";
import { CommentList } from "../comments/comment-list";

type PostCommentsProps = {
  readonly comments: Comment[];
  readonly currentUserId: User["id"];
  readonly postId: Post["id"];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalCount: number;
  readonly limit: number;
};

export function PostComments({
  comments,
  currentUserId,
  postId,
  currentPage,
  totalPages,
  totalCount,
  limit,
}: PostCommentsProps) {
  const [commentsState, setCommentsState] = useState<Comment[]>(comments);

  const handleCreate = async (content: Comment["content"]) => {
    try {
      const newComment = await createComment(postId, content);
      setCommentsState(prev => [newComment, ...prev]);
    } catch {
      // TODO: handle error, show toast or something
    }
  };

  const handleUpdate = async (commentId: Comment["id"], content: Comment["content"]) => {
    try {
      await updateComment(commentId, content, postId);
      setCommentsState(prev =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              content,
              lastModifiedDate: new Date(),
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId
                  ? {
                      ...reply,
                      content,
                      lastModifiedDate: new Date(),
                    }
                  : reply,
              ),
            };
          }
          return comment;
        }),
      );
    } catch {
      // TODO: handle error, show toast or something
    }
  };

  const handleDelete = async (commentId: Comment["id"]) => {
    try {
      await deleteComment(commentId, postId);
      setCommentsState(prev =>
        prev
          .map(comment => ({
            ...comment,
            replies: comment.replies?.filter(reply => reply.id !== commentId),
          }))
          .filter(comment => comment.id !== commentId),
      );
    } catch {
      // TODO: handle error, show toast or something
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    try {
      const newReply = await createReply(postId, parentId, content);
      setCommentsState(prev =>
        prev.map(comment =>
          comment.id === parentId
            ? {
                ...comment,
                replies: [...(comment.replies ?? []), newReply],
              }
            : comment,
        ),
      );
    } catch {
      // TODO: handle error, show toast or something
    }
  };

  return (
    <div className="mt-8 space-y-8">
      <div className="border-b pb-6">
        <CommentForm postId={postId} currentUserId={currentUserId} onSubmit={handleCreate} />
      </div>
      <CommentList
        comments={commentsState}
        currentUserId={currentUserId}
        postId={postId}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        limit={limit}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onReply={handleReply}
      />
    </div>
  );
}
