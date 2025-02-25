'use client';

import { useTransition } from 'react';

interface Props {
  commentId: string;
  deleteAction: (commentId: string) => Promise<void>;
}

export default function DeleteCommentButton({ commentId, deleteAction }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteAction(commentId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      className="btn btn-ghost btn-sm"
      disabled={isPending}
    >
      Delete
    </button>
  );
}
