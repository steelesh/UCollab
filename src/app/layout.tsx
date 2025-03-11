import React from 'react';
import Navbar from '~/components/blocks/nav/navbar';
import { SessionProvider } from 'next-auth/react';
import type { Metadata } from 'next';
import '~/app/globals.css';
import { Container } from '~/components/ui/container';
import { TooltipProvider } from '~/components/ui/tooltip';
import Footer from '~/components/blocks/footer/footer';
import { roboto, robotoMono, robotoSlab } from './fonts';
import { Toaster } from '~/components/ui/sonner';
import { ThemeProvider } from '~/components/blocks/theme-provider';

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
    <html
      lang="en"
      className={`${robotoSlab.variable} ${robotoMono.variable} ${roboto.variable} scroll-smooth`}
      suppressHydrationWarning>
      <body className="bg-background flex min-h-screen w-full flex-col antialiased">
        <SessionProvider>
          <ThemeProvider>
            <TooltipProvider>
              <header className="bg-background sticky top-0 z-50">
                <Navbar />
              </header>
              <main className="bg-background relative z-10 mt-10 mb-[-2rem] min-h-[100vh] flex-1 rounded-b-[2rem] py-16">
                <Container>{children}</Container>
                <Toaster />
              </main>
              <Footer />
            </TooltipProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
