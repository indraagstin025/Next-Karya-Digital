"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogHero } from "../components/BlogHero";
import { BlogGrid } from "../components/BlogGrid";
import { BlogCallout } from "../components/BlogCallout";
import type { PublicArticleSummaryDTO } from "@/lib/public-content";

export function BlogPage({ articles }: { articles: PublicArticleSummaryDTO[] | null }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nk-theme-preference");
    if (saved === "dark") {
      setIsDark(true);
    }
  }, []);

  return (
    <div
      id="nk-site"
      className={`site-wrap min-h-screen flex flex-col ${isDark ? "theme-dark" : ""}`}
      suppressHydrationWarning
    >
      <Navbar />

      <main className="flex-1 pt-[68px] lg:pt-[76px]">
        <BlogHero />

        <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F8FBFF] to-[#F3F8FF] dark:from-[#030711] dark:via-[#061231] dark:to-[#091a45] py-16 sm:py-20">
          <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14">
            <BlogGrid articles={articles} />
            <BlogCallout />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
