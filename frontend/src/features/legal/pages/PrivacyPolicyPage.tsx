import React from "react";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { ContentBlocks } from "@/components/ContentBlocks";
import type { PublicPageDTO } from "@/lib/public-content";

export function PrivacyPolicyPage({ page }: { page: PublicPageDTO }) {
  return (
    <SiteShell>
      <section className="bg-gradient-to-b from-[#FFFFFF] via-[#F8FBFF] to-[#F3F8FF] dark:from-[#030711] dark:via-[#061231] dark:to-[#091a45] py-12 sm:py-16">
        <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-9 lg:px-14">
          <header className="max-w-[860px]">
            <h1 className="text-[30px] sm:text-[40px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#041E42] dark:text-white">
              {page.title}
            </h1>
            {page.updatedLabel && (
              <p className="mt-3 text-[13px] tabular-nums text-[#425776] dark:text-slate-400">
                Terakhir diperbarui {page.updatedLabel}
              </p>
            )}
          </header>

          <div className="mt-8 border-t border-[#D5E1EF] pt-8 dark:border-slate-800">
            <ContentBlocks blocks={page.blocks} />
          </div>

          <Link
            href="/kontak"
            className="mt-12 inline-flex min-h-11 items-center rounded-xl border border-[#5B789E] bg-white px-5 text-[13.5px] font-bold text-[#041E42] transition-colors hover:bg-[#EEF4FC] dark:border-[#4E6E9E] dark:bg-[#12213F] dark:text-white dark:hover:bg-[#192D54]"
          >
            Hubungi tim untuk pertanyaan data
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
