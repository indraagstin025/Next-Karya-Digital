import React from "react";
import Image from "next/image";
import { PersonIcon } from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ABOUT_APPROACH_ITEMS } from "../data/aboutData";

export function AboutProfile() {
  return (
    <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14 grid items-stretch gap-10 lg:grid-cols-2 lg:gap-12">
      {/* Kolom Kiri: Badge, Judul, Deskripsi, dan Foto Tim */}
      <ScrollReveal direction="left" className="h-full flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#005090] px-3.5 py-1 text-white shadow-sm w-fit">
            <span className="h-2 w-2 rounded-full bg-white shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-white">
              TENTANG TIM KAMI
            </span>
          </div>

          <h2 className="mt-4 text-[25px] sm:text-[30px] lg:text-[33px] font-extrabold leading-[1.22] tracking-[-0.02em] text-[#041E42] dark:text-white">
            Kami tidak sekadar membuat website.
            <br className="hidden sm:inline" />{" "}
            Kami membuat website yang{" "}
            <span className="text-[#005090] dark:text-[#0986C8]">
              bekerja untuk bisnis Anda.
            </span>
          </h2>

          <p className="mt-3.5 text-[13.5px] sm:text-[14.5px] leading-[1.7] text-[#4A5D78] dark:text-slate-300">
            Bayangkan calon pelanggan menemukan bisnis Anda di Google, langsung paham apa yang Anda tawarkan, dan langsung menghubungi Anda, tanpa bingung dan tanpa menunggu loading lama. Itulah yang kami bangun, untuk UMKM, perusahaan, dan organisasi.
          </p>
        </div>

        <div className="relative mt-6 sm:mt-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#005090]/10 via-[#0986C8]/10 to-transparent blur-xl -z-10"
          />
          <div className="group relative w-full overflow-hidden rounded-[22px] border-[4px] border-white dark:border-slate-800 bg-white shadow-[0_18px_42px_-10px_rgba(10,35,80,0.13)] transition-all duration-300 hover:shadow-[0_24px_50px_-10px_rgba(0,80,144,0.18)]">
            <Image
              src="/team-naikon.jpg"
              alt="Tim programmer Next Karya Digital Solutions berkolaborasi merancang arsitektur sistem"
              width={960}
              height={680}
              className="h-[210px] sm:h-[235px] lg:h-[230px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />

            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-[400px] rounded-xl border border-white/40 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 shadow-[0_10px_25px_-5px_rgba(10,35,80,0.18)] flex items-center gap-3 transition-transform duration-300 group-hover:-translate-y-0.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#005090] text-white shadow-xs">
                <PersonIcon className="h-4.5 w-4.5" />
              </div>
              <div className="h-7 w-[1px] bg-[#CBD5E1] dark:bg-slate-700 shrink-0" />
              <div>
                <p className="text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.05em] text-[#005090] dark:text-[#0986C8]">
                  Bukan Sekadar Vendor, Tapi Mitra Pertumbuhan Anda
                </p>
                <p className="text-[11px] leading-tight text-[#4A5D78] dark:text-slate-300 font-normal">
                  Tim kami mendampingi bisnis Anda jauh setelah website dirilis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Kolom Kanan: 4 Card Keunggulan dalam Grid 2x2 yang Sejajar */}
      <ScrollReveal direction="right" className="h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-3.5 sm:gap-4.5 h-full">
          {ABOUT_APPROACH_ITEMS.map((item) => (
            <div
              key={item.title}
              className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900/90 border border-[#E2E8F0] dark:border-slate-800 p-4.5 sm:p-5 shadow-[0_4px_18px_-4px_rgba(0,40,87,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#005090] hover:shadow-[0_14px_30px_-8px_rgba(0,80,144,0.14)]"
            >
              <div>
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#005090] to-[#002857] text-white shadow-xs transition-transform duration-300 group-hover:scale-105 mb-3.5">
                  {item.icon}
                </div>
                <h3 className="text-[13.5px] sm:text-[14.5px] font-bold text-[#041E42] dark:text-white transition-colors duration-200 group-hover:text-[#005090] dark:group-hover:text-[#0986C8] leading-snug min-h-[44px] flex items-center">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-[12.5px] leading-[1.65] text-[#4A5D78] dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
