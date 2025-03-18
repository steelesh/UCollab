'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { InteractiveHoverButton } from '../magicui/interactive-hover-button';

export function SignInButton() {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    try {
      await signIn('microsoft-entra-id', { redirectTo: '/onboarding' });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <InteractiveHoverButton onClick={handleClick} className="cursor-pointer pr-8 sm:w-auto">
      {isPending ? <>Signing in...</> : <>Sign in</>}
    </InteractiveHoverButton>
  );
}
