"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PlusIcon, MinusIcon, ArrowRightIcon, ChatBubbleIcon } from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { PublicFaqDTO } from "@/lib/public-content";
import { toFaqItems } from "@/lib/live-content-adapters";

export function FaqSection({ faqs }: { faqs?: PublicFaqDTO[] | null }) {
  const FAQ_ITEMS = toFaqItems(faqs);
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EFF6FB] dark:from-[#030711] dark:via-[#061231] dark:to-[#08183A] py-16 sm:py-20 lg:py-24 border-t border-[#E2E8F0] dark:border-blue-900/30"
    >
      <svg
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-[180px] w-[180px] sm:h-[230px] sm:w-[230px] -z-10"
      >
        <circle
          cx="250"
          cy="250"
          r="130"
          fill="#005090"
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
        <circle cx="106.8" cy="183.2" r="5.5" fill="#0986C8" />
      </svg>
      <div className="relative z-10 mx-auto w-full max-w-[980px] px-6 sm:px-9 lg:px-14">
        <ScrollReveal className="text-center max-w-[700px] mx-auto">
          <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.24em] text-[#005090] dark:text-[#0986C8]">
            PERTANYAAN UMUM (FAQ)
          </p>
          <h2 className="mt-3 text-[26px] sm:text-[34px] lg:text-[38px] font-extrabold leading-[1.18] tracking-[-0.02em] text-[#041E42] dark:text-white">
            Hal yang sering ditanyakan{" "}
            <br className="hidden sm:inline" />
            seputar{" "}
            <span className="text-[#005090] dark:text-[#0986C8]">
              proyek dan kolaborasi
            </span>
          </h2>
          <p className="mx-auto mt-3.5 max-w-[620px] text-[13.5px] sm:text-[14.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
            Jawaban transparan mengenai durasi pengerjaan, garansi teknis, kesiapan materi,
            serta tata cara memulai proyek bersama tim Next Karya.
          </p>
        </ScrollReveal>

        <div className="mt-12 space-y-3.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openId === item.id;
            const panelId = `faq-panel-${item.id}`;
            return (
              <ScrollReveal key={item.id} delayMs={idx * 55}>
                <div
                  className={`overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border shadow-[0_8px_24px_-8px_rgba(10,35,80,0.05)] transition-all duration-300 ${
                    isOpen
                      ? "border-[#005090] shadow-[0_14px_34px_-10px_rgba(0,80,144,0.14)]"
                      : "border-[#E2E8F0] dark:border-slate-800 hover:border-[#005090] dark:hover:border-blue-500"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                  >
                    <span
                      className={`text-[15px] sm:text-[16px] font-bold transition-colors ${
                        isOpen
                          ? "text-[#005090] dark:text-[#0986C8]"
                          : "text-[#041E42] dark:text-white group-hover:text-[#005090] dark:group-hover:text-[#0986C8]"
                      }`}
                    >
                      {item.question}
                    </span>
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#005090] text-white shadow-sm transition-transform duration-300 ${
                        isOpen ? "rotate-180 scale-105" : "group-hover:scale-105"
                      }`}
                    >
                      {isOpen ? (
                        <MinusIcon className="h-4 w-4" />
                      ) : (
                        <PlusIcon className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-6 sm:px-6 pt-2 text-[13.5px] leading-[1.75] text-[#4A5D78] dark:text-slate-300 border-t border-[#F0F5FD] dark:border-slate-800">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delayMs={120}>
          <div className="mt-12 rounded-[24px] bg-[#FFFFFF] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all duration-300 hover:border-[#005090]">
            <div className="flex items-center gap-3.5 group">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#005090] text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                <ChatBubbleIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[15px] sm:text-base font-bold text-[#041E42] dark:text-white">
                  Masih memiliki pertanyaan teknis lainnya?
                </h3>
                <p className="text-xs sm:text-[13px] text-[#4A5D78] dark:text-slate-300">
                  Tim rekayasa Next Karya siap berdiskusi langsung sesuai kebutuhan unik bisnis Anda.
                </p>
              </div>
            </div>
            <Link
              href="/kontak"
              className="group shrink-0 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#005090] hover:bg-[#003E70] px-5 py-2.5 text-xs sm:text-[13px] font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>Hubungi Kami</span>
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
