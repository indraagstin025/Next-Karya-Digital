"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { PublicPortfolioDTO } from "@/lib/public-content";
import { toPortfolioCases } from "@/lib/live-content-adapters";

type CategoryFilter = "all" | "webapp" | "website" | "mobile";

export function PortfolioCaseStudies({
  portfolios,
}: {
  portfolios?: PublicPortfolioDTO[] | null;
}) {
  const PORTFOLIO_CASES = toPortfolioCases(portfolios);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const filterTabs: { label: string; value: CategoryFilter }[] = [
    { label: "Semua Proyek", value: "all" },
    { label: "Aplikasi Web & Dasbor", value: "webapp" },
    { label: "Website Bisnis", value: "website" },
    { label: "Aplikasi Mobile", value: "mobile" },
  ];

  const filteredItems =
    activeCategory === "all"
      ? PORTFOLIO_CASES
      : PORTFOLIO_CASES.filter((item) => item.categorySlug === activeCategory);

  return (
    <div>
      <ScrollReveal>
        <div
          role="group"
          aria-label="Filter kategori studi kasus"
          className="mb-10 flex flex-wrap items-center justify-center gap-2.5"
        >
          {filterTabs.map((tab) => {
            const selected = activeCategory === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveCategory(tab.value)}
                className={`min-h-11 rounded-full px-4.5 py-2 text-xs sm:text-[13px] font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                  selected
                    ? "bg-[#005090] text-white shadow-[0_6px_18px_-3px_rgba(0,80,144,0.4)]"
                    : "bg-white text-[#4A5D78] border border-[#E2E8F0] hover:border-[#005090] hover:text-[#005090] dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:border-blue-500"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </ScrollReveal>

      <div className="grid gap-6 lg:gap-7 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, idx) => (
          <ScrollReveal key={`${activeCategory}-${item.id}`} delayMs={idx * 75} className="h-full">
            <article
              className="nk-card-enter h-full flex flex-col justify-between overflow-hidden rounded-[26px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-[0_14px_38px_-10px_rgba(10,35,80,0.07)] transition-all duration-300 hover:-translate-y-2 hover:border-[#005090] dark:hover:border-blue-500 hover:shadow-[0_24px_50px_-12px_rgba(0,80,144,0.18)] group"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-[#E2E8F0] dark:border-slate-800">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  )}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#041E42] text-white px-3 py-1 text-[11px] font-bold shadow-md">
                      {item.icon}
                      <span>{item.category}</span>
                    </span>
                    <span className="rounded-full bg-[#005090] text-white px-3.5 py-1 text-[11px] font-bold shadow-md">
                      {item.metric}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 pb-0 sm:pb-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#005090] dark:text-[#0986C8]">
                    {item.clientSector}
                  </p>

                  <h2 className="mt-1.5 text-[17px] sm:text-[18px] font-extrabold tracking-[-0.015em] text-[#041E42] dark:text-white leading-snug transition-colors duration-200 group-hover:text-[#005090] dark:group-hover:text-[#0986C8]">
                    {item.title}
                  </h2>
                  <p className="mt-2.5 text-[13px] sm:text-[13.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
                    {item.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-semibold text-[#0A2558] dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors group-hover:border-slate-300 dark:group-hover:border-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-5 sm:pt-5 mt-5">
                <div className="rounded-2xl bg-[#FFFFFF] dark:bg-slate-800 p-3.5 text-xs text-[#4A5D78] dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700 leading-relaxed transition-colors duration-300 group-hover:border-[#005090]">
                  <div className="flex items-center gap-1.5 font-extrabold text-[#005090] dark:text-[#0986C8] mb-0.5">
                    <CheckCircledIcon className="h-3.5 w-3.5 shrink-0" />
                    <span>Dampak Bisnis</span>
                  </div>
                  {item.impact}
                </div>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
