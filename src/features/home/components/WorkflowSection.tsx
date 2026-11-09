import React from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface SdlcStage {
  stepLabel: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SDLC_STAGES: SdlcStage[] = [
  {
    stepLabel: "01. Plan",
    title: "Analisis & Perencanaan",
    description: "Memahami kebutuhan dan merancang solusi.",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="h-14 w-14 sm:h-16 sm:w-16 shrink-0"
      >
        <circle
          cx="27"
          cy="27"
          r="17"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.6"
        />
        <path
          d="M39.5 39.5L53 53"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M21 32V26"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M27 32V22"
          className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M33 32V19"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    stepLabel: "02. Design",
    title: "Desain Solusi",
    description: "Merancang arsitektur dan pengalaman pengguna.",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="h-14 w-14 sm:h-16 sm:w-16 shrink-0"
      >
        <path
          d="M22 19L11 30L22 41"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M42 19L53 30L42 41"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35.5 16L28.5 44"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M23 51H41"
          className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    stepLabel: "03. Development",
    title: "Pengembangan",
    description: "Membangun solusi dengan kode berkualitas.",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="h-14 w-14 sm:h-16 sm:w-16 shrink-0"
      >
        <rect
          x="11"
          y="14"
          width="42"
          height="28"
          rx="3.5"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.6"
        />
        <path
          d="M6 42H58L55 48.5C54.3 49.8 53 50.5 51.5 50.5H12.5C11 50.5 9.7 49.8 9 48.5L6 42Z"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M26 23L20.5 28L26 33"
          className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M38 23L43.5 28L38 33"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34 21.5L30 34.5"
          className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    stepLabel: "04. Testing",
    title: "Pengujian",
    description: "Memastikan kualitas dan keamanan sistem.",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="h-14 w-14 sm:h-16 sm:w-16 shrink-0"
      >
        <rect
          x="13"
          y="14"
          width="38"
          height="41"
          rx="4.5"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.6"
        />
        <path
          d="M24 14V11.5C24 10.1 25.1 9 26.5 9H37.5C38.9 9 40 10.1 40 11.5V14H24Z"
          className="fill-[#FAFBFD] dark:fill-slate-900 stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M20 29L23.5 32.5L29.5 26"
          className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35 29.5H43"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M20 41L23.5 44.5L29.5 38"
          className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35 41.5H43"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    stepLabel: "05. Deployment",
    title: "Implementasi",
    description: "Meluncurkan solusi ke lingkungan produksi.",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="h-14 w-14 sm:h-16 sm:w-16 shrink-0"
      >
        <path
          d="M51 13C40.5 13.5 31.5 18.5 25.5 26.5L37.5 38.5C45.5 32.5 50.5 23.5 51 13Z"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M25.5 26.5L17 28.5L14 35L21.5 36.5"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M37.5 38.5L35.5 47L29 50L27.5 42.5"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="38.5"
          cy="25.5"
          r="3.8"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.4"
        />
        <path
          d="M19 41L12 48"
          className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M23 45L15 53"
          className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M15 37L10 42"
          className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    stepLabel: "06. Maintenance",
    title: "Dukungan & Pemeliharaan",
    description: "Memberikan dukungan dan pembaruan berkala.",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="h-14 w-14 sm:h-16 sm:w-16 shrink-0"
      >
        <path
          d="M14 33V29C14 19.1 22.1 11 32 11C41.9 11 50 19.1 50 29V33"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <rect
          x="11"
          y="29"
          width="7.5"
          height="13"
          rx="3.75"
          className="fill-[#14B8A6] dark:fill-[#2DD4BF] stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.4"
        />
        <rect
          x="45.5"
          y="29"
          width="7.5"
          height="13"
          rx="3.75"
          className="fill-[#14B8A6] dark:fill-[#2DD4BF] stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.4"
        />
        <path
          d="M49 42V44C49 48.4 45.4 52 41 52H34"
          className="stroke-[#072146] dark:stroke-slate-100"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle
          cx="31.5"
          cy="52"
          r="2.4"
          className="fill-[#072146] dark:fill-slate-100"
        />
      </svg>
    ),
  },
];

