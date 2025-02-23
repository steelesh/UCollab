'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function SignOutButton() {
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);
    try {
      await signOut();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button className="btn btn-primary-content select-none" onClick={handleSignOut} disabled={isPending}>
      {isPending ? (
        <span className="loading loading-spinner loading-md"></span>
      ) : (
        <div className="flex items-center gap-1">
          <div>Sign Out</div>
        </div>
      )}
    </button>
  );
}
