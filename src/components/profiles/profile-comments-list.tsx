"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import type { Comment } from "~/features/users/user.types";

import { CommentContent } from "~/components/comments/comment-content";

type ProfileCommentsListProps = {
  readonly comments: Comment[];
};

export function ProfileCommentsList({ comments }: ProfileCommentsListProps) {
  return (
    <>
      {comments.length === 0
        ? (
            <p className="text-accent-content pt-2 text-sm">No comments available.</p>
          )
        : (
            <ul className="space-y-4 py-4">
              {comments.map(comment => (
                <li key={comment.id} className="group bg-muted rounded-lg">
                  <Link
                    href={`/p/${comment.postId}#comment-${comment.id}`}
                    className="block rounded-lg p-4 transition-colors"
                  >
                    <CommentContent content={comment.content} className="line-clamp-2 hover:underline text-sm font-medium" />
                    <div className="text-muted-foreground flex items-center gap-2 text-xs -mt-0.5">
                      <span>
                        on
                        {" "}
                        {comment.post.title}
                      </span>
                      <span>•</span>
                      <time>
                        {formatDistanceToNow(new Date(comment.createdDate))}
                        {" "}
                        ago
                      </time>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
    </>
  );
}
