import React from "react";
import Image from "next/image";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SERVICE_WORKFLOW_STEPS } from "../data/servicesData";

export function ServiceWorkflow() {
  return (
    <div className="mt-20 pt-16 border-t border-[#E2E8F0] dark:border-slate-800">
      <ScrollReveal className="text-center max-w-[680px] mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#005090] px-3.5 py-1 text-white shadow-sm mb-3">
          <span className="h-2 w-2 rounded-full bg-white shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-white">
            PROSES KERJA
          </span>
        </div>
        <h2 className="mt-2.5 text-[24px] sm:text-[32px] font-extrabold text-[#041E42] dark:text-white">
          Tahapan kerja dari{" "}
          <span className="text-[#005090] dark:text-[#0986C8]">perencanaan</span> hingga{" "}
          <span className="text-[#005090] dark:text-[#0986C8]">peluncuran</span>
        </h2>
      </ScrollReveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICE_WORKFLOW_STEPS.map((item, idx) => (
          <ScrollReveal key={item.step} delayMs={idx * 80} className="h-full">
            <article className="group relative overflow-hidden h-full flex flex-col justify-between rounded-[26px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-5 sm:p-5.5 shadow-[0_12px_36px_-10px_rgba(10,35,80,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#005090] dark:hover:border-[#0986C8] hover:shadow-[0_22px_48px_-10px_rgba(0,80,144,0.16)]">
              <div>
                {/* Header: Badge Tahap & Nomor */}
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-[#005090] text-white px-3 py-1 text-[11px] font-bold shadow-xs tracking-wider uppercase">
                    {item.step}
                  </span>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-[#041E42] dark:text-slate-200 px-2.5 py-1 text-[11px] font-extrabold border border-slate-200/80 dark:border-slate-700 shadow-xs">
                    {item.stepNumber}
                  </span>
                </div>

                {/* 2D Cartoon Illustration Box */}
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gradient-to-b from-[#F4F8FC] to-[#E5F0FA] dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 mb-5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={512}
                    height={512}
                    className="h-full w-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-108 group-hover:-rotate-1"
                  />
                </div>

                <h3 className="text-[16px] sm:text-[17px] font-extrabold tracking-[-0.015em] text-[#041E42] dark:text-white transition-colors duration-200 group-hover:text-[#005090] dark:group-hover:text-[#0986C8] leading-snug min-h-[44px] flex items-center">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[12.5px] sm:text-[13px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
                  {item.desc}
                </p>

                {/* Output Highlight Callout Box */}
                <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#005090] dark:text-[#0986C8]">
                    <CheckCircledIcon className="h-3.5 w-3.5 text-[#005090] dark:text-[#0986C8] shrink-0" />
                    <span>Output-nya:</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#4A5D78] dark:text-slate-300 font-medium">
                    {item.output}
                  </p>
                </div>
              </div>

              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-[#005090] via-[#0986C8] to-[#002857] transition-all duration-400 group-hover:w-full mt-4"
              />
            </article>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
