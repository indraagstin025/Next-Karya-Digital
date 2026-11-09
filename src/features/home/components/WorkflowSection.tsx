"use client";

import React, { useEffect, useRef, useState } from "react";
import { SectionHeaderTypewriter } from "@/components/ui/ScrollTypewriter";
import {
  SdlcPlanIcon,
  SdlcDesignIcon,
  SdlcDevelopmentIcon,
  SdlcTestingIcon,
  SdlcDeploymentIcon,
  SdlcMaintenanceIcon,
} from "@/components/ui/BrandIcons";

export interface SdlcStage {
  stepNumber: number;
  stepLabel: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const SDLC_STAGES: SdlcStage[] = [
  {
    stepNumber: 1,
    stepLabel: "01. Plan",
    title: "Analisis & Perencanaan",
    description: "Memahami kebutuhan dan merancang solusi.",
    icon: <SdlcPlanIcon className="h-12 w-12 sm:h-14 sm:w-14 shrink-0" />,
  },
  {
    stepNumber: 2,
    stepLabel: "02. Design",
    title: "Desain Solusi",
    description: "Merancang arsitektur dan pengalaman pengguna.",
    icon: <SdlcDesignIcon className="h-12 w-12 sm:h-14 sm:w-14 shrink-0" />,
  },
  {
    stepNumber: 3,
    stepLabel: "03. Development",
    title: "Pengembangan",
    description: "Membangun solusi dengan kode berkualitas.",
    icon: <SdlcDevelopmentIcon className="h-12 w-12 sm:h-14 sm:w-14 shrink-0" />,
  },
  {
    stepNumber: 4,
    stepLabel: "04. Testing",
    title: "Pengujian",
    description: "Memastikan kualitas dan keamanan sistem.",
    icon: <SdlcTestingIcon className="h-12 w-12 sm:h-14 sm:w-14 shrink-0" />,
  },
  {
    stepNumber: 5,
    stepLabel: "05. Deployment",
    title: "Implementasi",
    description: "Meluncurkan solusi ke lingkungan produksi.",
    icon: <SdlcDeploymentIcon className="h-12 w-12 sm:h-14 sm:w-14 shrink-0" />,
  },
  {
    stepNumber: 6,
    stepLabel: "06. Maintenance",
    title: "Dukungan & Pemeliharaan",
    description: "Memberikan dukungan dan pembaruan berkala.",
    icon: <SdlcMaintenanceIcon className="h-12 w-12 sm:h-14 sm:w-14 shrink-0" />,
  },
];

/**
 * Garis Panah Horizontal Mengalir (Kiri -> Kanan untuk baris atas, Kanan -> Kiri untuk baris bawah)
 */
function FlowingHorizontalConnector({
  direction,
  active,
  flowDelay = "0s",
}: {
  direction: "right" | "left";
  active: boolean;
  flowDelay?: string;
}) {
  const isRight = direction === "right";
  const linePath = isRight ? "M 0 16 L 80 16" : "M 88 16 L 8 16";
  const arrowHead = isRight
    ? "M 74 9 L 84 16 L 74 23"
    : "M 14 9 L 4 16 L 14 23";

  return (
    <div
      aria-hidden="true"
      className="hidden lg:flex items-center justify-center w-full h-full px-1 select-none"
    >
      <svg
        viewBox="0 0 88 32"
        fill="none"
        className="w-full h-8 overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Garis jalur dasar */}
        <path
          d={linePath}
          className="stroke-[#CBD5E1] dark:stroke-slate-700"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Garis aktif utama */}
        <path
          d={linePath}
          className={`stroke-[#005090] dark:stroke-[#38BDF8] transition-opacity duration-500 ${
            active ? "opacity-45" : "opacity-0"
          }`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Garis putus-putus mengalir (efek arus berjalan) */}
        {active && (
          <path
            d={linePath}
            className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeDasharray="7 7"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="28"
              to="0"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </path>
        )}

        {/* Titik cahaya mengalir di sepanjang garis */}
        {active && (
          <circle r="3.2" className="fill-[#14B8A6] dark:fill-[#2DD4BF]">
            <animateMotion
              dur="1.6s"
              begin={flowDelay}
              repeatCount="indefinite"
              path={linePath}
            />
          </circle>
        )}

        {/* Kepala panah */}
        <path
          d={arrowHead}
          className={`transition-colors duration-300 ${
            active
              ? "stroke-[#005090] dark:stroke-[#38BDF8]"
              : "stroke-[#94A3B8] dark:stroke-slate-600"
          }`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * Garis Panah Vertikal Mengalir (Atas -> Bawah untuk 3 ke 4, Bawah -> Atas untuk 6 ke 1)
 */
function FlowingVerticalConnector({
  direction,
  active,
  flowDelay = "0s",
  mobileOnly = false,
}: {
  direction: "down" | "up";
  active: boolean;
  flowDelay?: string;
  mobileOnly?: boolean;
}) {
  const isDown = direction === "down";
  const linePath = isDown ? "M 16 0 L 16 62" : "M 16 70 L 16 8";
  const arrowHead = isDown
    ? "M 9 56 L 16 66 L 23 56"
    : "M 9 14 L 16 4 L 23 14";

  return (
    <div
      aria-hidden="true"
      className={`${
        mobileOnly ? "flex lg:hidden h-12 my-1" : "hidden lg:flex h-full py-1"
      } items-center justify-center w-full select-none`}
    >
      <svg
        viewBox="0 0 32 70"
        fill="none"
        className="w-8 h-full overflow-visible"
      >
        {/* Garis jalur dasar */}
        <path
          d={linePath}
          className="stroke-[#CBD5E1] dark:stroke-slate-700"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Garis aktif utama */}
        <path
          d={linePath}
          className={`stroke-[#005090] dark:stroke-[#38BDF8] transition-opacity duration-500 ${
            active ? "opacity-45" : "opacity-0"
          }`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Garis putus-putus mengalir */}
        {active && (
          <path
            d={linePath}
            className="stroke-[#14B8A6] dark:stroke-[#2DD4BF]"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeDasharray="7 7"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="28"
              to="0"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </path>
        )}

        {/* Titik cahaya mengalir */}
        {active && (
          <circle r="3.2" className="fill-[#14B8A6] dark:fill-[#2DD4BF]">
            <animateMotion
              dur="1.4s"
              begin={flowDelay}
              repeatCount="indefinite"
              path={linePath}
            />
          </circle>
        )}

        {/* Kepala panah */}
        <path
          d={arrowHead}
          className={`transition-colors duration-300 ${
            active
              ? "stroke-[#005090] dark:stroke-[#38BDF8]"
              : "stroke-[#94A3B8] dark:stroke-slate-600"
          }`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * Kartu Kotak Tahapan SDLC (Tanpa garis panah duplikat di dalam kartu)
 */
function SdlcStageBox({
  stage,
  visible,
  highlighted,
  onMouseEnter,
  onMouseLeave,
}: {
  stage: SdlcStage;
  visible: boolean;
  highlighted: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative h-full flex items-start gap-4 sm:gap-5 rounded-2xl bg-white dark:bg-slate-900/90 border px-5 py-6 sm:px-6 sm:py-7 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      } ${
        highlighted
          ? "border-[#005090]/40 dark:border-sky-500/40 shadow-[0_14px_34px_-12px_rgba(0,80,144,0.14)]"
          : "border-[#CBD5E1] dark:border-slate-800 shadow-xs"
      } hover:-translate-y-1 hover:border-[#005090] dark:hover:border-[#38BDF8] hover:shadow-[0_20px_42px_-12px_rgba(0,80,144,0.2)]`}
    >
      <div className="mt-0.5 transition-transform duration-300 group-hover:scale-110">
        {stage.icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] sm:text-[14px] font-bold text-[#005090] dark:text-[#38BDF8]">
          {stage.stepLabel}
        </p>

        <h3 className="mt-1 text-[16.5px] sm:text-[18px] font-extrabold tracking-[-0.015em] text-[#072146] dark:text-white leading-snug transition-colors duration-200 group-hover:text-[#005090] dark:group-hover:text-[#38BDF8]">
          {stage.title}
        </h3>

        <p className="mt-2 text-[13.5px] sm:text-[14px] leading-[1.6] text-[#4A5D78] dark:text-slate-300">
          {stage.description}
        </p>
      </div>
    </div>
  );
}

/**
 * Siklus Berputar SDLC (Sesuai Sketsa Pengguna):
 * Baris Atas (Kiri ke Kanan):  [01. Plan] ──────► [02. Design] ──────► [03. Development]
 *                                  ▲                                           │
 *                                  │                                           ▼
 * Baris Bawah (Kanan ke Kiri): [06. Maintenance] ◄────── [05. Deployment] ◄────── [04. Testing]
 */
export function SdlcInteractiveGrid() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [activeCount, setActiveCount] = useState<number>(7);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let timers: Array<ReturnType<typeof setTimeout>> = [];

    const clearAllTimers = () => {
      timers.forEach((t) => clearTimeout(t));
      timers = [];
    };

    const startCycleReveal = () => {
      clearAllTimers();
      setActiveCount(0);

      // Mengaktifkan tahap 1..6 lalu konektor ke-7 (6 -> 1) secara berurutan
      for (let i = 1; i <= 7; i++) {
        const timer = setTimeout(() => {
          setActiveCount(i);
        }, i * 220);
        timers.push(timer);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startCycleReveal();
          } else {
            clearAllTimers();
            setActiveCount(0);
          }
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(el);
    return () => {
      clearAllTimers();
      observer.disconnect();
    };
  }, []);

  const isStepVisible = (stepNum: number) => activeCount >= stepNum;
  const isStepHighlighted = (stepNum: number) =>
    hoveredStep !== null ? stepNum <= hoveredStep : activeCount >= stepNum;
  const isFlowActive = (fromStep: number) =>
    hoveredStep !== null
      ? fromStep === 6
        ? hoveredStep === 6
        : fromStep < hoveredStep
      : activeCount > fromStep;

  const [s1, s2, s3, s4, s5, s6] = SDLC_STAGES;

  return (
    <div ref={gridRef} className="relative mt-12 sm:mt-16">
      {/* TAMPILAN DESKTOP (lg+): Siklus Berputar 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 1 */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_64px_1fr_64px_1fr] xl:grid-cols-[1fr_84px_1fr_84px_1fr] lg:grid-rows-[1fr_68px_1fr] items-stretch">
        {/* BARIS 1: [1] ---> [2] ---> [3] */}
        <SdlcStageBox
          stage={s1}
          visible={isStepVisible(1)}
          highlighted={isStepHighlighted(1)}
          onMouseEnter={() => setHoveredStep(1)}
          onMouseLeave={() => setHoveredStep(null)}
        />

        <FlowingHorizontalConnector
          direction="right"
          active={isFlowActive(1)}
          flowDelay="0s"
        />

        <SdlcStageBox
          stage={s2}
          visible={isStepVisible(2)}
          highlighted={isStepHighlighted(2)}
          onMouseEnter={() => setHoveredStep(2)}
          onMouseLeave={() => setHoveredStep(null)}
        />

        <FlowingHorizontalConnector
          direction="right"
          active={isFlowActive(2)}
          flowDelay="0.25s"
        />

        <SdlcStageBox
          stage={s3}
          visible={isStepVisible(3)}
          highlighted={isStepHighlighted(3)}
          onMouseEnter={() => setHoveredStep(3)}
          onMouseLeave={() => setHoveredStep(null)}
        />

        {/* BARIS 2 (Konektor Vertikal): [6 ▲ 1] di kiri & [3 ▼ 4] di kanan */}
        <FlowingVerticalConnector
          direction="up"
          active={isFlowActive(6)}
          flowDelay="1.25s"
        />
        <div aria-hidden="true" />
        <div aria-hidden="true" />
        <div aria-hidden="true" />
        <FlowingVerticalConnector
          direction="down"
          active={isFlowActive(3)}
          flowDelay="0.5s"
        />

        {/* BARIS 3: [6] <--- [5] <--- [4] */}
        <SdlcStageBox
          stage={s6}
          visible={isStepVisible(6)}
          highlighted={isStepHighlighted(6)}
          onMouseEnter={() => setHoveredStep(6)}
          onMouseLeave={() => setHoveredStep(null)}
        />

        <FlowingHorizontalConnector
          direction="left"
          active={isFlowActive(5)}
          flowDelay="1.0s"
        />

        <SdlcStageBox
          stage={s5}
          visible={isStepVisible(5)}
          highlighted={isStepHighlighted(5)}
          onMouseEnter={() => setHoveredStep(5)}
          onMouseLeave={() => setHoveredStep(null)}
        />

        <FlowingHorizontalConnector
          direction="left"
          active={isFlowActive(4)}
          flowDelay="0.75s"
        />

        <SdlcStageBox
          stage={s4}
          visible={isStepVisible(4)}
          highlighted={isStepHighlighted(4)}
          onMouseEnter={() => setHoveredStep(4)}
          onMouseLeave={() => setHoveredStep(null)}
        />
      </div>

      {/* TAMPILAN MOBILE & TABLET (< lg): Urutan Berurutan 01 -> 06 dengan Panah Mengalir */}
      <div className="flex flex-col lg:hidden">
        {SDLC_STAGES.map((stage, idx) => (
          <React.Fragment key={stage.stepLabel}>
            <SdlcStageBox
              stage={stage}
              visible={isStepVisible(stage.stepNumber)}
              highlighted={isStepHighlighted(stage.stepNumber)}
              onMouseEnter={() => setHoveredStep(stage.stepNumber)}
              onMouseLeave={() => setHoveredStep(null)}
            />
            {idx < SDLC_STAGES.length - 1 && (
              <FlowingVerticalConnector
                direction="down"
                active={isFlowActive(stage.stepNumber)}
                flowDelay={`${idx * 0.2}s`}
                mobileOnly
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function WorkflowSection() {
  return (
    <section
      id="alur"
      className="relative isolate overflow-hidden bg-[#FAFBFD] dark:bg-[#030711] py-16 sm:py-22 lg:py-26 border-t border-[#E2E8F0] dark:border-blue-900/30"
    >
      {/* Aksen lengkung lembut di sudut kiri-atas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-[#E8F2FC]/80 dark:bg-blue-950/25 -z-10"
      />

      {/* Aksen lengkung berlapis di sudut kanan-bawah */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-[#E8F2FC]/85 dark:bg-blue-950/25 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-[#DCEBFA]/85 dark:bg-blue-900/20 -z-10"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1220px] px-6 sm:px-9 lg:px-14">
        <SectionHeaderTypewriter
          eyebrow="PROSES KERJA"
          line1="Alur Kerja Kami"
          line2Accent="Berbasis Metode SDLC"
          description="Dari ide hingga implementasi, kami mengikuti tahapan pengembangan yang terstruktur dan efisien."
          charsPerSecond={68}
          blockAccent
        />

        <SdlcInteractiveGrid />
      </div>
    </section>
  );
}
