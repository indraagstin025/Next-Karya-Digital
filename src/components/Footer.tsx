import React from "react";
import Link from "next/link";
import { ArrowRightIcon, InstagramLogoIcon } from "@radix-ui/react-icons";
import {
  DuotoneLocationPinIcon,
  DuotoneEnvelopeMailIcon,
  DuotoneClockScheduleIcon,
} from "@/components/ui/BrandIcons";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#F8FAFC] dark:bg-[#030711] border-t border-[#E2E8F0] dark:border-blue-900/40 pt-14 pb-10">
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_1fr_1fr] lg:gap-8">
          <div>
            <Link
              href="/"
              prefetch={false}
              className="inline-block transition-transform duration-200 hover:scale-[1.02]"
            >
              <img
                src="/logo/logo-gabungan-480.webp"
                srcSet="/logo/logo-gabungan-480.webp 480w, /logo/logo-gabungan-720.webp 720w"
                sizes="120px"
                width={260}
                height={82}
                alt="Next Karya Digital Solutions"
                loading="lazy"
                decoding="async"
                className="h-[36px] sm:h-[40px] w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-[340px] text-[13px] sm:text-[13.5px] leading-[1.7] text-[#4A5D78] dark:text-slate-300">
              Next Karya Digital Solutions adalah tim rekayasa perangkat lunak dan website
              yang berfokus pada arsitektur modern, performa tinggi, dan dampak
              pertumbuhan nyata bagi bisnis Anda.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 px-3.5 py-1.5 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#005090]" />
              <span className="text-[11.5px] font-semibold text-[#041E42] dark:text-slate-200">
                Mengakselerasi Inovasi, Mewujudkan Karya Digital
              </span>
            </div>

            <div className="mt-5 flex items-center gap-2.5">
              <span className="text-xs font-semibold text-[#4A5D78] dark:text-slate-400">
                Ikuti Kami:
              </span>
              <a
                href="https://www.instagram.com/nextkarya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Resmi Next Karya Digital Solutions @nextkarya"
                className="group inline-flex items-center gap-2 rounded-full border border-[#D5E6FC] bg-white px-3.5 py-1.5 text-xs font-bold text-[#005090] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#005090] hover:bg-[#F0F7FF] dark:border-slate-800 dark:bg-slate-900 dark:text-sky-300 dark:hover:border-sky-500"
              >
                <InstagramLogoIcon className="h-4 w-4 text-[#E1306C] transition-transform duration-200 group-hover:scale-110" />
                <span>@nextkarya</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#041E42] dark:text-white">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13.5px] font-medium text-[#4A5D78] dark:text-slate-300">
              {[
                { label: "Beranda", href: "/" },
                { label: "Tentang Kami", href: "/tentang-kami" },
                { label: "Layanan & Paket", href: "/layanan" },
                { label: "Portofolio", href: "/portofolio" },
                { label: "Blog & Artikel", href: "/blog" },
                { label: "Hubungi Kami", href: "/kontak" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-0.5 transition-all duration-200 hover:translate-x-1 hover:text-[#005090] dark:hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#041E42] dark:text-white">
              Layanan Utama
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13.5px] font-medium text-[#4A5D78] dark:text-slate-300">
              {[
                { label: "Pembuatan Website Bisnis", href: "/layanan" },
                { label: "Paket Layanan Website", href: "/layanan#paket-layanan" },
                { label: "Redesign & Optimalisasi Website", href: "/layanan" },
                { label: "Aplikasi Web & Dashboard Kustom", href: "/layanan" },
                { label: "Pengembangan Aplikasi Mobile", href: "/layanan" },
              ].map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="inline-block py-0.5 transition-all duration-200 hover:translate-x-1 hover:text-[#005090] dark:hover:text-blue-400"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#041E42] dark:text-white">
              Kontak Resmi
            </h3>
            <ul className="mt-4 space-y-3 text-[13.5px] text-[#4A5D78] dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <div className="shrink-0 mt-0.5">
                  <DuotoneLocationPinIcon className="h-7 w-7" />
                </div>
                <div>
                  <span className="block text-[11.5px] font-semibold text-[#4A5D78] dark:text-slate-400">
                    Alamat Studio &amp; Kantor
                  </span>
                  <a
                    href="https://maps.google.com/?q=Jl.+Karyawangi+No.+116,+Kec.+Parongpong,+Kabupaten+Bandung+Barat,+Jawa+Barat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block font-medium text-[12.5px] sm:text-[13px] leading-snug text-[#041E42] dark:text-slate-200 hover:text-[#005090] dark:hover:text-[#0986C8] hover:underline"
                  >
                    Jl. Karyawangi No. 116, Kec. Parongpong, Kabupaten Bandung Barat, Jawa Barat 40559
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="shrink-0 mt-0.5">
                  <DuotoneEnvelopeMailIcon className="h-7 w-7" />
                </div>
                <div>
                  <span className="block text-[11.5px] font-semibold text-[#4A5D78] dark:text-slate-400">
                    Email Konsultasi
                  </span>
                  <a
                    href="mailto:nextkarya@gmail.com"
                    className="font-bold text-[#005090] dark:text-[#0986C8] hover:underline"
                  >
                    nextkarya@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-4 w-4"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.889 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.488-8.414" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11.5px] font-semibold text-[#4A5D78] dark:text-slate-400">
                    WhatsApp Konsultasi
                  </span>
                  <a
                    href="https://wa.me/6283820117314"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#005090] dark:text-[#0986C8] hover:underline"
                  >
                    +62 838-2011-7314
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="shrink-0 mt-0.5">
                  <DuotoneClockScheduleIcon className="h-7 w-7" />
                </div>
                <div>
                  <span className="block text-[11.5px] font-semibold text-[#4A5D78] dark:text-slate-400">
                    Jam Operasional
                  </span>
                  <span className="font-semibold text-[#041E42] dark:text-slate-200">
                    Senin - Jumat, 09.00 - 18.00 WIB
                  </span>
                </div>
              </li>
            </ul>

            <div className="mt-5">
              <Link
                href="/kontak"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#005090] hover:bg-[#003E70] px-5 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_-4px_rgba(0,80,144,0.4)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>Mulai Diskusi Proyek</span>
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#D5E6FC] dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4A5D78] dark:text-slate-400">
          <p className="text-center sm:text-left font-medium">
            &copy; 2026 Next Karya Digital Solutions. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 font-medium">
            <Link
              href="/syarat-ketentuan"
              className="inline-flex min-h-11 items-center font-semibold text-[#003E70] underline-offset-2 hover:underline dark:text-[#0986C8]"
            >
              Syarat &amp; Ketentuan
            </Link>
            <span className="hidden sm:inline text-[#B8D0F0] dark:text-slate-700">
              &bull;
            </span>
            <Link
              href="/kebijakan-privasi"
              className="inline-flex min-h-11 items-center font-semibold text-[#003E70] underline-offset-2 hover:underline dark:text-[#0986C8]"
            >
              Kebijakan Privasi
            </Link>
            <span className="hidden sm:inline text-[#B8D0F0] dark:text-slate-700">
              &bull;
            </span>
            <a
              href="https://www.instagram.com/nextkarya"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Resmi Next Karya Digital Solutions"
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-[#003E70] underline-offset-2 hover:underline dark:text-[#0986C8]"
            >
              <InstagramLogoIcon className="h-4 w-4 text-[#E1306C]" />
              <span>Instagram</span>
            </a>
            <span className="hidden sm:inline text-[#B8D0F0] dark:text-slate-700">
              &bull;
            </span>
            <span>Tim Rekayasa Perangkat Lunak</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
