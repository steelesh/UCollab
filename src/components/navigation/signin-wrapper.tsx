"use client";

import { useSession } from "next-auth/react";

import { SignInButton } from "./signin-button";

export function SignInWrapper() {
  const { data: session } = useSession();
  return <>{session ? null : <SignInButton />}</>;
}
