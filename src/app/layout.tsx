import React from 'react';
import Navbar from '@components/navbar';
import Footer from '@components/footer';
import { ThemeProvider } from 'next-themes';
import '~/app/globals.css';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth`} suppressHydrationWarning>
      <body className={`bg-background flex min-h-screen flex-col antialiased`}>
        <SessionProvider basePath="/auth">
          <ThemeProvider>
            <Navbar />
            <main className="relative flex flex-grow">{children}</main>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
