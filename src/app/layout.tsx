import React from 'react';
import Navbar from '~/components/navigation/navbar';
import Footer from '~/components/navigation/footer';
import '~/app/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});
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
    <html lang="en" className={`scroll-smooth ${roboto.variable}`} suppressHydrationWarning>
      <body className={`flex min-h-screen flex-col overflow-x-clip`}>
        <SessionProvider basePath="/auth">
          <Navbar />
          <main className="mt-28 grow">{children}</main>
        </SessionProvider>
        <Footer />
      </body>
    </html>
  );
}
