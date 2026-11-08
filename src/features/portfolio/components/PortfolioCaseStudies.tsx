"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
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
  const { refresh } = useSmoothScroll();

  useEffect(() => {
    refresh();
  }, [activeCategory, refresh]);

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
              className="nk-card-enter relative h-full flex flex-col overflow-hidden rounded-[26px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-[0_14px_38px_-10px_rgba(10,35,80,0.07)] transition-all duration-300 hover:-translate-y-2 hover:border-[#005090] dark:hover:border-blue-500 hover:shadow-[0_24px_50px_-12px_rgba(0,80,144,0.18)] group"
            >
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
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#005090] dark:text-[#0986C8]">
                  {item.clientSector}
                </p>

                <h2 className="mt-1.5 text-[17px] sm:text-[18px] font-extrabold tracking-[-0.015em] text-[#041E42] dark:text-white leading-snug transition-colors duration-200 group-hover:text-[#005090] dark:group-hover:text-[#0986C8]">
                  <Link
                    href={`/portofolio/${item.slug ?? item.id}`}
                    className="after:absolute after:inset-0 after:content-['']"
                  >
                    {item.title}
                  </Link>
                </h2>
                <p className="mt-2.5 text-[13px] sm:text-[13.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
