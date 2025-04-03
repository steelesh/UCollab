"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";

export function SignOutButton() {
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
    <Button variant="destructive" onClick={handleSignOut} disabled={isPending}>
      {isPending
        ? (
            <>
              <Spinner />
              Signing out...
            </>
          )
        : (
            "Sign out"
          )}
    </Button>
  );
}
