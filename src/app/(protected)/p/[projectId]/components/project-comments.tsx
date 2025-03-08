'use client';

import { useState } from 'react';
import { Comment } from '~/features/projects/project.types';
import { CommentList } from './comment-list';
import { CommentForm } from './comment-form';
import { createComment, updateComment, deleteComment, createReply } from '~/features/comments/comment.actions';
import { User, Project } from '@prisma/client';

interface ProjectCommentsProps {
  comments: Comment[];
  currentUserId: User['id'];
  projectId: Project['id'];
}

export function ProjectComments({ comments: initialComments, currentUserId, projectId }: ProjectCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const handleCreate = async (content: Comment['content']) => {
    try {
      const newComment = await createComment(projectId, content);
      setComments((prev) => [newComment, ...prev]);
    } catch {
      // TODO: handle error, show toast or something
    }
  };

  const handleUpdate = async (commentId: Comment['id'], content: Comment['content']) => {
    try {
      await updateComment(commentId, content, projectId);
      setComments((prev) =>
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
              replies: comment.replies.map((reply) =>
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

  const handleDelete = async (commentId: Comment['id']) => {
    try {
      await deleteComment(commentId, projectId);
      setComments((prev) =>
        prev
          .map((comment) => ({
            ...comment,
            replies: comment.replies?.filter((reply) => reply.id !== commentId),
          }))
          .filter((comment) => comment.id !== commentId),
      );
    } catch {
      // TODO: handle error, show toast or something
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    try {
      const newReply = await createReply(projectId, parentId, content);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), newReply],
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
        <h3 className="mb-4 text-lg font-semibold">Comments</h3>
        <CommentForm projectId={projectId} currentUserId={currentUserId} onSubmit={handleCreate} />
      </div>
      <CommentList
        comments={comments}
        currentUserId={currentUserId}
        projectId={projectId}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onReply={handleReply}
      />
    </div>
  );
}
