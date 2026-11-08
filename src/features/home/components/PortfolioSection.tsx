import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { PublicPortfolioDTO } from "@/lib/public-content";
import { toPortfolioTeasers } from "@/lib/live-content-adapters";

type CategoryFilter = "all" | "webapp" | "website" | "mobile";

const FILTER_TABS: { label: string; value: CategoryFilter }[] = [
  { label: "Semua Proyek", value: "all" },
  { label: "Aplikasi Web & Dasbor", value: "webapp" },
  { label: "Website Bisnis", value: "website" },
  { label: "Aplikasi Mobile", value: "mobile" },
];

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
        <ScrollReveal priority className="text-center max-w-[740px] mx-auto">
          <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.24em] text-[#005090] dark:text-[#0986C8]">
            STUDI KASUS &amp; KONSEP SOLUSI
          </p>
          <h2 className="mt-3 text-[26px] sm:text-[34px] lg:text-[38px] font-extrabold leading-[1.18] tracking-[-0.02em] text-[#041E42] dark:text-white">
            Portofolio rekayasa{" "}
            <span className="text-[#005090] dark:text-[#0986C8]">solusi digital</span> dan{" "}
            <span className="text-[#005090] dark:text-[#0986C8]">dampak nyata</span>
          </h2>
          <p className="mx-auto mt-3.5 max-w-[660px] text-[13.5px] sm:text-[14.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
            Gambaran implementasi arsitektur sistem, aplikasi web, dan mobile yang tim kami
            rancang untuk memecahkan kendala operasional klien secara terukur.
          </p>

          <div
            role="group"
            aria-label="Filter kategori portofolio"
            className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
          >
            {FILTER_TABS.map((tab) => (
              <React.Fragment key={tab.value}>
                <input
                  type="radio"
                  name="portfolio-filter"
                  id={`portfolio-filter-${tab.value}`}
                  value={tab.value}
                  defaultChecked={tab.value === "all"}
                  className="peer sr-only"
                />
                <label
                  htmlFor={`portfolio-filter-${tab.value}`}
                  className="min-h-11 cursor-pointer rounded-full border border-[#E2E8F0] bg-white px-4.5 py-2 text-xs font-semibold text-[#4A5D78] transition-all duration-200 hover:border-[#005090] hover:text-[#005090] active:scale-95 peer-checked:border-[#005090] peer-checked:bg-[#005090] peer-checked:text-white peer-checked:shadow-[0_6px_18px_-3px_rgba(0,80,144,0.4)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#005090] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 sm:text-[13px]"
                >
                  {tab.label}
                </label>
              </React.Fragment>
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-10 sm:mt-12 grid gap-6 lg:gap-7 md:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO_TEASERS.map((item, idx) => {
            const image = resolvePortfolioImage(item.image);
            return (
            <div
              key={item.id}
              data-portfolio-item
              data-category={item.categorySlug}
              data-nk-reveal="up"
              style={idx > 0 ? { animationDelay: `${Math.min(idx, 5) * 60}ms` } : undefined}
              className="h-full"
            >
              <article className="h-full flex flex-col overflow-hidden rounded-[26px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-[0_14px_38px_-10px_rgba(10,35,80,0.07)] transition-all duration-300 hover:-translate-y-2 hover:border-[#005090] dark:hover:border-blue-500 hover:shadow-[0_24px_50px_-12px_rgba(0,80,144,0.18)] group">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-[#E2E8F0] dark:border-slate-800">
                  {image && (
                    <img
                      src={image.src}
                      srcSet={image.srcSet}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      width={800}
                      height={500}
                      alt={item.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#005090] dark:text-[#0986C8]">
                    {item.clientSector}
                  </p>

                  <h3 className="mt-1.5 text-[17px] sm:text-[18px] font-extrabold tracking-[-0.015em] text-[#041E42] dark:text-white leading-snug transition-colors duration-200 group-hover:text-[#005090] dark:group-hover:text-[#0986C8]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] sm:text-[13.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
                    {item.description}
                  </p>
                </div>
              </article>
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
