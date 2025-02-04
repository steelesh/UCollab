'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInButton() {
  const [isPending, setIsPending] = useState(false);

  const handleSignIn = async () => {
    setIsPending(true);
    try {
      await signIn('microsoft-entra-id');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button className="btn btn-primary-content select-none" onClick={handleSignIn} disabled={isPending}>
      {isPending ? <span className="loading loading-spinner loading-md"></span> : 'Sign in with UC Credentials'}
    </button>
  );
}
