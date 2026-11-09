"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  SectionHeaderTypewriter,
  ServiceCardSlide,
} from "@/components/ui/ScrollTypewriter";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import type { PublicPortfolioDTO } from "@/lib/public-content";
import { toPortfolioTeasers } from "@/lib/live-content-adapters";

type CategoryFilter = "all" | "webapp" | "website" | "mobile";

const FILTER_TABS: { label: string; value: CategoryFilter }[] = [
  { label: "Semua Proyek", value: "all" },
  { label: "Aplikasi Web & Dasbor", value: "webapp" },
  { label: "Website Bisnis", value: "website" },
  { label: "Aplikasi Mobile", value: "mobile" },
];

const CATEGORY_LABEL_MAP: Record<string, string> = {
  webapp: "APLIKASI WEB & DASBOR",
  website: "WEBSITE BISNIS",
  mobile: "APLIKASI MOBILE",
};

function resolvePortfolioImage(image: string | null | undefined) {
  if (!image) return null;

  if (/^\/portfolio\/.+\.jpe?g$/i.test(image)) {
    const base = image.replace(/\.jpe?g$/i, "");
    return {
      src: `${base}-800.webp`,
      srcSet: `${base}-480.webp 480w, ${base}-800.webp 800w`,
    };
  }

  return { src: image, srcSet: undefined };
}

export function PortfolioSection({
  portfolios,
}: {
  portfolios?: PublicPortfolioDTO[] | null;
}) {
  const PORTFOLIO_TEASERS = toPortfolioTeasers(portfolios);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const { refresh } = useSmoothScroll();

  useEffect(() => {
    refresh();
  }, [activeCategory, refresh]);

  const filteredItems =
    activeCategory === "all"
      ? PORTFOLIO_TEASERS
      : PORTFOLIO_TEASERS.filter((item) => item.categorySlug === activeCategory);

  return (
    <section
      id="portofolio"
      data-portfolio-filter
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#EFF6FB] via-[#F8FAFC] to-[#FFFFFF] dark:from-[#030711] dark:via-[#061231] dark:to-[#08183A] py-16 sm:py-20 lg:py-24 border-t border-[#E2E8F0] dark:border-blue-900/30"
    >
      <svg
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[180px] w-[180px] sm:h-[230px] sm:w-[230px] -z-10"
      >
        <circle
          cx="15"
          cy="15"
          r="135"
          fill="#005090"
          fillOpacity="0.05"
          className="dark:opacity-15"
        />
        <circle
          cx="15"
          cy="15"
          r="164"
          stroke="#005090"
          strokeOpacity="0.25"
          strokeWidth="1.3"
        />
        <circle cx="144.2" cy="116" r="5.5" fill="#0986C8" />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14">
        <SectionHeaderTypewriter
          eyebrow="STUDI KASUS & KONSEP SOLUSI"
          line1="Portofolio rekayasa solusi digital"
          line2Accent="dan dampak nyata"
          description="Gambaran implementasi arsitektur sistem, aplikasi web, dan mobile yang tim kami rancang untuk memecahkan kendala operasional klien secara terukur."
          charsPerSecond={68}
        />

        <ScrollReveal className="mt-8">
          <div
            role="group"
            aria-label="Filter kategori portofolio"
            className="flex flex-wrap items-center justify-center gap-2.5"
          >
            {FILTER_TABS.map((tab) => {
              const selected = activeCategory === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveCategory(tab.value)}
                  className={`min-h-11 cursor-pointer rounded-full px-4.5 py-2 text-xs sm:text-[13px] font-semibold transition-all duration-200 active:scale-95 ${
                    selected
                      ? "border border-[#005090] bg-[#005090] text-white shadow-[0_6px_18px_-3px_rgba(0,80,144,0.4)]"
                      : "border border-[#E2E8F0] bg-white text-[#4A5D78] hover:border-[#005090] hover:text-[#005090] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Daftar Portofolio Persegi Panjang Zig-Zag sesuai sketsa */}
        <div className="mt-12 sm:mt-14 flex flex-col gap-8 sm:gap-10 lg:gap-12">
          {filteredItems.map((item, idx) => {
            const image = resolvePortfolioImage(item.image);
            // Baris genap (0, 2, 4): Card di kiri, Foto di sisi kiri (lebar) & Teks di sisi kanan
            // Baris ganjil (1, 3, 5): Card di kanan, Teks di sisi kiri & Foto di sisi kanan (lebar)
            const isEven = idx % 2 === 0;
            const stepNumber = String(idx + 1).padStart(2, "0");
            const categoryLabel =
              CATEGORY_LABEL_MAP[item.categorySlug] ?? "SOLUSI DIGITAL";

            return (
              <div
                key={`${activeCategory}-${item.id}`}
                data-portfolio-item
                data-category={item.categorySlug}
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
                      {image && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={image.src}
                          srcSet={image.srcSet}
                          sizes="(max-width: 768px) 100vw, 55vw"
                          width={800}
                          height={500}
                          alt={item.imageAlt}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover scale-110 group-data-[slide-visible=true]/slide:scale-100 transition-transform duration-900 ease-out group-hover:scale-105"
                        />
                      )}
                      {/* Overlay gradien halus di sudut foto */}
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

                        <h3 className="mt-2.5 text-[19px] sm:text-[21px] lg:text-[23px] font-extrabold tracking-[-0.015em] text-[#041E42] dark:text-white leading-snug transition-colors duration-200 group-hover:text-[#005090] dark:group-hover:text-[#38BDF8]">
                          <Link
                            href={`/portofolio/${item.id}`}
                            className="after:absolute after:inset-0 after:content-['']"
                          >
                            {item.title}
                          </Link>
                        </h3>

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

        <ScrollReveal delayMs={150} className="mt-12 text-center">
          <Link
            href="/portofolio"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[#005090] bg-white px-6 py-3 text-[13.5px] font-bold text-[#005090] shadow-sm transition-all duration-200 hover:bg-[#005090] hover:text-white hover:-translate-y-0.5 active:scale-[0.98] dark:bg-slate-900 dark:text-[#0986C8] dark:hover:bg-[#005090] dark:hover:text-white"
          >
            <span>Eksplorasi Seluruh Studi Kasus</span>
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

