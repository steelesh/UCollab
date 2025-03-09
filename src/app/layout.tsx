import React from 'react';
import Navbar from '@components/navbar';
import Footer from '@components/footer';
import { ThemeProvider } from 'next-themes';
import '~/app/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UCollab',
  description: 'A platform for IT and CS students to collaborate on projects',
  manifest: '/meta/site.webmanifest',
  icons: {
    icon: '/meta/favicon.svg',
    apple: '/meta/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth`} suppressHydrationWarning>
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
