import { User } from '@prisma/client';
import { Comment } from '~/features/projects/project.types';
import Link from 'next/link';
import type { Route } from 'next';
import { CommentTimestamp } from './comment-timestamp';

export function CommentHeader({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  isReply = false,
}: {
  comment: Comment;
  currentUserId: User['id'];
  onEdit: () => void;
  onDelete: () => void;
  onReply?: () => void;
  isReply?: boolean;
}) {
  const isOwnComment = comment.createdBy.id === currentUserId;

  const handleDelete = () => {
    const message = isReply
      ? 'Are you sure you want to delete this reply?'
      : 'Are you sure you want to delete this comment?' +
        (comment.replies?.length ? ' This will also delete all replies.' : '');

    if (window.confirm(message)) {
      onDelete();
    }
  };

  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {comment.createdBy.avatar && (
          <img
            src={comment.createdBy.avatar}
            alt={comment.createdBy.username}
            className="h-8 w-8 rounded-full object-cover"
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
          <button onClick={onReply} className="btn btn-xs">
            Reply
          </button>
        )}
        {isOwnComment && (
          <>
            <button onClick={onEdit} className="btn btn-xs">
              Edit
            </button>
            <button onClick={handleDelete} className="btn btn-xs text-red-600">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
