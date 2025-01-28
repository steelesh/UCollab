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
      await signIn("microsoft-entra-id");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button onClick={handleClick} variant="outline" className="cursor-pointer">
      {isPending ? (
        <>
          <Spinner />
          Signing in...
        </>
      ) : (
        <>
          <LogosMicrosoftIcon className="mr-2 h-4 w-4" />
          Sign in with Microsoft Entra ID
        </>
      )}
    </Button>
  );
}
