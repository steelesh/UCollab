'use client';

import { SignInButton } from './signin-button';
import { useSession } from 'next-auth/react';

export function SignInWrapper() {
  const { data: session } = useSession();
  return <>{session ? null : <SignInButton />}</>;
}
