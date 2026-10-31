import React from "react";
import Link from "next/link";
import {
  CheckCircledIcon,
  ArrowRightIcon,
  BarChartIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { PublicPricingPlanDTO } from "@/lib/public-content";
import { toPricingPlans } from "@/lib/live-content-adapters";

export function ServicePricing({ plans }: { plans?: PublicPricingPlanDTO[] | null }) {
  const PRICING_PLANS = toPricingPlans(plans);
  return (
    <div id="paket-layanan" className="mt-20 pt-16 border-t border-[#E2E8F0] dark:border-slate-800 scroll-mt-24">
      <ScrollReveal className="text-center max-w-[760px] mx-auto">
        <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.24em] text-[#005090] dark:text-[#0986C8]">
          DAFTAR PAKET &amp; INVESTASI
        </p>
        <h2 className="mt-3 text-[26px] sm:text-[34px] lg:text-[38px] font-extrabold leading-[1.18] tracking-[-0.02em] text-[#041E42] dark:text-white">
          Pilihan paket solusi website terukur{" "}
          <br className="hidden sm:inline" />
          untuk{" "}
          <span className="text-[#005090] dark:text-[#0986C8]">
            kebutuhan bisnis Anda
          </span>
        </h2>
        <p className="mx-auto mt-3.5 max-w-[680px] text-[13.5px] sm:text-[14.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
          Estimasi biaya awal transparan tanpa batasan kaku jumlah section, dan sudah
          termasuk Dashboard Analitik buatan tim Next Karya untuk memantau kunjungan secara
          mandiri.
        </p>
      </ScrollReveal>

      <div className="mt-12 sm:mt-14 grid gap-6 lg:gap-7 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {PRICING_PLANS.map((plan, idx) => (
          <ScrollReveal key={plan.id} delayMs={idx * 70} className="h-full">
            <article
              className={`group relative h-full flex flex-col justify-between rounded-[26px] p-6 sm:p-7 transition-all duration-300 ${
                plan.isRecommended
                  ? "bg-white dark:bg-slate-900 border-2 border-[#005090] shadow-[0_22px_50px_-12px_rgba(0,80,144,0.22)] lg:-translate-y-1.5 hover:-translate-y-3 hover:shadow-[0_28px_60px_-12px_rgba(0,80,144,0.3)]"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_14px_38px_-10px_rgba(10,35,80,0.06)] hover:-translate-y-2 hover:border-[#005090] dark:hover:border-blue-500 hover:shadow-[0_22px_48px_-12px_rgba(0,80,144,0.16)]"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className={`inline-block whitespace-nowrap rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-wider transition-transform duration-300 group-hover:scale-105 ${
                      plan.isRecommended
                        ? "bg-[#005090] text-white shadow-md"
                        : "bg-[#041E42] text-white shadow-sm dark:bg-slate-800 dark:border dark:border-slate-700 dark:text-[#0986C8]"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-[19px] sm:text-[21px] font-extrabold text-[#041E42] dark:text-white transition-colors duration-200 group-hover:text-[#005090] dark:group-hover:text-[#0986C8]">
                  {plan.name}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#4A5D78] dark:text-slate-300 min-h-[44px]">
                  {plan.description}
                </p>

                <div className="mt-5 pt-4 pb-5 border-y border-[#E2E8F0] dark:border-slate-800">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-[#4A5D78] dark:text-slate-400">
                    {plan.priceLabel}
                  </span>
                  <div className="mt-1 text-[26px] sm:text-[28px] font-extrabold text-[#005090] dark:text-[#0986C8] tracking-tight transition-transform duration-300 origin-left group-hover:scale-[1.02]">
                    {plan.price}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#041E42] dark:text-slate-200">
                    Fitur &amp; Cakupan Layanan:
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-[12.5px] sm:text-[13px] text-[#4A5D78] dark:text-slate-300"
                      >
                        <CheckCircledIcon className="h-4 w-4 shrink-0 text-[#005090] dark:text-[#0986C8] mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-7 pt-4">
                <Link
                  href={plan.ctaHref}
                  className={`group/btn inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13px] sm:text-[13.5px] font-bold transition-all duration-200 active:scale-[0.98] ${
                    plan.isRecommended
                      ? "bg-[#005090] text-white shadow-[0_10px_25px_-5px_rgba(0,80,144,0.45)] hover:bg-[#003E70]"
                      : "bg-slate-100 text-[#041E42] hover:bg-[#005090] hover:text-white border border-slate-200 hover:border-[#005090] dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-[#005090]"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delayMs={120}>
        <div className="mt-12 rounded-[26px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-7 sm:p-9 shadow-[0_14px_38px_-10px_rgba(10,35,80,0.06)] transition-all duration-300 hover:border-[#005090] grid gap-6 md:grid-cols-2 items-center">
          <div className="flex items-start gap-4 group">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#005090] text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
              <BarChartIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[#041E42] dark:text-white">
                Termasuk Dashboard Analitik Next Karya
              </h3>
              <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-[#4A5D78] dark:text-slate-300">
                Setiap paket website sudah dilengkapi modul pelacakan performa agregat tanpa
                cookie pelacak. Pantau angka pengunjung unik, halaman terpopuler, hingga
                jumlah klik tombol WhatsApp secara real-time.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 md:border-l md:border-slate-200 md:dark:border-slate-800 md:pl-6 group">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#005090] text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
              <ChatBubbleIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[#041E42] dark:text-white">
                Butuh Sistem atau Fitur Kustom?
              </h3>
              <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-[#4A5D78] dark:text-slate-300">
                Harga di atas merupakan estimasi awal yang fleksibel sesuai ruang lingkup
                proyek. Untuk pengembangan sistem informasi internal, desain UI/UX, atau
                penambahan fitur khusus, diskusikan langsung bersama tim kami.
              </p>
              <div className="mt-3">
                <Link
                  href="/kontak"
                  className="group/link inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#005090] dark:text-[#0986C8] hover:text-[#003E70]"
                >
                  <span>Konsultasikan Kebutuhan Kustom</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
