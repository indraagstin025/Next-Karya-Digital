"use client";

import React, { useSyncExternalStore } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const THEME_KEY = "nk-theme-preference";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

const getSnapshot = () => localStorage.getItem(THEME_KEY) === "dark";
const getServerSnapshot = () => false;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      id="nk-site"
      className={`site-wrap min-h-screen flex flex-col ${isDark ? "theme-dark" : ""}`}
      suppressHydrationWarning
    >
      <Navbar />
      <main className="flex-1 pt-[68px] lg:pt-[76px]">{children}</main>
      <Footer />
    </div>
  );
}
