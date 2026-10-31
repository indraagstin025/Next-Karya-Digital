import React from "react";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  CodeIcon,
  LayersIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { PublicArticleSummaryDTO } from "@/lib/public-content";
import { formatDateId } from "@/lib/public-validators";

function categoryIcon(categorySlug: string) {
  if (categorySlug === "arsitektur-web") return <LightningBoltIcon className="h-6 w-6" />;
  if (categorySlug === "sistem-internal") return <LayersIcon className="h-6 w-6" />;
  return <CodeIcon className="h-6 w-6" />;
}

export function BlogGrid({
  articles,
}: {
  articles: PublicArticleSummaryDTO[] | null;
}) {
  if (articles === null) {
    return (
      <div
        role="alert"
        className="rounded-[24px] border border-rose-700 bg-rose-50 p-6 sm:p-8 text-[14px] text-rose-900 dark:border-rose-400 dark:bg-rose-950 dark:text-rose-200"
      >
        <p className="font-bold">Daftar artikel belum dapat dimuat.</p>
        <p className="mt-1.5">
          Koneksi ke server sedang bermasalah. Muat ulang halaman ini beberapa saat lagi.
        </p>
        <Link
          href="/blog"
          className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-rose-700 px-4 text-[13px] font-bold dark:border-rose-400"
        >
          Muat ulang halaman
        </Link>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-[24px] border border-[#5B789E] bg-white p-6 sm:p-8 text-[14px] text-[#425776] dark:border-[#4E6E9E] dark:bg-slate-900 dark:text-slate-300">
        <p className="font-bold text-[#041E42] dark:text-white">Belum ada artikel yang terbit.</p>
        <p className="mt-1.5">
          Artikel akan tampil di sini setelah tim kami mempublikasikannya. Sementara itu, Anda dapat
          berdiskusi langsung lewat halaman kontak.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:gap-7 md:grid-cols-3">
      {articles.map((post, idx) => (
        <ScrollReveal key={post.id} delayMs={idx * 80} className="h-full">
          <article className="relative overflow-hidden h-full flex flex-col justify-between rounded-[24px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-7 shadow-[0_14px_38px_-10px_rgba(10,35,80,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#005090] dark:hover:border-blue-500 hover:shadow-[0_22px_46px_-10px_rgba(0,80,144,0.15)] group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#005090] text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                  {categoryIcon(post.categorySlug)}
                </div>
                <span className="rounded-full bg-[#005090] text-white px-3.5 py-1 text-[11.5px] font-semibold shadow-sm">
                  {post.categoryName}
                </span>
              </div>

              <h2 className="text-[17px] sm:text-[18.5px] font-extrabold leading-snug tracking-[-0.015em] text-[#041E42] dark:text-white transition-colors duration-200 group-hover:text-[#005090] dark:group-hover:text-[#0986C8]">
                <Link
                  href={`/blog/${post.slug}`}
                  className="after:absolute after:inset-0 after:content-['']"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2.5 text-[13px] sm:text-[13.5px] leading-[1.68] text-[#4A5D78] dark:text-slate-300">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between gap-3 text-xs text-[#4A5D78] dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#003E70] dark:text-[#0986C8]">
                <CalendarIcon className="h-3.5 w-3.5" />
                <time dateTime={post.publishedAt ?? undefined}>
                  {formatDateId(post.publishedAt)}
                </time>
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium tabular-nums">
                <ClockIcon className="h-3.5 w-3.5" />
                {post.readingTime} menit baca
              </span>
            </div>

            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-1 w-0 bg-[#005090] transition-all duration-300 group-hover:w-full"
            />
          </article>
        </ScrollReveal>
      ))}
    </div>
  );
}
