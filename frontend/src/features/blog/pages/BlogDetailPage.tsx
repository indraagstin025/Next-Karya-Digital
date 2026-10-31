import React from "react";
import Link from "next/link";
import { ArrowRightIcon, CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { SiteShell } from "@/components/SiteShell";
import { ContentBlocks } from "@/components/ContentBlocks";
import type {
  PublicArticleDetailDTO,
  PublicArticleSummaryDTO,
} from "@/lib/public-content";
import { formatDateId } from "@/lib/public-validators";

export function BlogDetailPage({
  article,
  related,
}: {
  article: PublicArticleDetailDTO;
  related: PublicArticleSummaryDTO[] | null;
}) {
  return (
    <SiteShell>
      <article className="bg-gradient-to-b from-[#FFFFFF] via-[#F8FBFF] to-[#F3F8FF] dark:from-[#030711] dark:via-[#061231] dark:to-[#091a45] py-12 sm:py-16">
        <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14">
          <nav aria-label="Jejak halaman" className="text-[13px] text-[#425776] dark:text-slate-400">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link
                  href="/blog"
                  className="inline-flex min-h-11 items-center font-semibold text-[#003E70] underline-offset-2 hover:underline dark:text-[#0986C8]"
                >
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium">
                {article.categoryName}
              </li>
            </ol>
          </nav>

          <header className="mt-4 max-w-[860px]">
            <p className="inline-block rounded-md bg-[#003E70] px-3 py-1 text-xs font-semibold text-white">
              {article.categoryName}
            </p>
            <h1 className="mt-4 text-[28px] sm:text-[38px] lg:text-[44px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#041E42] dark:text-white">
              {article.title}
            </h1>
            <p className="mt-4 text-[15px] sm:text-[17px] leading-[1.7] text-[#425776] dark:text-slate-300">
              {article.excerpt}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#425776] dark:text-slate-400">
              <span>Ditulis oleh {article.authorName}</span>
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
                <time dateTime={article.publishedAt ?? undefined}>
                  {formatDateId(article.publishedAt)}
                </time>
              </span>
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {article.readingTime} menit baca
              </span>
            </div>
          </header>

          <div className="mt-10 border-t border-[#D5E1EF] pt-8 dark:border-slate-800">
            {article.blocks.length > 0 ? (
              <ContentBlocks blocks={article.blocks} />
            ) : (
              <p className="max-w-[72ch] text-[15px] text-[#425776] dark:text-slate-300">
                Isi artikel ini belum tersedia. Silakan kembali beberapa saat lagi.
              </p>
            )}

            {article.tags.length > 0 && (
              <ul
                aria-label="Topik artikel"
                className="mt-10 flex flex-wrap gap-2"
              >
                {article.tags.map((tag) => (
                  <li
                    key={tag.slug}
                    className="rounded-md border border-[#5B789E] bg-white px-3 py-1.5 text-xs font-semibold text-[#041E42] dark:border-[#4E6E9E] dark:bg-slate-900 dark:text-slate-200"
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-[#5B789E] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:border-[#4E6E9E] dark:bg-slate-900">
            <div>
              <h2 className="text-[17px] sm:text-[19px] font-extrabold text-[#041E42] dark:text-white">
                Punya kebutuhan serupa di bisnis Anda?
              </h2>
              <p className="mt-1.5 text-[13.5px] text-[#425776] dark:text-slate-300">
                Ceritakan kondisi website atau sistem Anda, tim kami meninjau dan membalas dalam 1x24 jam kerja.
              </p>
            </div>
            <Link
              href="/kontak"
              className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#003E70] px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-[#003E99]"
            >
              <span>Jadwalkan diskusi proyek</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {related && related.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-14">
              <h2
                id="related-heading"
                className="text-[20px] sm:text-[24px] font-extrabold text-[#041E42] dark:text-white"
              >
                Artikel terkait
              </h2>
              <ul className="mt-5 grid gap-5 md:grid-cols-3">
                {related.map((item) => (
                  <li
                    key={item.id}
                    className="relative flex flex-col justify-between rounded-2xl border border-[#D5E1EF] bg-white p-5 transition-colors hover:border-[#005090] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#003E70] dark:text-[#0986C8]">
                        {item.categoryName}
                      </p>
                      <h3 className="mt-1.5 text-[16px] font-extrabold leading-snug text-[#041E42] dark:text-white">
                        <Link
                          href={`/blog/${item.slug}`}
                          className="after:absolute after:inset-0 after:content-['']"
                        >
                          {item.title}
                        </Link>
                      </h3>
                    </div>
                    <p className="mt-4 text-xs tabular-nums text-[#425776] dark:text-slate-400">
                      {item.readingTime} menit baca
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </SiteShell>
  );
}
