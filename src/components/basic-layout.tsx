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
    <div className={`${GeistSans.className} flex min-h-[100svh] flex-col`}>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
