import React from "react";
import Link from "next/link";
import {
  GlobeIcon,
  UpdateIcon,
  CodeIcon,
  MobileIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { PublicServiceDTO } from "@/lib/public-content";
import { pickServiceCopy } from "@/lib/live-content-adapters";

export function ServiceCards({ services }: { services?: PublicServiceDTO[] | null }) {
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

  const coreSlugs = new Set([
    "pembuatan-website-bisnis",
    "redesign-optimalisasi-website",
    "aplikasi-web-dashboard-kustom",
    "pengembangan-aplikasi-mobile",
  ]);
  const extraServices = (services ?? []).filter((s) => !coreSlugs.has(s.slug));

  return (
    <div className="space-y-6 lg:space-y-7">
      <div className="grid gap-6 lg:gap-7 lg:grid-cols-12 items-stretch">
        <ScrollReveal className="lg:col-span-7 h-full">
          <article className="h-full flex flex-col justify-between rounded-[30px] bg-white dark:bg-slate-900 border-2 border-[#005090] dark:border-blue-500/70 p-7 sm:p-9 shadow-[0_16px_40px_-10px_rgba(0,80,144,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-10px_rgba(0,80,144,0.22)] hover:border-[#005090] group">
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-center">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#005090] text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <GlobeIcon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-[#005090] px-3.5 py-1 text-[11.5px] font-bold text-white shadow-sm">
                    Website
                  </span>
                </div>

                <h2 className="text-[20px] sm:text-[22px] font-extrabold tracking-[-0.015em] text-[#041E42] dark:text-white">
                  {web.title}
                </h2>
                <p className="mt-2.5 text-[13px] sm:text-[13.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
                  {web.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2 max-w-[340px]">
                  {web.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-[11.5px] font-semibold text-[#0F172A] dark:text-slate-200 transition-colors group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                    >
                      <CheckIcon className="h-3.5 w-3.5 shrink-0 text-[#005090] dark:text-[#0986C8] stroke-2" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                <div className="mt-7">
                  <a
                    href="#paket-layanan"
                    className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#005090] dark:text-[#0986C8] hover:text-[#003E70] transition-colors group/link"
                  >
                    <span>Lihat paket harga</span>
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-1.5" />
                  </a>
                </div>
              </div>

              <div className="relative flex items-center justify-center pt-4 md:pt-0">
                <div className="relative w-full max-w-[280px] transition-transform duration-500 group-hover:scale-[1.04] group-hover:-translate-y-1.5">
                  <svg
                    viewBox="0 0 320 230"
                    fill="none"
                    className="w-full h-auto drop-shadow-[0_12px_28px_rgba(0,80,144,0.12)]"
                  >
                    <defs>
                      <linearGradient id="servicesBrowserHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F8FAFC" />
                        <stop offset="100%" stopColor="#FFFFFF" />
                      </linearGradient>
                      <linearGradient id="servicesBrowserLandscapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#005090" />
                      </linearGradient>
                    </defs>

                    <rect
                      x="15"
                      y="15"
                      width="290"
                      height="190"
                      rx="16"
                      fill="#FFFFFF"
                      stroke="#E2E8F0"
                      strokeWidth="2"
                      className="dark:fill-slate-800 dark:stroke-slate-700"
                    />

                    <rect
                      x="15"
                      y="15"
                      width="290"
                      height="34"
                      rx="16"
                      fill="url(#servicesBrowserHeaderGrad)"
                      className="dark:fill-slate-700"
                    />
                    <circle cx="34" cy="32" r="3.5" fill="#FF5F56" />
                    <circle cx="46" cy="32" r="3.5" fill="#FFBD2E" />
                    <circle cx="58" cy="32" r="3.5" fill="#27C93F" />
                    <rect x="76" y="24" width="130" height="16" rx="8" fill="#FFFFFF" />

                    <rect
                      x="34"
                      y="66"
                      width="118"
                      height="82"
                      rx="12"
                      fill="url(#servicesBrowserLandscapeGrad)"
                    />
                    <path
                      d="M50 148 L80 102 L106 132 L124 114 L146 148 Z"
                      fill="#005090"
                    />
                    <circle cx="70" cy="88" r="8" fill="#FFFFFF" />

                    <rect x="168" y="68" width="118" height="10" rx="5" fill="#E2E8F0" />
                    <rect x="168" y="86" width="94" height="8" rx="4" fill="#F8FAFC" />
                    <rect x="168" y="100" width="110" height="8" rx="4" fill="#F8FAFC" />
                    <rect x="168" y="114" width="80" height="8" rx="4" fill="#F8FAFC" />

                    <rect x="168" y="132" width="58" height="14" rx="7" fill="#005090" />

                    <g className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:-translate-x-1">
                      <circle cx="12" cy="115" r="16" fill="#005090" className="drop-shadow-md" />
                      <circle cx="12" cy="115" r="11" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
                      <path d="M12 4 L12 26 M1 15 L23 15" stroke="#FFFFFF" strokeWidth="1.2" />
                    </g>

                    <g className="transition-transform duration-500 group-hover:translate-y-1 group-hover:translate-x-1">
                      <rect x="268" y="142" width="28" height="28" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" className="drop-shadow-md dark:fill-slate-800" />
                      <path d="M276 156 L288 156 M282 150 L288 156 L282 162" stroke="#005090" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </g>

                    <g className="transition-transform duration-500 group-hover:-translate-y-1.5">
                      <rect x="264" y="44" width="30" height="30" rx="9" fill="#005090" className="drop-shadow-lg" />
                      <rect x="271" y="52" width="16" height="14" rx="2.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
                      <path d="M271 57 L287 57" stroke="#FFFFFF" strokeWidth="1.2" />
                    </g>

                    <g className="transition-transform duration-500 group-hover:translate-y-1">
                      <rect x="24" y="174" width="32" height="32" rx="9" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" className="drop-shadow-md dark:fill-slate-800" />
                      <path d="M32 196 L32 188 M40 196 L40 182 M48 196 L48 185" stroke="#005090" strokeWidth="2.5" strokeLinecap="round" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </article>
        </ScrollReveal>

        <ScrollReveal delayMs={90} className="lg:col-span-5 h-full">
          <article className="h-full relative overflow-hidden flex flex-col justify-between rounded-[30px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-7 sm:p-9 shadow-[0_14px_38px_-10px_rgba(10,35,80,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_45px_-10px_rgba(0,80,144,0.15)] hover:border-[#005090] group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#005090] text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-45">
                  <UpdateIcon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-[#005090] px-3.5 py-1 text-[11.5px] font-bold text-white shadow-sm">
                  Penyegaran
                </span>
              </div>

              <h2 className="text-[20px] sm:text-[21px] font-extrabold tracking-[-0.015em] text-[#041E42] dark:text-white">
                {redesign.title}
              </h2>
              <p className="mt-2.5 text-[13px] sm:text-[13.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
                {redesign.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {redesign.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-[11.5px] font-semibold text-[#0F172A] dark:text-slate-200 transition-colors group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E2E8F0] dark:border-slate-800">
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#005090] dark:text-[#0986C8] hover:text-[#003E70] transition-colors group/link"
              >
                <span>Konsultasikan redesign</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-1.5" />
              </Link>
            </div>
          </article>
        </ScrollReveal>
      </div>

      <div className="grid gap-6 lg:gap-7 lg:grid-cols-12 items-stretch">
        <ScrollReveal delayMs={60} className="lg:col-span-5 h-full">
          <article className="h-full relative overflow-hidden flex flex-col justify-between rounded-[30px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-7 sm:p-9 shadow-[0_14px_38px_-10px_rgba(10,35,80,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_45px_-10px_rgba(0,80,144,0.15)] hover:border-[#005090] group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#005090] text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <CodeIcon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-[#005090] px-3.5 py-1 text-[11.5px] font-bold text-white shadow-sm">
                  Sistem Web
                </span>
              </div>

              <h2 className="text-[20px] sm:text-[21px] font-extrabold tracking-[-0.015em] text-[#041E42] dark:text-white">
                {webapp.title}
              </h2>
              <p className="mt-2.5 text-[13px] sm:text-[13.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
                {webapp.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {webapp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-[11.5px] font-semibold text-[#0F172A] dark:text-slate-200 transition-colors group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mt-8 pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#005090] dark:text-[#0986C8] hover:text-[#003E70] transition-colors group/link z-10"
              >
                <span>Konsultasikan sistem</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-1.5" />
              </Link>

              <div className="absolute right-0 bottom-0 pointer-events-none w-[170px] h-[100px] transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
                <svg viewBox="0 0 180 110" fill="none" className="w-full h-full">
                  <rect x="25" y="15" width="145" height="90" rx="10" fill="#F8FBFF" stroke="#E2E8F0" strokeWidth="1.6" className="dark:fill-slate-800 dark:stroke-slate-700" />
                  <rect x="25" y="15" width="145" height="18" rx="10" fill="#FFFFFF" className="dark:fill-slate-700" />
                  <circle cx="37" cy="24" r="2.5" fill="#005090" />
                  <circle cx="45" cy="24" r="2.5" fill="#0986C8" />
                  <circle cx="53" cy="24" r="2.5" fill="#005090" />
                  <rect x="36" y="44" width="58" height="42" rx="6" fill="#FFFFFF" stroke="#E2EEFE" className="dark:fill-slate-700" />
                  <path d="M44 76 L52 64 L62 70 L72 56 L82 76 Z" fill="#005090" />
                  <rect x="104" y="44" width="54" height="6" rx="3" fill="#005090" />
                  <rect x="104" y="56" width="46" height="5" rx="2.5" fill="#FFFFFF" />
                  <rect x="104" y="66" width="38" height="5" rx="2.5" fill="#FFFFFF" />
                  <rect x="104" y="76" width="50" height="5" rx="2.5" fill="#FFFFFF" />
                </svg>
              </div>
            </div>
          </article>
        </ScrollReveal>

        <ScrollReveal delayMs={150} className="lg:col-span-7 h-full">
          <article className="h-full relative overflow-hidden flex flex-col justify-between rounded-[30px] bg-gradient-to-br from-[#005090] via-[#003E70] to-[#002857] p-7 sm:p-9 shadow-[0_18px_48px_-10px_rgba(0,80,144,0.38)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_-10px_rgba(0,80,144,0.52)] group">
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-center">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#002857] text-white border border-[#013565] shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <MobileIcon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-[#002857] border border-[#013565] px-3.5 py-1 text-[11.5px] font-semibold text-white">
                    Mobile App
                  </span>
                </div>

                <h2 className="text-[20px] sm:text-[22px] font-extrabold tracking-[-0.015em] text-white">
                  {mobile.title}
                </h2>
                <p className="mt-2.5 text-[13px] sm:text-[13.5px] leading-[1.68] text-blue-50">
                  {mobile.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {mobile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#002857] border border-[#013565] px-3.5 py-1.5 text-[11.5px] font-semibold text-white transition-colors group-hover:bg-[#003875]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-7">
                  <Link
                    href="/kontak"
                    className="inline-flex items-center gap-2 text-[13.5px] font-bold text-white hover:text-blue-100 transition-colors group/link"
                  >
                    <span>Konsultasikan aplikasi</span>
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-1.5" />
                  </Link>
                </div>
              </div>

              <div className="relative flex items-center justify-center pt-4 md:pt-0">
                <div className="relative w-full max-w-[220px] transition-transform duration-500 group-hover:scale-[1.05] group-hover:-translate-y-2 group-hover:rotate-1">
                  <svg viewBox="0 0 240 320" fill="none" className="w-full h-auto drop-shadow-[0_20px_35px_rgba(3,20,68,0.5)]">
                    <rect
                      x="40"
                      y="20"
                      width="160"
                      height="280"
                      rx="28"
                      fill="#FFFFFF"
                      stroke="#E2E8F0"
                      strokeWidth="3.5"
                    />

                    <rect
                      x="48"
                      y="28"
                      width="144"
                      height="264"
                      rx="22"
                      fill="#0A2558"
                    />

                    <rect x="90" y="36" width="60" height="7" rx="3.5" fill="#1D4080" />
                    <circle cx="158" cy="39.5" r="2.5" fill="#005090" />

                    <rect x="60" y="58" width="56" height="50" rx="10" fill="#1D4080" />
                    <rect x="124" y="58" width="56" height="50" rx="10" fill="#1D4080" />
                    <rect x="60" y="118" width="56" height="50" rx="10" fill="#1D4080" />
                    <rect x="124" y="118" width="56" height="50" rx="10" fill="#1D4080" />

                    <circle cx="88" cy="78" r="8" fill="#005090" />
                    <circle cx="152" cy="78" r="8" fill="#0986C8" />
                    <circle cx="88" cy="138" r="8" fill="#0986C8" />
                    <circle cx="152" cy="138" r="8" fill="#005090" />

                    <rect x="60" y="182" width="120" height="42" rx="10" fill="#13336B" />
                    <rect x="72" y="196" width="70" height="6" rx="3" fill="#005090" />
                    <rect x="72" y="206" width="45" height="5" rx="2.5" fill="#005090" />

                    <rect x="60" y="234" width="120" height="40" rx="10" fill="#13336B" />
                    <rect x="72" y="248" width="60" height="6" rx="3" fill="#005090" />

                    <g className="transition-transform duration-500 group-hover:-translate-y-2">
                      <circle cx="28" cy="120" r="19" fill="#005090" stroke="#FFFFFF" strokeWidth="2" className="drop-shadow-lg" />
                      <path d="M22 122 C22 117.5 25.5 114 30 114 C34.5 114 38 117.5 38 122 Z" fill="#FFFFFF" />
                      <circle cx="26" cy="119" r="1" fill="#005090" />
                      <circle cx="34" cy="119" r="1" fill="#005090" />
                      <line x1="24" y1="114" x2="21" y2="110" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                      <line x1="36" y1="114" x2="39" y2="110" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                    </g>

                    <g className="transition-transform duration-500 group-hover:translate-y-2">
                      <circle cx="212" cy="190" r="19" fill="#005090" stroke="#FFFFFF" strokeWidth="2" className="drop-shadow-lg" />
                      <path
                        d="M211 182 C212 180.5 213.5 180 214.5 180 C215 181 214.5 182.5 213.5 183 C212.8 183.5 211.5 183.2 211 182 Z M215.5 185 C217 185 218 186 218 187 C217 187.5 216.5 189 217.2 190.5 C218 192 217 194 216 195.5 C215.2 196.5 214.5 197 213.5 197 C212.5 197 212 196.2 211 196.2 C210 196.2 209.2 197 208.2 197 C207 197 206 195.8 205.2 194.5 C204 192.5 203.5 189.5 204.8 187.5 C205.5 186 207 185 208.5 185 C209.5 185 210.2 185.8 211 185.8 C211.8 185.8 212.5 185 213.5 185 Z"
                        fill="#FFFFFF"
                      />
                    </g>

                    <path
                      d="M15 155 C35 90, 205 70, 225 210"
                      stroke="#0986C8"
                      strokeWidth="1.2"
                      strokeDasharray="4 4"
                      fill="none"
                    />
                    <circle cx="130" cy="85" r="3" fill="#67E8F9" />
                  </svg>
                </div>
              </div>
            </div>
          </article>
        </ScrollReveal>
      </div>

      {extraServices.length > 0 && (
        <div className="grid gap-6 lg:gap-7 md:grid-cols-2">
          {extraServices.map((svc) => (
            <ScrollReveal key={svc.slug} className="h-full">
              <article className="h-full flex flex-col justify-between rounded-[30px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-7 sm:p-9 shadow-[0_14px_38px_-10px_rgba(10,35,80,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#005090] group">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#005090] text-white shadow-sm">
                      <CodeIcon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#005090] px-3.5 py-1 text-[11.5px] font-bold text-white shadow-sm">
                      {svc.category}
                    </span>
                  </div>
                  <h2 className="text-[20px] sm:text-[21px] font-extrabold tracking-[-0.015em] text-[#041E42] dark:text-white">
                    {svc.title}
                  </h2>
                  <p className="mt-2.5 text-[13px] sm:text-[13.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
                    {svc.shortDesc}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {svc.features.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-[11.5px] font-semibold text-[#0F172A] dark:text-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-[#E2E8F0] dark:border-slate-800">
                  <Link
                    href={svc.ctaHref}
                    className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#005090] dark:text-[#0986C8] hover:text-[#003E70] transition-colors group/link"
                  >
                    <span>{svc.ctaLabel}</span>
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-1.5" />
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
