"use client";

import type { Post, User } from "@prisma/client";

import { useState } from "react";

import type { Comment } from "~/features/posts/post.types";

import { CommentContent } from "./comment-content";
import { CommentForm } from "./comment-form";
import { CommentHeader } from "./comment-header";

type CommentListProps = {
  comments: Comment[];
  currentUserId: User["id"];
  postId: Post["id"];
  onUpdate: (commentId: Comment["id"], content: Comment["content"]) => Promise<void>;
  onDelete: (commentId: Comment["id"]) => Promise<void>;
  onReply: (parentId: Comment["id"], content: Comment["content"]) => Promise<void>;
};

export function CommentList({ comments, currentUserId, postId, onUpdate, onDelete, onReply }: CommentListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const handleUpdate = async (comment: Comment, newContent: string, hasChanged: boolean) => {
    if (hasChanged) {
      await onUpdate(comment.id, newContent);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <div key={comment.id} className="bg-background space-y-4 rounded-lg p-4">
          <div className="border-b pb-4">
            <CommentHeader
              comment={comment}
              currentUserId={currentUserId}
              onEdit={() => setEditingId(comment.id)}
              onDelete={() => onDelete(comment.id)}
              onReply={() => setReplyingToId(comment.id)}
            />

            {editingId === comment.id
              ? (
                  <CommentForm
                    postId={postId}
                    currentUserId={currentUserId}
                    initialContent={comment.content}
                    isEditing={true}
                    onSubmit={async (content, hasChanged) => {
                      await handleUpdate(comment, content, hasChanged);
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                )
              : (
                  <div className="mt-2 space-y-2">
                    <CommentContent content={comment.content} />
                  </div>
                )}
          </div>

          {replyingToId === comment.id && (
            <div className="ml-8">
              <CommentForm
                postId={postId}
                currentUserId={currentUserId}
                onSubmit={async (content) => {
                  await onReply(comment.id, content);
                  setReplyingToId(null);
                }}
                onCancel={() => setReplyingToId(null)}
              />
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-8 space-y-4 border-l pl-4">
              {comment.replies.map(reply => (
                <div key={reply.id} className="border-b pb-4">
                  <CommentHeader
                    comment={reply}
                    currentUserId={currentUserId}
                    onEdit={() => setEditingId(reply.id)}
                    onDelete={() => onDelete(reply.id)}
                    isReply={true}
                  />
                  {editingId === reply.id
                    ? (
                        <CommentForm
                          postId={postId}
                          currentUserId={currentUserId}
                          initialContent={reply.content}
                          isEditing={true}
                          onSubmit={async (content, hasChanged) => {
                            await handleUpdate(reply, content, hasChanged);
                          }}
                          onCancel={() => setEditingId(null)}
                        />
                      )
                    : (
                        <div className="mt-2 space-y-2">
                          <CommentContent content={reply.content} />
                        </div>
                      )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
