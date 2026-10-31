"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HamburgerMenuIcon,
  Cross1Icon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Layanan", href: "/layanan" },
  { label: "Portofolio", href: "/portofolio" },
  { label: "Blog", href: "/blog" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#030711]/95 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(10,30,63,0.08)] border-b border-slate-200/80 dark:border-blue-900/40"
          : "bg-transparent border-b border-transparent"
      }`}
      suppressHydrationWarning
    >
      <div className="mx-auto flex md:grid md:grid-cols-[1fr_auto_1fr] w-full max-w-[1240px] min-h-[68px] lg:min-h-[76px] items-center justify-between gap-4 px-6 sm:px-9 lg:px-14 py-2">
        <Link
          href="/"
          className="flex min-w-0 items-center justify-self-start transition-transform hover:opacity-95 active:scale-[0.98] group shrink-0"
          aria-label="Next Karya Digital Solutions, kembali ke beranda"
        >
          <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-[1.04]">
            <Image
              src="/logo/single-logo.png"
              alt="Next Karya Digital Solutions"
              width={120}
              height={92}
              priority
              className="h-[34px] sm:h-[38px] md:h-[42px] w-auto object-contain"
            />
          </div>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center justify-self-center gap-6 lg:gap-8 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`canva-link relative py-1.5 text-[13px] lg:text-[13.5px] transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:rounded-full after:bg-[#005090] after:transition-transform after:duration-200 ${
                  active
                    ? "font-semibold text-[#005090] after:scale-x-100"
                    : "font-medium text-[#0A1E3F] dark:text-slate-200 hover:text-[#005090] after:scale-x-0 hover:after:scale-x-100 after:origin-left"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center justify-self-end gap-2.5">
          <Link
            href="/kontak"
            className="group hidden sm:inline-flex min-h-11 items-center gap-2 rounded-full bg-[#005090] hover:bg-[#003E70] text-white px-5 py-2 text-[13px] font-semibold shadow-[0_8px_20px_-4px_rgba(0,80,144,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-4px_rgba(0,80,144,0.55)] active:scale-[0.98]"
          >
            <span>Hubungi Kami</span>
            <ArrowRightIcon
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          <button
            id="menu-toggle"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="theme-menu-button inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-[#041E42] dark:text-white transition-transform active:scale-95 md:hidden"
            aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <Cross1Icon className="w-5 h-5" aria-hidden="true" />
            ) : (
              <HamburgerMenuIcon className="w-5 h-5" aria-hidden="true" />
            )}
            <span>Menu</span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Navigasi mobile"
          className="mobile-nav nk-card-enter border-t border-slate-200 dark:border-slate-800 py-5 md:hidden bg-white dark:bg-[#030711]"
        >
          <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`canva-link flex min-h-11 items-center rounded-xl px-3 text-base transition-colors ${
                    active
                      ? "bg-[#005090] font-semibold text-white"
                      : "nav-link theme-text font-medium text-[#041E42] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/kontak"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#005090] hover:bg-[#003E70] px-6 py-3 text-base font-semibold text-white shadow-md active:scale-[0.98]"
            >
              <span>Hubungi Kami</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
