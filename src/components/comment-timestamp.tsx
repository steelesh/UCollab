import { Comment } from '~/features/projects/project.types';
import { formatDistanceToNow } from 'date-fns';

export function CommentTimestamp({ comment }: { comment: Comment }) {
  const isEdited = comment.lastModifiedDate && comment.lastModifiedDate > comment.createdDate;

  return (
    <span className="text-muted-foreground text-sm">
      {formatDistanceToNow(new Date(comment.createdDate), { addSuffix: true })}
      {isEdited && <span className="ml-2 text-xs">(edited)</span>}
    </span>
  );
}
