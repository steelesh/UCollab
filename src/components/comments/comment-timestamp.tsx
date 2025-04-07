import { formatDistanceToNow } from "date-fns";

import type { Comment } from "~/features/posts/post.types";

export function CommentTimestamp({ comment }: { readonly comment: Comment }) {
  const isEdited = comment.lastModifiedDate && comment.lastModifiedDate > comment.createdDate;

  return (
    <span className="text-muted-foreground text-sm">
      {formatDistanceToNow(new Date(comment.createdDate), { addSuffix: true })}
      {isEdited && <span className="ml-2 text-xs">(edited)</span>}
    </span>
  );
}
