'use client';

import { useState } from 'react';
import { Button } from '../../ui/button';
import { Spinner } from '../../ui/spinner';
import { signOut } from 'next-auth/react';

export function LogOutButton() {
  const [isPending, setIsPending] = useState(false);

  const handleLogOut = async () => {
    setIsPending(true);
    try {
      await signOut();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button variant="destructive" onClick={handleLogOut} disabled={isPending} className="w-full sm:w-[100px]">
      {isPending ? (
        <span className="flex items-center gap-2">
          <Spinner className="h-4 w-4" />
          <span>Loading</span>
        </span>
      ) : (
        'Log out'
      )}
    </Button>
  );
}
