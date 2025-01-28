"use client";

import { User } from "@prisma/client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Spinner } from "../../ui/spinner";

export function ImpersonateButton({ userId }: { userId: User["id"] }) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    try {
      await signIn("credentials", { userId });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="default"
      size="sm"
      className="cursor-pointer"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Spinner />
          Impersonating...
        </>
      ) : (
        "Impersonate"
      )}
    </Button>
  );
}
