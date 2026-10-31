import React from "react";
import Image from "next/image";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { WORKFLOW_STEPS } from "../data/homeData";

export function WorkflowSection() {
  return (
    <section
      id="alur"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EFF6FB] dark:from-[#030711] dark:via-[#061231] dark:to-[#08183A] py-16 sm:py-20 lg:py-24 border-t border-[#E2E8F0] dark:border-blue-900/30"
    >
      <svg
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-[180px] w-[180px] sm:h-[230px] sm:w-[230px] -z-10"
      >
        <circle
          cx="245"
          cy="15"
          r="135"
          fill="#0986C8"
          fillOpacity="0.05"
          className="dark:opacity-15"
        />
        <circle
          cx="245"
          cy="15"
          r="164"
          stroke="#005090"
          strokeOpacity="0.25"
          strokeWidth="1.3"
        />
        <circle cx="115.8" cy="116" r="5.5" fill="#005090" />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14">
        <ScrollReveal className="text-center max-w-[740px] mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#005090] px-3.5 py-1 text-white shadow-sm mb-3">
            <span className="h-2 w-2 rounded-full bg-white shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-white">
              PROSES KERJA
            </span>
          </div>
          <h2 className="mt-2 text-[26px] sm:text-[34px] lg:text-[38px] font-extrabold leading-[1.18] tracking-[-0.02em] text-[#041E42] dark:text-white">
            Tahapan kerja terstruktur dari{" "}
            <span className="text-[#005090] dark:text-[#0986C8]">perencanaan</span>{" "}
            hingga{" "}
            <span className="text-[#005090] dark:text-[#0986C8]">peluncuran</span>
          </h2>
          <p className="mx-auto mt-3.5 max-w-[650px] text-[13.5px] sm:text-[14.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
            Tim kami menerapkan alur kerja yang transparan agar setiap proyek selesai
            tepat waktu dengan kualitas kode yang teruji.
          </p>
        </ScrollReveal>

        <div className="mt-10 sm:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STEPS.map((step, idx) => (
            <ScrollReveal key={step.stepNumber} delayMs={idx * 80} className="h-full">
              <article className="group relative overflow-hidden h-full flex flex-col justify-between rounded-[26px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-5 sm:p-5.5 shadow-[0_12px_36px_-10px_rgba(10,35,80,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#005090] dark:hover:border-[#0986C8] hover:shadow-[0_22px_48px_-10px_rgba(0,80,144,0.16)]">
                <div>
                  {/* Card Header: Badge Tahap & Nomor Langkah di dalam card */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full bg-[#005090] text-white px-3 py-1 text-[11px] font-bold shadow-xs tracking-wider uppercase">
                      {step.badge}
                    </span>
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-[#041E42] dark:text-slate-200 px-2.5 py-1 text-[11px] font-extrabold border border-slate-200/80 dark:border-slate-700 shadow-xs">
                      {step.stepNumber}
                    </span>
                  </div>

                  {/* 2D Cartoon Illustration Box (Bersih tanpa badge di dalam foto) */}
                  <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gradient-to-b from-[#F4F8FC] to-[#E5F0FA] dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 mb-5">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={512}
                      height={512}
                      className="h-full w-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-108 group-hover:-rotate-1"
                    />
                  </div>

                  <h3 className="text-[16px] sm:text-[17px] font-extrabold tracking-[-0.015em] text-[#041E42] dark:text-white transition-colors duration-200 group-hover:text-[#005090] dark:group-hover:text-[#0986C8] leading-snug min-h-[44px] flex items-center">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[12.5px] sm:text-[13px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
                    {step.description}
                  </p>

                  {/* Output Highlight Callout Box */}
                  <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200/80 dark:border-slate-700/60">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#005090] dark:text-[#0986C8]">
                      <CheckCircledIcon className="h-3.5 w-3.5 text-[#005090] dark:text-[#0986C8] shrink-0" />
                      <span>Output-nya:</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[#4A5D78] dark:text-slate-300 font-medium">
                      {step.output}
                    </p>
                  </div>
                </div>

                {/* Footer Milestone */}
                <div className="mt-5 pt-3.5 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between text-[11.5px] font-semibold text-[#005090] dark:text-[#0986C8]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircledIcon className="h-3.5 w-3.5 shrink-0 text-[#005090] dark:text-[#0986C8]" />
                    {step.milestone}
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-[#005090] via-[#0986C8] to-[#002857] transition-all duration-400 group-hover:w-full"
                />
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
