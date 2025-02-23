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
      {isPending ? (
        <span className="loading loading-spinner loading-md"></span>
      ) : (
        <div className="flex gap-1 align-middle">
          <div>Sign In</div>
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={1.5}>
              <path strokeLinejoin="round" d="M2.001 11.999h14m0 0l-3.5-3m3.5 3l-3.5 3"></path>
              <path d="M9.002 7c.012-2.175.109-3.353.877-4.121C10.758 2 12.172 2 15 2h1c2.829 0 4.243 0 5.122.879C22 3.757 22 5.172 22 8v8c0 2.828 0 4.243-.878 5.121C20.242 22 18.829 22 16 22h-1c-2.828 0-4.242 0-5.121-.879c-.768-.768-.865-1.946-.877-4.121"></path>
            </g>
          </svg>
        </div>
      )}
    </button>
  );
}
