import React from "react";

export function ContactHero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-r from-[#002857] via-[#013565] to-[#01427C] text-white py-16 sm:py-20 border-b border-[#014F90]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"
      />

      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14 text-center">
        <p className="nk-hero-enter text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.24em] text-[#0986C8]">
          HUBUNGI TIM KAMI
        </p>
        <h1 className="nk-hero-enter nk-hero-delay-1 mt-3 text-[30px] sm:text-[40px] lg:text-[44px] font-extrabold leading-[1.15] tracking-[-0.02em] text-white">
          Siap mendiskusikan{" "}
          <span className="text-[#0986C8]">rencana digital</span>{" "}
          Anda?
        </h1>
        <p className="nk-hero-enter nk-hero-delay-2 mx-auto mt-4 max-w-[660px] text-[14px] sm:text-[15px] leading-[1.7] text-slate-200">
          Ceritakan kebutuhan website atau sistem yang ingin Anda kembangkan. Tim kami
          akan meninjau spesifikasi Anda dan memberikan estimasi solusi dalam 1x24 jam
          kerja.
        </p>
      </div>
    </section>
  );
}
