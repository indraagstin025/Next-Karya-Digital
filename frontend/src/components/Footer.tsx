import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SewingPinIcon,
  EnvelopeClosedIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#F8FAFC] dark:bg-[#030711] border-t border-[#E2E8F0] dark:border-blue-900/40 pt-14 pb-10">
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_1fr_1fr] lg:gap-8">
          <div>
            <Link
              href="/"
              className="inline-block transition-transform duration-200 hover:scale-[1.02]"
            >
              <Image
                src="/logo/logo-gabungan.png"
                alt="Next Karya Digital Solutions"
                width={260}
                height={82}
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
                { label: "Paket Harga Website", href: "/layanan#paket-layanan" },
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
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#005090] text-white mt-0.5">
                  <SewingPinIcon className="h-3.5 w-3.5" />
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
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#005090] text-white mt-0.5">
                  <EnvelopeClosedIcon className="h-3.5 w-3.5" />
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
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#005090] text-white mt-0.5">
                  <ClockIcon className="h-3.5 w-3.5" />
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
              href="/kebijakan-privasi"
              className="inline-flex min-h-11 items-center font-semibold text-[#003E70] underline-offset-2 hover:underline dark:text-[#0986C8]"
            >
              Kebijakan Privasi
            </Link>
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
