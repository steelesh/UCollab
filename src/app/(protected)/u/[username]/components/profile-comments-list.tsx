'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Comment } from '~/features/users/user.types';

interface ProfileCommentsListProps {
  comments: Comment[];
}

export function ProfileCommentsList({ comments }: ProfileCommentsListProps) {
  const parseContent = (content: string) => {
    return content
      .replace(/<p>(.*?)<\/p>/g, '$1')
      .replace(
        /<span data-type="mention" class="tiptap-mention" data-id="([^"]*)" data-label="([^"]*)">([^<]*)<\/span>/g,
        '<span class="font-semibold text-primary">@$2</span>',
      )
      .trim();
  };

  return (
    <>
      {comments.length === 0 ? (
        <p className="text-accent-content pt-2 text-sm">No comments available.</p>
      ) : (
        <ul className="space-y-4 py-4">
          {comments.map((comment) => (
            <li key={comment.id} className="group">
              <Link
                href={`/p/${comment.projectId}#comment-${comment.id}`}
                className="bg-base-200/50 hover:bg-base-200 block rounded-lg p-4 transition-colors">
                <div
                  className="line-clamp-2 text-sm"
                  dangerouslySetInnerHTML={{ __html: parseContent(comment.content) }}
                />
                <div className="text-base-content/60 mt-2 flex items-center gap-2 text-xs">
                  <span>on {comment.project.title}</span>
                  <span>•</span>
                  <time>{formatDistanceToNow(new Date(comment.createdDate))} ago</time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
