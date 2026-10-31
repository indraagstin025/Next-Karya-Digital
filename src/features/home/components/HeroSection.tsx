import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { HERO_HIGHLIGHTS } from "../data/homeData";

export function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative isolate overflow-hidden pt-[68px] lg:pt-[76px] bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EAF2F9] dark:from-[#030711] dark:via-[#061231] dark:to-[#08183A] min-h-[auto] lg:min-h-dvh flex items-center"
    >
      {/* Background Tech Waves matching Brand Colors (Navy & Primary Blue) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[115px] sm:h-[155px] lg:h-[190px] w-full overflow-hidden -z-10"
      >
        <svg
          viewBox="0 0 1440 240"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full opacity-85 dark:opacity-25"
        >
          <path
            d="M0 75 C210 95, 370 185, 620 220 C880 250, 1180 140, 1440 70 L1440 240 L0 240 Z"
            fill="url(#heroWaveBack)"
          />
          <path
            d="M0 110 C180 125, 310 190, 490 240 L0 240 Z"
            fill="url(#heroWaveLeft)"
          />
          <path
            d="M860 240 C1060 215, 1250 135, 1440 95 L1440 240 Z"
            fill="url(#heroWaveRight)"
          />
          <defs>
            <linearGradient id="heroWaveBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#005090" stopOpacity="0.16" />
              <stop offset="48%" stopColor="#0986C8" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#002857" stopOpacity="0.14" />
            </linearGradient>
            <linearGradient id="heroWaveLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#005090" stopOpacity="0.20" />
              <stop offset="65%" stopColor="#0986C8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#002857" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="heroWaveRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0986C8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#005090" stopOpacity="0.08" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14 py-10 sm:py-14 lg:py-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          <div className="max-w-[530px]">
            <div className="nk-hero-enter inline-flex items-center gap-2 rounded-full border border-[#005090]/25 bg-[#005090]/8 dark:bg-[#0986C8]/15 px-3.5 py-1 text-[11px] sm:text-xs font-bold text-[#005090] dark:text-[#76c2eb] mb-3.5">
              <span className="h-2 w-2 rounded-full bg-[#005090] dark:bg-[#0986C8] animate-pulse" />
              <span>Next Karya Digital Solutions • Software House & Jasa Website</span>
            </div>

            <h1 className="nk-hero-enter text-[31px] sm:text-[38px] lg:text-[44px] xl:text-[48px] font-extrabold leading-[1.15] tracking-[-0.025em] text-[#041E42] dark:text-[#f4f8ff]">
              Bangun Website Profesional
              <br />
              untuk Bisnis Anda yang{" "}
              <span className="text-[#005090] dark:text-[#0986C8]">
                Lebih Dipercaya.
              </span>
            </h1>

            <p className="nk-hero-enter nk-hero-delay-1 mt-4 max-w-[490px] text-[14px] sm:text-[15px] leading-[1.68] text-[#4A5D78] dark:text-[#b5c5dd] font-normal">
              Tingkatkan kredibilitas dan jangkauan pasar bisnis Anda. Next Karya Digital Solutions merancang website modern berkecepatan tinggi, sistem web kustom, dan aplikasi mobile yang ramah SEO serta mudah dihubungi oleh calon pelanggan.
            </p>

            <div className="nk-hero-enter nk-hero-delay-2 mt-6 flex flex-wrap items-center gap-3.5">
              <Link
                href="#layanan"
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#005090] hover:bg-[#003E70] px-6 py-3 text-[13.5px] font-semibold text-white shadow-[0_10px_25px_-5px_rgba(0,80,144,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-5px_rgba(0,80,144,0.55)] active:scale-[0.98]"
              >
                <span>Lihat Layanan</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/portofolio"
                className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#005090] bg-white hover:bg-[#005090] hover:text-white px-6 py-3 text-[13.5px] font-semibold text-[#005090] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] dark:bg-slate-900 dark:border-slate-700 dark:text-[#0986C8] dark:hover:bg-[#005090] dark:hover:text-white"
              >
                Lihat Portofolio
              </Link>
            </div>

            <div className="nk-hero-enter nk-hero-delay-3 mt-9 sm:mt-11 flex flex-wrap items-center gap-y-3 gap-x-4 sm:gap-x-5">
              {HERO_HIGHLIGHTS.map((item, index) => (
                <React.Fragment key={item.label}>
                  {index > 0 && (
                    <div className="hidden sm:block h-6 w-[1px] bg-[#CBD5E1] dark:bg-slate-700/80" />
                  )}
                  <div className="group flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#005090] text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <span className="text-xs sm:text-[12.5px] font-semibold text-[#041E42] dark:text-slate-200">
                      {item.label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Stage with Logo Gabungan */}
          <div className="nk-hero-enter nk-hero-delay-2 group relative flex items-center justify-center w-full max-w-[550px] mx-auto min-h-[280px] sm:min-h-[360px] lg:min-h-[430px]">
            <svg
              viewBox="0 0 700 540"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            >
              <defs>
                {/* Aura using Brand Primary & Navy colors instead of pale baby blue */}
                <linearGradient id="heroAuraOval" x1="15%" y1="5%" x2="85%" y2="95%">
                  <stop offset="0%" stopColor="#005090" stopOpacity="0.16" />
                  <stop offset="55%" stopColor="#0986C8" stopOpacity="0.09" />
                  <stop offset="100%" stopColor="#002857" stopOpacity="0.13" />
                </linearGradient>

                <radialGradient id="heroBottomGlow" cx="52%" cy="76%" r="38%">
                  <stop offset="0%" stopColor="#005090" stopOpacity="0.26" />
                  <stop offset="100%" stopColor="#005090" stopOpacity="0" />
                </radialGradient>

                <linearGradient id="primaryOrbitStroke" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0986C8" stopOpacity="0.45" />
                  <stop offset="45%" stopColor="#005090" stopOpacity="0.80" />
                  <stop offset="80%" stopColor="#003E70" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#002857" stopOpacity="0.45" />
                </linearGradient>

                <linearGradient id="innerOrbitStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#005090" stopOpacity="0.40" />
                  <stop offset="50%" stopColor="#0986C8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#003E70" stopOpacity="0.35" />
                </linearGradient>

                {/* 3D Sphere using brand gradient */}
                <radialGradient id="iceSphere3D" cx="72%" cy="72%" r="68%" fx="72%" fy="72%">
                  <stop offset="0%" stopColor="#EAF2F9" />
                  <stop offset="45%" stopColor="#0986C8" />
                  <stop offset="100%" stopColor="#002857" />
                </radialGradient>
              </defs>

              <g transform="rotate(-22 350 270)">
                <ellipse
                  cx="350"
                  cy="270"
                  rx="295"
                  ry="220"
                  fill="url(#heroAuraOval)"
                  className="dark:opacity-25"
                />
              </g>

              <ellipse
                cx="355"
                cy="380"
                rx="215"
                ry="115"
                fill="url(#heroBottomGlow)"
                className="dark:opacity-30"
              />

              <g transform="rotate(-19 350 270)">
                <ellipse
                  cx="350"
                  cy="270"
                  rx="288"
                  ry="202"
                  stroke="url(#innerOrbitStroke)"
                  strokeWidth="1.2"
                />
              </g>

              <g transform="rotate(-14 350 270)">
                <ellipse
                  cx="350"
                  cy="270"
                  rx="318"
                  ry="198"
                  stroke="url(#primaryOrbitStroke)"
                  strokeWidth="1.6"
                />
                <circle cx="600.6" cy="148.1" r="10.5" fill="#005090" />
                <circle cx="99.4" cy="391.9" r="5.5" fill="#005090" />
              </g>

              <circle
                cx="630"
                cy="392"
                r="27"
                fill="url(#iceSphere3D)"
                className="dark:opacity-35"
              />
            </svg>

            {/* Logo Gabungan inside Stage */}
            <div className="relative z-10 w-[72%] sm:w-[75%] max-w-[390px] transition-transform duration-500 ease-out group-hover:scale-[1.03] group-hover:-translate-y-1">
              <Image
                src="/logo/logo-gabungan.png"
                alt="Next Karya Digital Solutions - Mengakselerasi Inovasi, Mewujudkan Karya Digital"
                width={960}
                height={304}
                priority
                className="w-full h-auto object-contain drop-shadow-[0_14px_32px_rgba(0,80,144,0.14)] dark:drop-shadow-[0_14px_32px_rgba(0,80,144,0.30)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
