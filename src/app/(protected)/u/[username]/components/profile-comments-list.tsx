import type { Comment } from '~/features/users/user.types';

interface ProfileCommentsListProps {
  comments: Comment[];
}

export function ProfileCommentsList({ comments }: ProfileCommentsListProps) {
  return (
    <>
      {comments.length === 0 ? (
        <p className="text-accent-content pt-2 text-sm">No comments available.</p>
      ) : (
        <ul className="list-item py-4 pl-5 text-sm">
          {comments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      )}
    </>
  );
}
