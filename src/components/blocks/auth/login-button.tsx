'use client';

import { useState } from 'react';
import { Button } from '../../ui/button';
import { Spinner } from '../../ui/spinner';
import { signIn } from 'next-auth/react';

export function LogInButton() {
  const [isPending, setIsPending] = useState(false);

  const handleLogIn = async () => {
    setIsPending(true);
    try {
      await signIn('microsoft-entra-id', { redirectTo: '/onboarding' });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogIn} disabled={isPending} className="w-full sm:w-[100px]">
      {isPending ? (
        <span className="flex items-center gap-2">
          <Spinner className="h-4 w-4" />
          <span>Loading</span>
        </span>
      ) : (
        'Log in'
      )}
    </Button>
  );
}
