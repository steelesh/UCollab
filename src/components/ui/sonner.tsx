"use client";

import type { ToasterProps } from "sonner";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton
      toastOptions={{
        classNames: {
          toast: "group p-4 text-base border shadow-md bg-background",
          title: "font-medium text-base",
          description: "text-sm mt-1",
          actionButton: "bg-primary",
          cancelButton: "bg-muted",
          closeButton: "text-foreground/50 hover:text-foreground",
          success: "!bg-background",
          error: "!bg-background",
          info: "!bg-background",
          warning: "!bg-background",
        },
      }}
      style={
        {
          "--normal-bg": "hsl(var(--background))",
          "--normal-text": "hsl(var(--foreground))",
          "--normal-border": "hsl(var(--border))",
          "--toast-width": "380px",
          "--font-size": "1rem",
          "--z-index": "100",
          "--toast-bg-opacity": "1",
          "--success-bg": "hsl(var(--background))",
          "--error-bg": "hsl(var(--background))",
          "--info-bg": "hsl(var(--background))",
          "--warning-bg": "hsl(var(--background))",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
