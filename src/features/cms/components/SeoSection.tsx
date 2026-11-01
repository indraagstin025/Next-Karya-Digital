"use client";

import React from "react";
import { INPUT_CLASS, LABEL_CLASS } from "../constants";

interface SeoSectionProps {
  idPrefix: string;
  title: string;
  setTitle: (next: string) => void;
  desc: string;
  setDesc: (next: string) => void;
}

export function SeoSection({
  idPrefix,
  title,
  setTitle,
  desc,
  setDesc,
}: SeoSectionProps) {
  return (
    <details className="group rounded-md border border-border bg-muted/20">
      <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-2 px-3 py-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        <span>
          Tampilan di Google
          <span className="ml-2 font-normal text-muted-foreground">
            (opsional, boleh dikosongkan)
          </span>
        </span>
        <span className="text-muted-foreground group-open:rotate-180" aria-hidden="true">
          &#9662;
        </span>
      </summary>
      <div className="grid grid-cols-1 gap-4 border-t border-border p-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-seo-title`} className={LABEL_CLASS}>
            Judul di Google
          </label>
          <input
            id={`${idPrefix}-seo-title`}
            type="text"
            maxLength={70}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Kosongkan untuk memakai judul artikel"
            className={INPUT_CLASS}
          />
          <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
            {title.length}/70 karakter
          </p>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-seo-desc`} className={LABEL_CLASS}>
            Deskripsi di Google
          </label>
          <input
            id={`${idPrefix}-seo-desc`}
            type="text"
            maxLength={160}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Kosongkan untuk memakai ringkasan"
            className={INPUT_CLASS}
          />
          <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
            {desc.length}/160 karakter
          </p>
        </div>
      </div>
    </details>
  );
}
