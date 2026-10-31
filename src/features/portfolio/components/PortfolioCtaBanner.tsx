import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function PortfolioCtaBanner() {
  return (
    <ScrollReveal delayMs={120}>
      <div className="mt-12 rounded-[24px] bg-gradient-to-r from-[#002857] via-[#013565] to-[#01427C] border border-[#014F90] p-8 sm:p-10 shadow-[0_18px_42px_-10px_rgba(0,40,87,0.35)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-[20px] sm:text-[22px] font-extrabold text-white">
            Ingin mendiskusikan rancangan proyek serupa untuk bisnis Anda?
          </h3>
          <p className="mt-1.5 text-[13.5px] sm:text-[14px] text-slate-200">
            Tim kami siap membantu memetakan kebutuhan fitur dan estimasi pengerjaan
            secara transparan.
          </p>
        </div>
        <Link
          href="/kontak"
          className="group shrink-0 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#005090] hover:bg-[#003E70] px-6 py-3 text-[13.5px] font-bold text-white shadow-[0_10px_25px_-5px_rgba(0,80,144,0.45)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <span>Konsultasikan Proyek</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </ScrollReveal>
  );
}
