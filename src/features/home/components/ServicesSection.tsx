import React from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  SectionHeaderTypewriter,
  ServiceCardSlide,
  ServiceNarrativeTypewriter,
} from "@/components/ui/ScrollTypewriter";
import {
  SdlcDevelopmentIcon,
  SdlcDeploymentIcon,
  SdlcDesignIcon,
  SdlcMobileAppIcon,
} from "@/components/ui/BrandIcons";
import type { PublicServiceDTO } from "@/lib/public-content";
import { pickServiceCopy } from "@/lib/live-content-adapters";

function WebsiteShowcaseVisual() {
  return (
    <svg viewBox="0 0 320 210" fill="none" aria-hidden="true" className="w-full max-w-[300px] h-auto">
      <defs>
        <linearGradient id="browserHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="browserLandscapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#005090" />
        </linearGradient>
      </defs>

      <rect
        x="18"
        y="12"
        width="284"
        height="182"
        rx="16"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="2"
        className="dark:fill-slate-800 dark:stroke-slate-700"
      />
      <rect
        x="18"
        y="12"
        width="284"
        height="32"
        rx="16"
        fill="url(#browserHeaderGrad)"
        className="dark:fill-slate-700"
      />
      <circle cx="36" cy="28" r="3.5" fill="#FF5F56" />
      <circle cx="48" cy="28" r="3.5" fill="#FFBD2E" />
      <circle cx="60" cy="28" r="3.5" fill="#27C93F" />
      <rect x="78" y="21" width="136" height="14" rx="7" fill="#FFFFFF" className="dark:fill-slate-800" />

      <rect
        x="36"
        y="60"
        width="116"
        height="84"
        rx="12"
        fill="url(#browserLandscapeGrad)"
      />
      <path d="M50 144 L80 98 L106 128 L124 110 L146 144 Z" fill="#005090" />
      <circle cx="70" cy="82" r="7.5" fill="#FFFFFF" />

      <rect x="168" y="64" width="114" height="10" rx="5" fill="#072146" fillOpacity="0.85" className="dark:fill-slate-200" />
      <rect x="168" y="82" width="94" height="8" rx="4" fill="#CBD5E1" className="dark:fill-slate-600" />
      <rect x="168" y="96" width="108" height="8" rx="4" fill="#E2E8F0" className="dark:fill-slate-700" />
      <rect x="168" y="110" width="76" height="8" rx="4" fill="#E2E8F0" className="dark:fill-slate-700" />
      <rect x="168" y="128" width="66" height="15" rx="7.5" fill="#14B8A6" />

      <g data-service-float="website-window">
        <rect x="262" y="42" width="30" height="30" rx="9" fill="#005090" />
        <rect x="269" y="50" width="16" height="14" rx="2.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        <path d="M269 55 L285 55" stroke="#FFFFFF" strokeWidth="1.2" />
      </g>

      <g data-service-float="website-chart">
        <rect x="26" y="160" width="32" height="32" rx="9" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" className="dark:fill-slate-800 dark:stroke-slate-700" />
        <path d="M34 182 L34 174 M42 182 L42 168 M50 182 L50 171" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function RedesignShowcaseVisual() {
  return (
    <svg viewBox="0 0 320 210" fill="none" aria-hidden="true" className="w-full max-w-[300px] h-auto">
      {/* Panel Lama (Kiri Belakang) */}
      <rect
        x="18"
        y="34"
        width="136"
        height="136"
        rx="14"
        fill="#F1F5F9"
        stroke="#CBD5E1"
        strokeWidth="1.8"
        strokeDasharray="4 4"
        className="dark:fill-slate-800/60 dark:stroke-slate-700"
      />
      <rect x="32" y="52" width="66" height="8" rx="4" fill="#94A3B8" />
      <rect x="32" y="68" width="102" height="36" rx="6" fill="#E2E8F0" className="dark:fill-slate-700" />
      <rect x="32" y="114" width="88" height="7" rx="3.5" fill="#CBD5E1" className="dark:fill-slate-600" />
      <rect x="32" y="127" width="64" height="7" rx="3.5" fill="#CBD5E1" className="dark:fill-slate-600" />

      {/* Panel Modern Hasil Redesign (Kanan Depan) */}
      <rect
        x="114"
        y="18"
        width="186"
        height="168"
        rx="16"
        fill="#FFFFFF"
        stroke="#005090"
        strokeWidth="2"
        className="dark:fill-slate-800 dark:stroke-sky-500/70"
      />
      <circle cx="132" cy="34" r="3.2" fill="#FF5F56" />
      <circle cx="143" cy="34" r="3.2" fill="#FFBD2E" />
      <circle cx="154" cy="34" r="3.2" fill="#27C93F" />

      <rect x="130" y="52" width="154" height="54" rx="10" fill="#EFF6FF" className="dark:fill-slate-700/80" />
      <path d="M144 92 L168 72 L190 84 L218 62 L244 76" stroke="#005090" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="244" cy="76" r="4" fill="#14B8A6" />

      <rect x="130" y="118" width="90" height="9" rx="4.5" fill="#072146" className="dark:fill-slate-200" />
      <rect x="130" y="134" width="122" height="7" rx="3.5" fill="#94A3B8" />
      <rect x="130" y="148" width="64" height="16" rx="8" fill="#005090" />

      {/* Indikator Skor Performa Teal */}
      <g className="transition-transform duration-500 group-hover:-translate-y-1">
        <circle cx="268" cy="146" r="22" fill="#FFFFFF" stroke="#14B8A6" strokeWidth="3" className="dark:fill-slate-900" />
        <path d="M261 146.5L266 151.5L276 141.5" stroke="#14B8A6" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function WebAppShowcaseVisual() {
  return (
    <svg viewBox="0 0 320 210" fill="none" aria-hidden="true" className="w-full max-w-[300px] h-auto">
      <rect
        x="18"
        y="14"
        width="284"
        height="182"
        rx="16"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="2"
        className="dark:fill-slate-800 dark:stroke-slate-700"
      />
      {/* Sidebar Sistem */}
      <path
        d="M18 30C18 21.1634 25.1634 14 34 14H76V196H34C25.1634 196 18 188.837 18 180V30Z"
        fill="#072146"
      />
      <circle cx="36" cy="34" r="4" fill="#14B8A6" />
      <rect x="46" y="31" width="18" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.85" />
      <rect x="30" y="56" width="34" height="6" rx="3" fill="#38BDF8" />
      <rect x="30" y="72" width="28" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.35" />
      <rect x="30" y="88" width="32" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.35" />
      <rect x="30" y="104" width="24" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.35" />

      {/* Area Grafik & Kartu Metrik */}
      <rect x="92" y="30" width="92" height="46" rx="10" fill="#F8FAFC" stroke="#E2E8F0" className="dark:fill-slate-700/70 dark:stroke-slate-600" />
      <rect x="104" y="42" width="38" height="6" rx="3" fill="#94A3B8" />
      <rect x="104" y="54" width="56" height="10" rx="5" fill="#005090" />

      <rect x="194" y="30" width="92" height="46" rx="10" fill="#F8FAFC" stroke="#E2E8F0" className="dark:fill-slate-700/70 dark:stroke-slate-600" />
      <rect x="206" y="42" width="38" height="6" rx="3" fill="#94A3B8" />
      <rect x="206" y="54" width="52" height="10" rx="5" fill="#14B8A6" />

      {/* Grafik Analitik Sistem */}
      <rect x="92" y="88" width="194" height="90" rx="12" fill="#F8FAFC" stroke="#E2E8F0" className="dark:fill-slate-700/70 dark:stroke-slate-600" />
      <path d="M110 156 L140 132 L172 142 L208 112 L242 124 L268 104" stroke="#005090" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="208" cy="112" r="4" fill="#14B8A6" />
      <circle cx="268" cy="104" r="4.5" fill="#14B8A6" />
      <rect x="110" y="164" width="158" height="4" rx="2" fill="#E2E8F0" className="dark:fill-slate-600" />
    </svg>
  );
}

function MobileShowcaseVisual() {
  return (
    <svg viewBox="0 0 240 230" fill="none" aria-hidden="true" className="w-full max-w-[215px] h-auto">
      <rect
        x="52"
        y="10"
        width="136"
        height="210"
        rx="24"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="3"
      />
      <rect
        x="59"
        y="17"
        width="122"
        height="196"
        rx="19"
        fill="#0A2558"
      />
      <rect x="95" y="25" width="50" height="6" rx="3" fill="#1D4080" />

      <rect x="70" y="44" width="46" height="42" rx="9" fill="#1D4080" />
      <rect x="124" y="44" width="46" height="42" rx="9" fill="#1D4080" />
      <rect x="70" y="94" width="46" height="42" rx="9" fill="#1D4080" />
      <rect x="124" y="94" width="46" height="42" rx="9" fill="#1D4080" />

      <circle cx="93" cy="65" r="7" fill="#14B8A6" />
      <circle cx="147" cy="65" r="7" fill="#0986C8" />
      <circle cx="93" cy="115" r="7" fill="#0986C8" />
      <circle cx="147" cy="115" r="7" fill="#14B8A6" />

      <rect x="70" y="148" width="100" height="46" rx="10" fill="#13336B" />
      <rect x="82" y="162" width="60" height="6" rx="3" fill="#14B8A6" />
      <rect x="82" y="174" width="42" height="5" rx="2.5" fill="#0986C8" />

      <g data-service-float="mobile-android">
        <circle cx="32" cy="88" r="16" fill="#005090" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M26 90 C26 86 29 83 32 83 C35 83 38 86 38 90 Z" fill="#FFFFFF" />
      </g>

      <g data-service-float="mobile-apple">
        <circle cx="208" cy="144" r="16" fill="#14B8A6" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M204 144.5L207.5 148L213.5 141" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function ServicesSection({ services }: { services?: PublicServiceDTO[] | null }) {
  const CORE_SERVICE_SLUGS = new Set([
    "pembuatan-website-bisnis",
    "redesign-optimalisasi-website",
    "aplikasi-web-dashboard-kustom",
    "pengembangan-aplikasi-mobile",
  ]);
  const extraServices = (services ?? []).filter((item) => !CORE_SERVICE_SLUGS.has(item.slug));

  const web = pickServiceCopy(services, "pembuatan-website-bisnis", {
    title: "Pembuatan Website Bisnis",
    description:
      "Website profil bisnis, company profile, dan landing page yang berfokus pada kredibilitas, konversi, dan pengalaman pengguna.",
    tags: ["Company Profile", "Landing Page", "Optimasi SEO", "Panel Admin / CMS"],
  });
  const redesign = pickServiceCopy(services, "redesign-optimalisasi-website", {
    title: "Redesign & Optimalisasi Website",
    description:
      "Memodernisasi tampilan dan kode website lama yang lambat, tidak responsif, atau usang menjadi antarmuka modern dengan skor kecepatan Google PageSpeed tinggi.",
    tags: ["Penyegaran UI/UX", "Kecepatan Loading", "Mobile-First", "Migrasi Konten Aman"],
  });
  const webapp = pickServiceCopy(services, "aplikasi-web-dashboard-kustom", {
    title: "Aplikasi Web & Dashboard Kustom",
    description:
      "Pengembangan sistem internal berbasis web seperti dashboard operasional, inventaris pergudangan, portal karyawan, dan otomatisasi administrasi multi-cabang.",
    tags: ["Dashboard Analitik", "Database Relasional", "Integrasi REST API", "Hak Akses"],
  });
  const mobile = pickServiceCopy(services, "pengembangan-aplikasi-mobile", {
    title: "Pengembangan Aplikasi Mobile",
    description:
      "Pembuatan aplikasi Android dan iOS yang responsif, intuitif, dan terintegrasi dengan sistem alur kerja dan API server bisnis Anda.",
    tags: ["Android & iOS", "Push Notification", "Integrasi Payment Gateway", "Sinkronisasi Real-Time"],
  });

  const serviceRows = [
    {
      id: "website",
      stepNumber: "01",
      categoryLabel: "LAYANAN WEBSITE",
      cardShortTitle: "Website Bisnis & Landing Page",
      title: web.title,
      description: web.description,
      tags: web.tags,
      linkText: "Lihat detail & paket",
      linkHref: "/layanan#paket-layanan",
      isDarkCard: false,
      icon: <SdlcDevelopmentIcon className="h-10 w-10 sm:h-11 sm:w-11" />,
      visual: <WebsiteShowcaseVisual />,
    },
    {
      id: "redesign",
      stepNumber: "02",
      categoryLabel: "PENYEGARAN & PERFORMA",
      cardShortTitle: "Modernisasi UI & Kecepatan",
      title: redesign.title,
      description: redesign.description,
      tags: redesign.tags,
      linkText: "Lihat detail layanan",
      linkHref: "/layanan",
      isDarkCard: false,
      icon: <SdlcDeploymentIcon className="h-10 w-10 sm:h-11 sm:w-11" />,
      visual: <RedesignShowcaseVisual />,
    },
    {
      id: "webapp",
      stepNumber: "03",
      categoryLabel: "SISTEM WEB INTERNAL",
      cardShortTitle: "Sistem Web & Dashboard Kustom",
      title: webapp.title,
      description: webapp.description,
      tags: webapp.tags,
      linkText: "Lihat detail layanan",
      linkHref: "/layanan",
      isDarkCard: false,
      icon: <SdlcDesignIcon className="h-10 w-10 sm:h-11 sm:w-11" />,
      visual: <WebAppShowcaseVisual />,
    },
    {
      id: "mobile",
      stepNumber: "04",
      categoryLabel: "APLIKASI MOBILE",
      cardShortTitle: "Aplikasi Android & iOS",
      title: mobile.title,
      description: mobile.description,
      tags: mobile.tags,
      linkText: "Lihat detail layanan",
      linkHref: "/layanan",
      isDarkCard: true,
      icon: <SdlcMobileAppIcon className="h-10 w-10 sm:h-11 sm:w-11" lightOnDark />,
      visual: <MobileShowcaseVisual />,
    },
  ];

  return (
    <section
      id="layanan"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EFF6FB] dark:from-[#030711] dark:via-[#061231] dark:to-[#08183A] py-16 sm:py-20 lg:py-24 border-t border-[#E2E8F0] dark:border-blue-900/30"
    >
      <svg
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-[190px] w-[190px] sm:h-[240px] sm:w-[240px] -scale-x-100 -z-10"
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

      <svg
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[180px] w-[180px] sm:h-[230px] sm:w-[230px] -scale-x-100 -z-10"
      >
        <circle
          cx="250"
          cy="250"
          r="130"
          fill="#0986C8"
          fillOpacity="0.05"
          className="dark:opacity-15"
        />
        <circle
          cx="250"
          cy="250"
          r="158"
          stroke="#005090"
          strokeOpacity="0.25"
          strokeWidth="1.3"
        />
        <circle cx="106.8" cy="183.2" r="5.5" fill="#005090" />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 sm:px-9 lg:px-14">
        <SectionHeaderTypewriter
          eyebrow="LAYANAN UTAMA"
          line1="Spesialisasi rekayasa web dan mobile untuk"
          line2Accent="pertumbuhan bisnis"
          description="Dari website profil bisnis hingga sistem alur kerja terintegrasi, tim kami merancang dan mengembangkan produk digital yang siap digunakan jangka panjang."
          charsPerSecond={68}
        />

        {/* Tata Letak Zig-Zag (Kiri-Kanan Bergantian) */}
        <div className="mt-14 sm:mt-18 space-y-14 sm:space-y-18 lg:space-y-22">
          {serviceRows.map((row, idx) => {
            const isCardLeft = idx % 2 === 0;

            return (
              <div
                key={row.id}
                className="grid gap-8 lg:gap-14 lg:grid-cols-12 items-center"
              >
                {/* Kolom Card Visual (Slide dari Kiri jika di Kiri, Slide dari Kanan jika di Kanan) */}
                <ServiceCardSlide
                  side={isCardLeft ? "left" : "right"}
                  className={
                    isCardLeft
                      ? "lg:col-span-6 lg:order-1"
                      : "lg:col-span-6 lg:order-2"
                  }
                >
                  <article
                    data-service-card
                    className={`group relative overflow-hidden rounded-[28px] p-6 sm:p-8 transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 ${
                      row.isDarkCard
                        ? "bg-gradient-to-br from-[#005090] via-[#003E70] to-[#002857] border border-[#01427C] shadow-[0_18px_46px_-12px_rgba(0,80,144,0.38)] hover:shadow-[0_24px_56px_-12px_rgba(0,80,144,0.5)]"
                        : "bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-[0_14px_38px_-10px_rgba(10,35,80,0.07)] hover:border-[#005090] dark:hover:border-sky-500/70 hover:shadow-[0_22px_48px_-12px_rgba(0,80,144,0.16)]"
                    }`}
                  >
                    <div className="nk-service-spotlight" aria-hidden="true" />

                    {/* Header Card Ringkas (Ikon SDLC + Nama Singkat, Tanpa Badge) */}
                    <div
                      className={`flex items-center justify-between pb-4 border-b ${
                        row.isDarkCard
                          ? "border-white/15"
                          : "border-[#F1F5F9] dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 transition-transform duration-300 group-hover:scale-105">
                          {row.icon}
                        </div>
                        <span
                          className={`text-[14px] sm:text-[15px] font-bold tracking-[-0.01em] ${
                            row.isDarkCard
                              ? "text-white"
                              : "text-[#041E42] dark:text-white"
                          }`}
                        >
                          {row.cardShortTitle}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-extrabold tracking-[0.18em] ${
                          row.isDarkCard
                            ? "text-sky-200/80"
                            : "text-[#94A3B8] dark:text-slate-500"
                        }`}
                      >
                        {row.stepNumber}
                      </span>
                    </div>

                    {/* Visual Utama di Tengah Card */}
                    <div className="my-5 sm:my-6 flex items-center justify-center min-h-[195px] sm:min-h-[215px] transition-transform duration-500 group-hover:scale-[1.03]">
                      {row.visual}
                    </div>

                    {/* Baris Ringkas Tanpa Kapsul Badge */}
                    <p
                      className={`text-center text-xs font-medium tracking-wide ${
                        row.isDarkCard
                          ? "text-blue-100/90"
                          : "text-[#64748B] dark:text-slate-400"
                      }`}
                    >
                      {row.tags.slice(0, 3).join("  •  ")}
                    </p>
                  </article>
                </ServiceCardSlide>

                {/* Kolom Teks Penjelasan (Kanan pada Baris 1 & 3, Kiri pada Baris 2 & 4) */}
                <div
                  className={
                    isCardLeft
                      ? "lg:col-span-6 lg:order-2"
                      : "lg:col-span-6 lg:order-1"
                  }
                >
                  <ScrollReveal direction={isCardLeft ? "right" : "left"}>
                    <ServiceNarrativeTypewriter
                      stepNumber={row.stepNumber}
                      categoryLabel={row.categoryLabel}
                      title={row.title}
                      description={row.description}
                      tags={row.tags}
                      linkText={row.linkText}
                      linkHref={row.linkHref}
                      headingLevel="h3"
                    />
                  </ScrollReveal>
                </div>
              </div>
            );
          })}

          {extraServices.map((extra, extraIdx) => {
            const totalIdx = serviceRows.length + extraIdx;
            const isCardLeft = totalIdx % 2 === 0;
            const stepNum = String(totalIdx + 1).padStart(2, "0");

            return (
              <div
                key={extra.slug}
                className="grid gap-8 lg:gap-14 lg:grid-cols-12 items-center"
              >
                <ServiceCardSlide
                  side={isCardLeft ? "left" : "right"}
                  className={
                    isCardLeft
                      ? "lg:col-span-6 lg:order-1"
                      : "lg:col-span-6 lg:order-2"
                  }
                >
                  <article
                    data-service-card
                    className="group relative overflow-hidden rounded-[28px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-[0_14px_38px_-10px_rgba(10,35,80,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#005090]"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <SdlcDesignIcon className="h-10 w-10 sm:h-11 sm:w-11" />
                        <span className="text-[14px] sm:text-[15px] font-bold text-[#041E42] dark:text-white">
                          {extra.category || "Layanan Khusus"}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold tracking-[0.18em] text-[#94A3B8]">
                        {stepNum}
                      </span>
                    </div>
                    <div className="my-5 flex items-center justify-center min-h-[190px]">
                      <WebAppShowcaseVisual />
                    </div>
                    {extra.features.length > 0 && (
                      <p className="text-center text-xs font-medium text-[#64748B] dark:text-slate-400">
                        {extra.features.slice(0, 3).join("  •  ")}
                      </p>
                    )}
                  </article>
                </ServiceCardSlide>

                <div
                  className={
                    isCardLeft
                      ? "lg:col-span-6 lg:order-2"
                      : "lg:col-span-6 lg:order-1"
                  }
                >
                  <ScrollReveal direction={isCardLeft ? "right" : "left"}>
                    <ServiceNarrativeTypewriter
                      stepNumber={stepNum}
                      categoryLabel={(extra.category || "LAYANAN KHUSUS").toUpperCase()}
                      title={extra.title}
                      description={extra.shortDesc}
                      tags={extra.features}
                      linkText="Lihat detail layanan"
                      linkHref="/layanan"
                      headingLevel="h3"
                    />
                  </ScrollReveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
