"use client";

import React, { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";

type ContactFormComponent = ComponentType<{ sourcePage?: string }>;

function FormSkeleton() {
  return (
    <div
      className="flex min-h-[640px] flex-col rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_16px_40px_-12px_rgba(10,35,80,0.08)] dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      aria-hidden="true"
    >
      <div className="h-5 w-40 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mt-3 h-3 w-64 rounded-full bg-slate-100 dark:bg-slate-800" />
      <div className="mt-8 space-y-5">
        <div className="h-11 rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-11 rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-11 rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-12 w-40 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

/**
 * Formulir kontak berada jauh di bawah lipatan. Komponennya baru diunduh saat
 * bagian ini mendekati viewport supaya schema dan validasi tidak ikut JS awal.
 */
export function ConsultationForm() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [Form, setForm] = useState<ContactFormComponent | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let cancelled = false;

    const load = () => {
      import("@/features/contact/components/ContactForm")
        .then((mod) => {
          if (!cancelled) setForm(() => mod.ContactFormCard);
        })
        .catch(() => {
          // Biarkan skeleton tampil; pengguna tetap bisa membuka /kontak.
        });
    };

    if (typeof IntersectionObserver === "undefined") {
      load();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "500px 0px" }
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef}>
      {Form ? <Form sourcePage="/" /> : <FormSkeleton />}
    </div>
  );
}
