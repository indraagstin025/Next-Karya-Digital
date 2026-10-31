import React from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CONTACT_CHANNELS } from "../data/contactData";

export function ContactInfoList() {
  return (
    <ScrollReveal direction="left">
      <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#041E42] dark:text-white">
        Saluran Komunikasi Resmi
      </h2>
      <p className="mt-2.5 text-[13.5px] sm:text-[14.5px] leading-[1.7] text-[#4A5D78] dark:text-slate-300">
        Tim kami siap mendampingi mulai dari tahap pemetaan kebutuhan bisnis,
        perancangan arsitektur sistem, hingga estimasi anggaran yang transparan.
      </p>

      <div className="mt-7 space-y-4">
        {CONTACT_CHANNELS.map((item, idx) => (
          <ScrollReveal key={item.title} delayMs={idx * 75}>
            <div className="group flex items-center gap-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-4 sm:p-5 shadow-[0_12px_32px_-10px_rgba(10,35,80,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#005090] dark:hover:border-blue-500 hover:shadow-[0_18px_38px_-10px_rgba(0,80,144,0.14)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#005090] text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#4A5D78] dark:text-slate-400">
                  {item.title}
                </p>
                {item.isLink && item.linkHref ? (
                  <a
                    href={item.linkHref}
                    target={item.linkHref.startsWith("http") ? "_blank" : undefined}
                    rel={item.linkHref.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="mt-0.5 inline-block text-[13.5px] sm:text-[14.5px] font-bold text-[#005090] dark:text-[#0986C8] hover:underline"
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className="mt-0.5 text-[14px] sm:text-[15px] font-bold text-[#041E42] dark:text-white">
                    {item.content}
                  </p>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </ScrollReveal>
  );
}
