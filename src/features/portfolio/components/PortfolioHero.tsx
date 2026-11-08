import React from "react";

export function PortfolioHero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#EFF6FB] via-[#F8FAFC] to-[#FFFFFF] dark:from-[#030711] dark:via-[#061231] dark:to-[#08183A] py-14 sm:py-18 border-b border-[#E2E8F0] dark:border-blue-900/40">
      <svg
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[190px] w-[190px] sm:h-[240px] sm:w-[240px] -z-10"
      >
        <circle
          cx="15"
          cy="15"
          r="145"
          fill="#005090"
          fillOpacity="0.05"
          className="dark:opacity-15"
        />
        <circle
          cx="15"
          cy="15"
          r="172"
          stroke="#005090"
          strokeOpacity="0.25"
          strokeWidth="1.3"
        />
        <circle cx="154.2" cy="116.1" r="5.5" fill="#0986C8" />
      </svg>

      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14 text-center">
        <p className="nk-hero-enter text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.24em] text-[#005090] dark:text-[#0986C8]">
          PORTOFOLIO &amp; STUDI KASUS
        </p>
        <h1 className="nk-hero-enter nk-hero-delay-1 mt-3 text-[30px] sm:text-[40px] lg:text-[44px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#041E42] dark:text-white">
          Gambaran implementasi{" "}
          <span className="text-[#005090] dark:text-[#0986C8]">teknologi</span> pada{" "}
          <span className="text-[#005090] dark:text-[#0986C8]">sektor bisnis</span>
        </h1>
        <p className="nk-hero-enter nk-hero-delay-2 mx-auto mt-4 max-w-[660px] text-[14px] sm:text-[15px] leading-[1.7] text-[#4A5D78] dark:text-slate-300">
          Contoh arsitektur proyek dan solusi digital yang tim kami rancang untuk
          memecahkan kendala operasional klien secara terukur.
        </p>
      </div>
    </section>
  );
}
