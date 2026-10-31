import React from "react";
import Link from "next/link";
import { CheckCircledIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ABOUT_VALUE_CARDS } from "../data/aboutData";

export function AboutValues() {
  return (
    <div className="mx-auto mt-16 w-full max-w-[1240px] px-6 sm:px-9 lg:px-14">
      <div className="grid gap-6 md:grid-cols-3">
        {ABOUT_VALUE_CARDS.map((card, idx) => (
          <ScrollReveal key={card.title} delayMs={idx * 80} className="h-full">
            <article className="group h-full rounded-[24px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-7 shadow-[0_14px_38px_-10px_rgba(10,35,80,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#005090] dark:hover:border-blue-500 hover:shadow-[0_22px_46px_-10px_rgba(0,80,144,0.15)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#005090] text-white shadow-sm mb-4 transition-transform duration-300 group-hover:scale-110">
                {card.icon}
              </div>
              <h3 className="text-[18px] font-extrabold text-[#041E42] dark:text-white transition-colors duration-200 group-hover:text-[#005090] dark:group-hover:text-[#0986C8]">
                {card.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
                {card.description}
              </p>
            </article>
          </ScrollReveal>
        ))}

        <ScrollReveal delayMs={160} className="h-full">
          <article className="group h-full rounded-[24px] bg-gradient-to-r from-[#002857] via-[#013565] to-[#01427C] border border-[#014F90] p-6 sm:p-7 shadow-[0_18px_42px_-10px_rgba(0,40,87,0.35)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#005090] text-white shadow-sm mb-4 transition-transform duration-300 group-hover:scale-110">
                <CheckCircledIcon className="h-6 w-6" />
              </div>
              <h3 className="text-[18px] font-extrabold text-white">
                Siap Berkolaborasi?
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.68] text-slate-200">
                Diskusikan rencana pengembangan website atau sistem internal bisnis
                Anda bersama tim teknis Next Karya.
              </p>
            </div>
            <div className="mt-5">
              <Link
                href="/kontak"
                className="group/link inline-flex items-center gap-2 text-[13.5px] font-bold text-[#0986C8] hover:text-white"
              >
                <span>Hubungi Tim Kami</span>
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1.5" />
              </Link>
            </div>
          </article>
        </ScrollReveal>
      </div>
    </div>
  );
}
