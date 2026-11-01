"use client";

import React from "react";
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  FileTextIcon,
  SparklesIcon,
} from "lucide-react";

interface ContentStatusCardProps {
  publishedPostsCount: number;
  totalPostsCount: number;
  publishedPortfoliosCount: number;
  totalPortfoliosCount: number;
  publishedServicesCount: number;
  totalServicesCount: number;
  onNavigateToPosts: () => void;
  onNavigateToPortfolios: () => void;
  onNavigateToServices: () => void;
}

export function ContentStatusCard({
  publishedPostsCount,
  totalPostsCount,
  publishedPortfoliosCount,
  totalPortfoliosCount,
  publishedServicesCount,
  totalServicesCount,
  onNavigateToPosts,
  onNavigateToPortfolios,
  onNavigateToServices,
}: ContentStatusCardProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Status Konten Website</h3>

      {/* Posts Item */}
      <div
        onClick={onNavigateToPosts}
        className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-3.5 transition hover:border-primary/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <FileTextIcon className="size-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Artikel Blog</p>
            <p className="text-[11px] text-muted-foreground">
              {publishedPostsCount} terbit dari {totalPostsCount} artikel
            </p>
          </div>
        </div>
        <ArrowUpRightIcon className="size-4 text-muted-foreground" />
      </div>

      {/* Portfolios Item */}
      <div
        onClick={onNavigateToPortfolios}
        className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-3.5 transition hover:border-primary/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <BriefcaseIcon className="size-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Portofolio Klien</p>
            <p className="text-[11px] text-muted-foreground">
              {publishedPortfoliosCount} terbit dari {totalPortfoliosCount} studi kasus
            </p>
          </div>
        </div>
        <ArrowUpRightIcon className="size-4 text-muted-foreground" />
      </div>

      {/* Services Item */}
      <div
        onClick={onNavigateToServices}
        className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-3.5 transition hover:border-primary/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
            <SparklesIcon className="size-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Paket Layanan</p>
            <p className="text-[11px] text-muted-foreground">
              {publishedServicesCount} terbit dari {totalServicesCount} paket
            </p>
          </div>
        </div>
        <ArrowUpRightIcon className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
}
