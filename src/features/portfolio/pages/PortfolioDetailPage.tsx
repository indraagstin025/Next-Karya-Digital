import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { SiteShell } from "@/components/SiteShell";
import type { PublicPortfolioDetailDTO } from "@/lib/public-content";

export function PortfolioDetailPage({
  portfolio,
}: {
  portfolio: PublicPortfolioDetailDTO;
}) {
  return (
    <SiteShell>
      <article className="bg-gradient-to-b from-[#FFFFFF] via-[#F8FBFF] to-[#F3F8FF] dark:from-[#030711] dark:via-[#061231] dark:to-[#091a45] py-12 sm:py-16">
        <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14">
          <nav aria-label="Jejak halaman" className="text-[13px] text-[#425776] dark:text-slate-400">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link
                  href="/portofolio"
                  className="inline-flex min-h-11 items-center font-semibold text-[#003E70] underline-offset-2 hover:underline dark:text-[#0986C8]"
                >
                  Portofolio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium">
                {portfolio.title}
              </li>
            </ol>
          </nav>

          <header className="mt-4 max-w-[860px]">
            <p className="inline-block rounded-md bg-[#003E70] px-3 py-1 text-xs font-semibold text-white">
              {portfolio.category}
            </p>
            <h1 className="mt-4 text-[28px] sm:text-[38px] lg:text-[44px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#041E42] dark:text-white">
              {portfolio.title}
            </h1>
            <p className="mt-3 text-[13px] font-bold uppercase tracking-wider text-[#005090] dark:text-[#0986C8]">
              {portfolio.clientSector}
            </p>
            <p className="mt-4 text-[15px] sm:text-[17px] leading-[1.7] text-[#425776] dark:text-slate-300">
              {portfolio.description}
            </p>
          </header>

          {portfolio.image && (
            <div className="mt-8 overflow-hidden rounded-[26px] border border-[#E2E8F0] bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
              <img
                src={portfolio.image}
                alt={portfolio.imageAlt || portfolio.title}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#005090] dark:text-[#0986C8]">
                Dampak Bisnis
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#2F4260] dark:text-slate-300">
                {portfolio.impact || "Dampak proyek belum diisi."}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#005090] dark:text-[#0986C8]">
                Hasil Terukur
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#2F4260] dark:text-slate-300">
                {portfolio.metric || "Metrik hasil belum diisi."}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#005090] dark:text-[#0986C8]">
                Teknologi
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {portfolio.tech.length > 0 ? (
                  portfolio.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-[#0A2558] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-[14px] text-[#425776] dark:text-slate-400">
                    Belum diisi.
                  </span>
                )}
              </div>
            </div>
          </div>

          {portfolio.gallery.length > 0 && (
            <section aria-labelledby="gallery-heading" className="mt-12">
              <h2
                id="gallery-heading"
                className="text-[20px] sm:text-[24px] font-extrabold text-[#041E42] dark:text-white"
              >
                Galeri Proyek
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {portfolio.gallery.map((item, index) => (
                  <figure
                    key={`${item.url}-${index}`}
                    className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white dark:border-slate-800 dark:bg-slate-900"
                  >
                    <img
                      src={item.url}
                      alt={item.alt || `${portfolio.title} - gambar ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    {item.alt && (
                      <figcaption className="px-4 py-3 text-xs text-[#425776] dark:text-slate-400">
                        {item.alt}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 flex flex-col gap-4 border-t border-[#D5E1EF] pt-8 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/portofolio"
                className="inline-flex min-h-11 items-center rounded-xl border border-[#5B789E] bg-white px-5 text-[13.5px] font-bold text-[#041E42] transition-colors hover:bg-[#EEF4FC] dark:border-[#4E6E9E] dark:bg-[#12213F] dark:text-white dark:hover:bg-[#192D54]"
              >
                Kembali ke portofolio
              </Link>
              {portfolio.projectUrl && (
                <a
                  href={portfolio.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#5B789E] bg-white px-5 text-[13.5px] font-bold text-[#041E42] transition-colors hover:bg-[#EEF4FC] dark:border-[#4E6E9E] dark:bg-[#12213F] dark:text-white dark:hover:bg-[#192D54]"
                >
                  Lihat situs proyek
                </a>
              )}
            </div>
            <Link
              href="/kontak"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#003E70] px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-[#003E99]"
            >
              <span>Diskusikan proyek serupa</span>
              <ArrowRightIcon
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
