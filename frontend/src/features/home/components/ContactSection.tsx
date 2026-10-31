import React from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { GoogleMapsEmbed } from "@/components/GoogleMapsEmbed";
import { CONTACT_INFO_ITEMS } from "../data/homeData";
import { ConsultationForm } from "./ConsultationForm";

export function ContactSection() {
  return (
    <section
      id="kontak"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#EFF6FB] via-[#F8FAFC] to-[#FFFFFF] dark:from-[#030711] dark:via-[#061231] dark:to-[#08183A] py-16 sm:py-20 lg:py-24 border-t border-[#E2E8F0] dark:border-blue-900/30"
    >
      <svg
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[180px] w-[180px] sm:h-[230px] sm:w-[230px] -z-10"
      >
        <circle
          cx="15"
          cy="245"
          r="135"
          fill="#005090"
          fillOpacity="0.05"
          className="dark:opacity-15"
        />
        <circle
          cx="15"
          cy="245"
          r="164"
          stroke="#005090"
          strokeOpacity="0.25"
          strokeWidth="1.3"
        />
        <circle cx="147.7" cy="148.6" r="5.5" fill="#0986C8" />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14 grid items-start gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
        <ScrollReveal direction="left">
          <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.24em] text-[#005090] dark:text-[#0986C8]">
            HUBUNGI TIM KAMI
          </p>
          <h2 className="mt-3 text-[26px] sm:text-[34px] lg:text-[38px] font-extrabold leading-[1.18] tracking-[-0.02em] text-[#041E42] dark:text-white">
            Siap mendiskusikan{" "}
            <span className="text-[#005090] dark:text-[#0986C8]">
              rencana digital
            </span>{" "}
            Anda?
          </h2>
          <p className="mt-3.5 text-[13.5px] sm:text-[14.5px] leading-[1.7] text-[#4A5D78] dark:text-slate-300">
            Ceritakan kebutuhan website atau sistem yang ingin Anda kembangkan. Tim kami
            akan meninjau spesifikasi Anda dan memberikan estimasi solusi serta langkah
            awal dalam 1x24 jam kerja.
          </p>

          <div className="mt-8 space-y-4">
            {CONTACT_INFO_ITEMS.map((item, idx) => (
              <ScrollReveal key={item.title} delayMs={idx * 70}>
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
                      <p className="mt-0.5 text-[13.5px] sm:text-[15px] font-bold text-[#041E42] dark:text-white">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delayMs={100}>
          <ConsultationForm />
        </ScrollReveal>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14 mt-12 sm:mt-16">
        <ScrollReveal direction="up" delayMs={120}>
          <GoogleMapsEmbed />
        </ScrollReveal>
      </div>
    </section>
  );
}
