import React from "react";
import Link from "next/link";

export function WorkspaceUnavailable({
  message,
  retryHref = "/dashboard",
}: {
  message: string;
  retryHref?: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F8FD] p-6 dark:bg-[#030711]">
      <div className="w-full max-w-md rounded-2xl border border-[#D5E1EF] bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#005090] dark:text-[#0986C8]">
          Next Karya Studio
        </p>
        <h1 className="mt-2 text-xl font-extrabold text-[#041E42] dark:text-white">
          Dashboard belum bisa dimuat
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#425776] dark:text-slate-300">
          {message}
        </p>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            href={retryHref}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#003E70] px-5 text-sm font-bold text-white transition-colors hover:bg-[#003E99]"
          >
            Coba lagi
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#5B789E] bg-white px-5 text-sm font-bold text-[#041E42] transition-colors hover:bg-[#EEF4FC] dark:border-[#4E6E9E] dark:bg-[#12213F] dark:text-white dark:hover:bg-[#192D54]"
          >
            Kembali ke situs
          </Link>
        </div>
      </div>
    </div>
  );
}