function getGridDividerClasses(idx: number): string {
  const classes: string[] = [];

  // Mobile (< sm): 1 kolom, garis bawah untuk item 0..4
  if (idx < 5) {
    classes.push("max-sm:border-b");
  }

  // Tablet (sm..lg): 2 kolom x 3 baris
  if (idx < 4) {
    classes.push("sm:max-lg:border-b");
  }
  if (idx % 2 === 0) {
    classes.push("sm:max-lg:border-r");
  }

  // Desktop (lg+): 3 kolom x 2 baris sesuai referensi gambar
  if (idx < 3) {
    classes.push("lg:border-b");
  }
  if (idx % 3 !== 2) {
    classes.push("lg:border-r");
  }

  return classes.join(" ");
}

export function WorkflowSection() {
  return (
    <section
      id="alur"
      className="relative isolate overflow-hidden bg-[#FAFBFD] dark:bg-[#030711] py-16 sm:py-22 lg:py-26 border-t border-[#E2E8F0] dark:border-blue-900/30"
    >
      {/* Aksen lengkung lembut di sudut kiri-atas (sesuai gambar referensi) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-[#E8F2FC]/80 dark:bg-blue-950/25 -z-10"
      />

      {/* Aksen lengkung berlapis di sudut kanan-bawah (sesuai gambar referensi) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-[#E8F2FC]/85 dark:bg-blue-950/25 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-[#DCEBFA]/85 dark:bg-blue-900/20 -z-10"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 sm:px-9 lg:px-14">
        <ScrollReveal priority className="text-center max-w-[720px] mx-auto">
          {/* Pill Badge PROSES KERJA diapit garis horizontal halus */}
          <div className="inline-flex items-center justify-center gap-3 sm:gap-4 mb-4">
            <span
              aria-hidden="true"
              className="h-px w-14 sm:w-28 bg-gradient-to-r from-transparent to-[#CBD5E1] dark:to-slate-700"
            />
            <span className="inline-flex items-center gap-2 rounded-full bg-[#E6F0FC] dark:bg-blue-950/80 border border-[#CFE2F9] dark:border-blue-800/60 px-4 py-1.5 shadow-2xs">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0052B4] dark:bg-[#38BDF8] shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] text-[#0A3977] dark:text-sky-200">
                PROSES KERJA
              </span>
            </span>
            <span
              aria-hidden="true"
              className="h-px w-14 sm:w-28 bg-gradient-to-l from-transparent to-[#CBD5E1] dark:to-slate-700"
            />
          </div>

          <h2 className="mt-1 text-[28px] sm:text-[38px] lg:text-[44px] font-extrabold leading-[1.16] tracking-[-0.02em] text-[#072146] dark:text-white">
            Alur Kerja Kami
            <span className="block text-[#0052B4] dark:text-[#38BDF8]">
              Berbasis Metode SDLC
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-[610px] text-[14px] sm:text-[16px] leading-[1.65] text-[#4A5D78] dark:text-slate-300">
            Dari ide hingga implementasi, kami mengikuti tahapan pengembangan
            yang terstruktur dan efisien.
          </p>
        </ScrollReveal>

        {/* Grid 3x2 dengan garis pembatas tipis (Hairline Grid) sesuai gambar */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {SDLC_STAGES.map((stage, idx) => (
            <ScrollReveal
              key={stage.stepLabel}
              delayMs={idx * 65}
              className={`${getGridDividerClasses(idx)} border-[#E2E8F0] dark:border-slate-800/90`}
            >
              <div className="group flex items-start gap-4 sm:gap-5 px-4 py-7 sm:px-7 sm:py-9 lg:px-9 lg:py-10 transition-colors duration-200 hover:bg-white/70 dark:hover:bg-slate-900/40">
                <div className="mt-0.5 transition-transform duration-300 group-hover:scale-105">
                  {stage.icon}
                </div>

                <div className="min-w-0">
                  <p className="text-[13px] sm:text-[14px] font-bold text-[#0052B4] dark:text-[#38BDF8]">
                    {stage.stepLabel}
                  </p>
                  <h3 className="mt-0.5 text-[17px] sm:text-[18.5px] font-extrabold tracking-[-0.015em] text-[#072146] dark:text-white leading-snug">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] sm:text-[14.5px] leading-[1.6] text-[#4A5D78] dark:text-slate-300">
                    {stage.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
