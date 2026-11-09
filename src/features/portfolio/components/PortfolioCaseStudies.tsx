"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ServiceCardSlide } from "@/components/ui/ScrollTypewriter";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import type { PublicPortfolioDTO } from "@/lib/public-content";
import { toPortfolioCases } from "@/lib/live-content-adapters";

type CategoryFilter = "all" | "webapp" | "website" | "mobile";

const CATEGORY_LABEL_MAP: Record<string, string> = {
  webapp: "APLIKASI WEB & DASBOR",
  website: "WEBSITE BISNIS",
  mobile: "APLIKASI MOBILE",
};

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
          className="mb-12 flex flex-wrap items-center justify-center gap-2.5"
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

      {/* Daftar Portofolio Persegi Panjang Zig-Zag sesuai sketsa */}
      <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
        {filteredItems.map((item, idx) => {
          const isEven = idx % 2 === 0;
          const stepNumber = String(idx + 1).padStart(2, "0");
          const categoryLabel =
            CATEGORY_LABEL_MAP[item.categorySlug] ?? "SOLUSI DIGITAL";

          return (
            <div
              key={`${activeCategory}-${item.id}`}
              className={`w-full lg:w-[88%] xl:w-[85%] ${
                isEven ? "lg:mr-auto" : "lg:ml-auto"
              }`}
            >
              <ServiceCardSlide
                side={isEven ? "left" : "right"}
                delayMs={(idx % 2) * 80}
              >
                <article className="group relative flex flex-col md:flex-row items-stretch overflow-hidden rounded-[24px] sm:rounded-[28px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-[0_16px_42px_-12px_rgba(10,35,80,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#005090] dark:hover:border-blue-500 hover:shadow-[0_24px_52px_-12px_rgba(0,80,144,0.18)]">
                  {/* Panel Foto / Visual (Lebar ~58% - Kiri pada kartu genap, Kanan pada kartu ganjil) */}
                  <div
                    className={`relative aspect-[16/10] md:aspect-auto md:min-h-[275px] lg:min-h-[310px] w-full md:w-[58%] lg:w-[60%] shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 border-b md:border-b-0 border-[#E2E8F0] dark:border-slate-800 transition-all duration-700 delay-75 ease-out ${
                      isEven
                        ? "md:order-1 md:border-r -translate-x-6 opacity-0 group-data-[slide-visible=true]/slide:translate-x-0 group-data-[slide-visible=true]/slide:opacity-100"
                        : "md:order-2 md:border-l translate-x-6 opacity-0 group-data-[slide-visible=true]/slide:translate-x-0 group-data-[slide-visible=true]/slide:opacity-100"
                    }`}
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className="object-cover scale-110 group-data-[slide-visible=true]/slide:scale-100 transition-transform duration-900 ease-out group-hover:scale-105"
                      />
                    )}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#041E42]/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>

                  {/* Panel Teks Penjelasan (Lebar ~42% - Kanan pada kartu genap, Kiri pada kartu ganjil) */}
                  <div
                    className={`flex flex-1 flex-col justify-between p-6 sm:p-7 lg:p-8 xl:p-9 transition-all duration-700 delay-150 ease-out ${
                      isEven
                        ? "md:order-2 translate-x-6 opacity-0 group-data-[slide-visible=true]/slide:translate-x-0 group-data-[slide-visible=true]/slide:opacity-100"
                        : "md:order-1 -translate-x-6 opacity-0 group-data-[slide-visible=true]/slide:translate-x-0 group-data-[slide-visible=true]/slide:opacity-100"
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#005090] dark:text-[#38BDF8]">
                        <span>
                          {stepNumber} / {categoryLabel}
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-[#CBD5E1] dark:text-slate-700"
                        >
                          •
                        </span>
                        <span className="font-semibold text-[#64748B] dark:text-slate-400">
                          {item.clientSector}
                        </span>
                      </div>

                      <h2 className="mt-2.5 text-[19px] sm:text-[21px] lg:text-[23px] font-extrabold tracking-[-0.015em] text-[#041E42] dark:text-white leading-snug transition-colors duration-200 group-hover:text-[#005090] dark:group-hover:text-[#38BDF8]">
                        <Link
                          href={`/portofolio/${item.slug ?? item.id}`}
                          className="after:absolute after:inset-0 after:content-['']"
                        >
                          {item.title}
                        </Link>
                      </h2>

                      <p className="mt-3 text-[13.5px] sm:text-[14.5px] leading-[1.7] text-[#4A5D78] dark:text-slate-300">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#F1F5F9] dark:border-slate-800/80 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-bold text-[#005090] dark:text-[#38BDF8] transition-colors group-hover:text-[#072146] dark:group-hover:text-white">
                        <span>Lihat Studi Kasus</span>
                        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>

                      <span className="h-2 w-2 rounded-full bg-[#14B8A6] opacity-75 transition-transform duration-300 group-hover:scale-125" />
                    </div>
                  </div>
                </article>
              </ServiceCardSlide>
            </div>
          );
        })}
      </div>
    </div>
  );
}

