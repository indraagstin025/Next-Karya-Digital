import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="nk-site"
      data-nk-smooth-wrapper
      className="site-wrap min-h-screen flex flex-col"
    >
      <Navbar />
      <main className="flex-1 pt-[68px] lg:pt-[76px]">{children}</main>
      <Footer />
    </div>
  );
}
