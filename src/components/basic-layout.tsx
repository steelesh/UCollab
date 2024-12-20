import React from "react";
import { GeistSans } from "geist/font/sans";
import Navbar from "@components/navbar";
import Footer from "@components/footer";

export default function BasicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${GeistSans.className} flex min-h-screen flex-col`}>
      <Navbar />
      <main className="relative flex h-0 flex-grow overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}
