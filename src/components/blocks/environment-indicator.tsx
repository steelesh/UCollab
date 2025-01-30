"use client";

import { env } from "@/src/lib/env";
import { isProdEnv } from "@/src/lib/utils";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useToast } from "../../hooks/use-toast";

export function EnvironmentIndicator() {
  const { theme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    if (isProdEnv()) return;

    const envName = env.NEXT_PUBLIC_DEPLOY_ENV;

    toast({
      title: `Environment: ${envName.toUpperCase()}`,
      description:
        "This indicator only appears in non-production environments.",
      duration: 100000,
    });
  }, [toast, theme]);

  return null;
}
