"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Spinner } from "../../ui/spinner";

export function SignOutButton() {
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);
    try {
      await signOut({ callbackUrl: "/" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      className="cursor-pointer"
      onClick={handleSignOut}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Spinner />
          Signing out...
        </>
      ) : (
        "Sign out"
      )}
    </Button>
  );
}