"use client";

import React from "react";
import {
  ArrowUpRightIcon,
  CheckCircle2Icon,
  MessageSquareIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import type { AnalyticsMetrics } from "../types";

interface StatCardsProps {
  totalLeadsCount: number;
  newLeadsCount: number;
  dealLeadsCount: number;
  metrics?: AnalyticsMetrics;
  onNavigateToCrm: () => void;
  onNavigateToAnalytics: () => void;
}

export function StatCards({
  totalLeadsCount,
  newLeadsCount,
  dealLeadsCount,
  metrics,
  onNavigateToCrm,
  onNavigateToAnalytics,
}: StatCardsProps) {
  const visitors = metrics?.visitors || 0;
  const pageviews = metrics?.pageviews || 0;
  const whatsappClicks = metrics?.whatsappClicks || 0;
  const formSubmits = metrics?.formSubmits || 0;
  const conversionRate = metrics?.conversionRate || 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Prospek Baru */}
      <div
        onClick={onNavigateToCrm}
        className="group cursor-pointer rounded-xl border border-border bg-card p-4 shadow-xs transition hover:border-primary/50 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Prospek Konsultasi</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <UsersIcon className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {newLeadsCount}
          </span>
          <span className="text-xs text-muted-foreground">baru dari total {totalLeadsCount}</span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
          <span>Buka Pipeline CRM</span>
          <ArrowUpRightIcon className="size-3" />
        </p>
      </div>

      {/* Card 2: Pengunjung Unik */}
      <div
        onClick={onNavigateToAnalytics}
        className="rounded-xl border border-border bg-card p-4 shadow-xs"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Pengunjung Unik</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <TrendingUpIcon className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {visitors.toLocaleString("id-ID")}
          </span>
          <span className="text-xs text-muted-foreground">
            {pageviews.toLocaleString("id-ID")} tayangan
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Berdasarkan analitik 30 hari terakhir
        </p>
      </div>

      {/* Card 3: Konversi Kontak */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Konversi Kontak</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
            <MessageSquareIcon className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {conversionRate.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">
            ({whatsappClicks} WA, {formSubmits} form)
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Interaksi CTA calon klien di website
        </p>
      </div>

      {/* Card 4: Deal Closing */}
      <div
        onClick={onNavigateToCrm}
        className="group cursor-pointer rounded-xl border border-border bg-card p-4 shadow-xs transition hover:border-emerald-500/50 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Closing / Deal</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <CheckCircle2Icon className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {dealLeadsCount}
          </span>
          <span className="text-xs text-muted-foreground">klien sepakat</span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1 group-hover:text-emerald-500 transition-colors">
          <span>Tinjau status kesepakatan</span>
          <ArrowUpRightIcon className="size-3" />
        </p>
      </div>
    </div>
  );
}
