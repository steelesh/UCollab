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
    <div className={GeistSans.className}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
