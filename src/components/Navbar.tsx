"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 15 15"
      width="15"
      height="15"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 15 15"
      width="15"
      height="15"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1 2.75C1 2.33579 1.33579 2 1.75 2H13.25C13.6642 2 14 2.33579 14 2.75C14 3.16421 13.6642 3.5 13.25 3.5H1.75C1.33579 3.5 1 3.16421 1 2.75ZM1 7.75C1 7.33579 1.33579 7 1.75 7H13.25C13.6642 7 14 7.33579 14 7.75C14 8.16421 13.6642 8.5 13.25 8.5H1.75C1.33579 8.5 1 8.16421 1 7.75ZM1.75 12C1.33579 12 1 12.3358 1 12.75C1 13.1642 1.33579 13.5 1.75 13.5H13.25C13.6642 13.5 14 13.1642 14 12.75C14 12.3358 13.6642 12 13.25 12H1.75Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 15 15"
      width="15"
      height="15"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2.14645 2.14645C2.34171 1.95118 2.65829 1.95118 2.85355 2.14645L7.5 6.79289L12.1464 2.14645C12.3417 1.95118 12.6583 1.95118 12.8536 2.14645C13.0488 2.34171 13.0488 2.65829 12.8536 2.85355L8.20711 7.5L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L7.5 8.20711L2.85355 12.8536C2.65829 13.0488 2.34171 13.0488 2.14645 12.8536C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L6.79289 7.5L2.14645 2.85355C1.95118 2.65829 1.95118 2.34171 2.14645 2.14645Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

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
  const [alertBanner, setAlertBanner] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadStatus = () => {
      fetch("/api/cms/site-status", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((payload) => {
          if (
            active &&
            payload?.success &&
            payload?.data?.isAlertActive &&
            typeof payload?.data?.alertBanner === "string" &&
            payload.data.alertBanner.trim().length > 0
          ) {
            setAlertBanner(payload.data.alertBanner.trim());
          } else if (active) {
            setAlertBanner(null);
          }
        })
        .catch(() => {
          // non-blocking
        });
    };

    // Banner layanan tidak mendesak; jalankan setelah halaman sempat idle.
    const handle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(loadStatus, { timeout: 2500 })
        : window.setTimeout(loadStatus, 1500);

    return () => {
      active = false;
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle);
      }
    };
  }, [pathname]);

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
          ? "bg-white dark:bg-[#030711] shadow-[0_4px_20px_-4px_rgba(10,30,63,0.08)] border-b border-slate-200/80 dark:border-blue-900/40"
          : "bg-transparent border-b border-transparent"
      }`}
      suppressHydrationWarning
    >
      {alertBanner && (
        <div
          role="status"
          aria-live="polite"
          className="bg-[#0B1730] border-b border-[#1E3358] px-4 py-2 text-center text-xs sm:text-[13px] font-medium text-[#F1F5FB]"
        >
          <span className="mr-2 inline-flex items-center rounded-md bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 text-[11px] font-bold text-[#FBBF24]">
            Pemberitahuan Layanan
          </span>
          <span>{alertBanner}</span>
        </div>
      )}
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
              sizes="60px"
              loading="eager"
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
              <CloseIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
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
