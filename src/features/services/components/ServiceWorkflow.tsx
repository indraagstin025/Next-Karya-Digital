import React from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  SDLC_STAGES,
  getGridDividerClasses,
} from "@/features/home/components/WorkflowSection";

export function ServiceWorkflow() {
  return (
    <div className="mt-20 pt-16 border-t border-[#E2E8F0] dark:border-slate-800">
      <ScrollReveal priority className="text-center max-w-[720px] mx-auto">
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

        <h2 className="mt-1 text-[26px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.16] tracking-[-0.02em] text-[#072146] dark:text-white">
          Alur Kerja Kami
          <span className="block text-[#0052B4] dark:text-[#38BDF8]">
            Berbasis Metode SDLC
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-[610px] text-[14px] sm:text-[15.5px] leading-[1.65] text-[#4A5D78] dark:text-slate-300">
          Dari ide hingga implementasi, kami mengikuti tahapan pengembangan yang
          terstruktur dan efisien.
        </p>
      </ScrollReveal>

      <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
