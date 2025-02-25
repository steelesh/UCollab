'use client';

import { useState } from 'react';

interface DeleteCommentButtonProps {
  commentId: string;
  onDelete: (commentId: string) => Promise<void>;
}

export default function DeleteCommentButton({ commentId, onDelete }: DeleteCommentButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      className="ml-auto text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
      onClick={handleClick}
      disabled={isDeleting}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
