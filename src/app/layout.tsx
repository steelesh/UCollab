import React from 'react';
import Navbar from '@components/navbar';
import Footer from '@components/footer';
import { ThemeProvider } from 'next-themes';
import '~/app/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { Metadata } from "next";

// Define metadata with favicon links
export const metadata: Metadata = {
  title: "UCollab",
  description: "A platform for IT and CS students to collaborate on projects",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* Explicitly include favicon links */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="UCollab" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`bg-background flex min-h-screen flex-col antialiased`}>
        <SessionProvider basePath="/auth">
          <ThemeProvider>
            <Navbar />
            <main className="relative flex h-0 flex-grow overflow-hidden">{children}</main>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
