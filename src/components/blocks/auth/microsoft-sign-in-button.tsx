"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { LogosMicrosoftIcon } from "../../ui/microsoft-brand-icon";
import { Spinner } from "../../ui/spinner";

export function MicrosoftSignInButton() {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    try {
      await signIn("microsoft-entra-id", { redirectTo: "/onboarding" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="w-full cursor-pointer sm:w-auto"
    >
      {isPending ? (
        <>
          <Spinner />
          Signing in...
        </>
      ) : (
        <>
          <LogosMicrosoftIcon className="mr-2 h-4 w-4" />
          Sign in with Microsoft
        </>
      )}
    </Button>
  );
}
