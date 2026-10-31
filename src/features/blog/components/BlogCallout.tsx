import React from "react";
import Link from "next/link";
import { ReaderIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function BlogCallout() {
  return (
    <ScrollReveal delayMs={120}>
      <div className="mt-12 rounded-[24px] bg-[#FFFFFF] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 hover:border-[#005090] dark:hover:border-blue-500">
        <div className="flex items-start sm:items-center gap-4 group">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#005090] text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
            <ReaderIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[#041E42] dark:text-white">
              Ada pertanyaan teknis dari artikel kami?
            </h3>
            <p className="mt-1 text-[13px] sm:text-[13.5px] text-[#4A5D78] dark:text-slate-300">
              Ceritakan kebutuhan website atau sistem Anda, tim Next Karya akan membahasnya bersama Anda.
            </p>
          </div>
        </div>
        <Link
          href="/kontak"
          className="group shrink-0 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#005090] hover:bg-[#003E70] px-5 py-2.5 text-xs sm:text-[13px] font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <span>Diskusi Langsung</span>
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </ScrollReveal>
  );
}
