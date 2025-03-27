import type { User } from "@prisma/client";
import type React from "react";

import { OnboardingStep } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "./auth";

export function withAuth<T extends { userId: User["id"] }>(
  Component: (props: T) => Promise<React.ReactElement>,
) {
  return async function AuthComponent(props: Omit<T, "userId">): Promise<React.ReactElement> {
    try {
      const session = await auth();

      if (!session?.user?.id) {
        redirect("/");
      }

      if (session.user.onboardingStep !== OnboardingStep.COMPLETE) {
        redirect("/onboarding");
      }

      return Component({ ...props, userId: session.user.id as User["id"] } as T);
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }
      console.error("Auth error:", error);
      redirect("/");
    }
  };
}

export function withOnboarding<T extends { userId: User["id"] }>(
  Component: (props: T) => Promise<React.ReactElement>,
) {
  return async function OnboardingComponent(props: Omit<T, "userId">): Promise<React.ReactElement> {
    try {
      const session = await auth();
      if (!session?.user?.id) {
        redirect("/");
      }

      if (session.user.onboardingStep === OnboardingStep.COMPLETE) {
        redirect("/");
      }

      return Component({ ...props, userId: session.user.id as User["id"] } as T);
    } catch {
      redirect("/");
    }
  };
}
