'use client';

import { useState } from 'react';
import { Comment } from '~/features/projects/project.types';
import { CommentForm } from './comment-form';
import { Project, User } from '@prisma/client';
import { CommentHeader } from './comment-header';

interface CommentListProps {
  comments: Comment[];
  currentUserId: User['id'];
  projectId: Project['id'];
  onUpdate: (commentId: Comment['id'], content: Comment['content']) => Promise<void>;
  onDelete: (commentId: Comment['id']) => Promise<void>;
  onReply: (parentId: Comment['id'], content: Comment['content']) => Promise<void>;
}

export function CommentList({ comments, currentUserId, projectId, onUpdate, onDelete, onReply }: CommentListProps) {
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
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-4">
          <div className="border-b pb-4">
            <CommentHeader
              comment={comment}
              currentUserId={currentUserId}
              onEdit={() => setEditingId(comment.id)}
              onDelete={() => onDelete(comment.id)}
              onReply={() => setReplyingToId(comment.id)}
            />

            {editingId === comment.id ? (
              <CommentForm
                projectId={projectId}
                currentUserId={currentUserId}
                initialContent={comment.content}
                isEditing={true}
                onSubmit={async (content, hasChanged) => {
                  await handleUpdate(comment, content, hasChanged);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div
                className="comment-content prose prose-sm prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:my-2 prose-blockquote:italic prose-code:bg-gray-100 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-ul:pl-6 prose-ol:pl-6 prose-li:my-0 dark:prose-blockquote:border-gray-600 dark:prose-code:bg-gray-800 mt-2 max-w-none"
                dangerouslySetInnerHTML={{ __html: comment.content }}
              />
            )}
          </div>

          {replyingToId === comment.id && (
            <div className="ml-8">
              <CommentForm
                projectId={projectId}
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
              {comment.replies.map((reply) => (
                <div key={reply.id} className="border-b pb-4">
                  <CommentHeader
                    comment={reply}
                    currentUserId={currentUserId}
                    onEdit={() => setEditingId(reply.id)}
                    onDelete={() => onDelete(reply.id)}
                    isReply={true}
                  />
                  {editingId === reply.id ? (
                    <CommentForm
                      projectId={projectId}
                      currentUserId={currentUserId}
                      initialContent={reply.content}
                      isEditing={true}
                      onSubmit={async (content, hasChanged) => {
                        await handleUpdate(reply, content, hasChanged);
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: reply.content }} />
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
