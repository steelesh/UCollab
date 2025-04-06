import type { Metadata } from "next";

import { SessionProvider } from "next-auth/react";

import "~/app/globals.css";

import "devicon/devicon.min.css";
import React from "react";

import Footer from "~/components/navigation/footer";
import Navbar from "~/components/navigation/navbar";
import { Body } from "~/components/ui/body";
import { Main } from "~/components/ui/main";
import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { roboto } from "~/lib/fonts";

export const metadata: Metadata = {
  title: "UCollab",
  description: "A platform for IT and CS students to collaborate on projects",
  manifest: "/meta/site.webmanifest",
  icons: {
    icon: "/meta/favicon.svg",
    apple: "/meta/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${roboto.variable}`} suppressHydrationWarning>
      <Body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider basePath="/auth">
            <Navbar />
            <Main>{children}</Main>
            <Toaster />
          </SessionProvider>
          <Footer />
        </ThemeProvider>
      </Body>
    </html>
  );
}
