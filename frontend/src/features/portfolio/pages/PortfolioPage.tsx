"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { PublicPortfolioDTO } from "@/lib/public-content";
import { PortfolioHero } from "../components/PortfolioHero";
import { PortfolioCaseStudies } from "../components/PortfolioCaseStudies";
import { PortfolioCtaBanner } from "../components/PortfolioCtaBanner";

export function PortfolioPage({
  portfolios,
}: {
  portfolios?: PublicPortfolioDTO[] | null;
}) {
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
        <PortfolioHero />

        <section className="relative isolate overflow-hidden bg-[#F8FAFC] dark:bg-[#030711] py-16 sm:py-20">
          <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14">
            <PortfolioCaseStudies portfolios={portfolios} />
            <PortfolioCtaBanner />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
