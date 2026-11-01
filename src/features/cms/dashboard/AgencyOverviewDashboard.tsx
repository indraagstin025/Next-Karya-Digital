"use client";

import React from "react";
import {
  UsersIcon,
  TrendingUpIcon,
  FileTextIcon,
  BriefcaseIcon,
  SparklesIcon,
  MessageSquareIcon,
  ShieldAlertIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
} from "lucide-react";
import type {
  ActiveTab,
  CmsAnalyticsOverview,
  CmsEmergencyOverview,
  CmsLeadItem,
  CmsPortfolio,
  CmsPost,
  CmsServiceItem,
  StructuredSubTab,
} from "../types";
import { PRIMARY_BTN_CLASS, SECONDARY_BTN_CLASS } from "../constants";

export interface AgencyOverviewDashboardProps {
  posts: CmsPost[];
  portfolios: CmsPortfolio[];
  services: CmsServiceItem[];
  leads: CmsLeadItem[];
  analytics?: CmsAnalyticsOverview | null;
  emergencyOverview?: CmsEmergencyOverview | null;
  onNavigateTab: (tab: ActiveTab, sub?: StructuredSubTab) => void;
  onNewPost?: () => void;
  onNewPortfolio?: () => void;
}

export function AgencyOverviewDashboard({
  posts,
  portfolios,
  services,
  leads,
  analytics,
  emergencyOverview,
  onNavigateTab,
  onNewPost,
  onNewPortfolio,
}: AgencyOverviewDashboardProps) {
  const publishedPostsCount = posts.filter((p) => p.status === "PUBLISHED").length;
  const publishedPortfoliosCount = portfolios.filter((p) => p.status === "PUBLISHED").length;
  const publishedServicesCount = services.filter((s) => s.status === "PUBLISHED").length;

  const newLeads = leads.filter((l) => l.status === "BARU");
  const dealLeads = leads.filter((l) => l.status === "DEAL");

  const visitors = analytics?.metrics?.visitors || 0;
  const pageviews = analytics?.metrics?.pageviews || 0;
  const whatsappClicks = analytics?.metrics?.whatsappClicks || 0;
  const formSubmits = analytics?.metrics?.formSubmits || 0;
  const conversionRate = analytics?.metrics?.conversionRate || 0;

  const isFormLocked = emergencyOverview?.site?.isFormLocked || false;
  const isAlertActive = emergencyOverview?.site?.isAlertActive || false;
  const alertBanner = emergencyOverview?.site?.alertBanner;

  return (
    <div className="space-y-6">
      {/* Emergency Notice if activated */}
      {(isFormLocked || (isAlertActive && alertBanner)) && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlertIcon className="size-5 shrink-0 text-destructive mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-destructive">
                Status Darurat Aktif pada Website
              </h4>
              {isFormLocked && (
                <p className="mt-1 text-xs text-destructive/90">
                  Formulir konsultasi publik sedang dikunci (pencegahan spam). Pengunjung tidak dapat mengirim pesan baru saat ini.
                </p>
              )}
              {isAlertActive && alertBanner && (
                <p className="mt-1 text-xs text-destructive/90">
                  Banner pengumuman darurat tayang: &quot;{alertBanner}&quot;
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("emergency")}
              className="text-xs font-semibold text-destructive hover:underline shrink-0"
            >
              Kelola Darurat
            </button>
          </div>
        </div>
      )}

      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Pusat Komando Agensi
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Ringkasan performa digital, pipeline klien, dan status penerbitan Next Karya.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {onNewPost && (
            <button type="button" onClick={onNewPost} className={PRIMARY_BTN_CLASS}>
              <FileTextIcon className="size-4 mr-1.5" />
              Tulis Artikel
            </button>
          )}
          {onNewPortfolio && (
            <button type="button" onClick={onNewPortfolio} className={SECONDARY_BTN_CLASS}>
              <BriefcaseIcon className="size-4 mr-1.5" />
              Tambah Portofolio
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Prospek Baru */}
        <div
          onClick={() => onNavigateTab("crm")}
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
              {newLeads.length}
            </span>
            <span className="text-xs text-muted-foreground">baru dari total {leads.length}</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
            <span>Buka Pipeline CRM</span>
            <ArrowUpRightIcon className="size-3" />
          </p>
        </div>

        {/* KPI 2: Pengunjung Unik */}
        <div
          onClick={() => onNavigateTab("dashboard")}
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

        {/* KPI 3: Konversi */}
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
              ({whatsappClicks} WA, {formSubmits} formulir)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Interaksi CTA calon klien di website
          </p>
        </div>

        {/* KPI 4: Deal Closing */}
        <div
          onClick={() => onNavigateTab("crm")}
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
              {dealLeads.length}
            </span>
            <span className="text-xs text-muted-foreground">klien sepakat</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1 group-hover:text-emerald-500 transition-colors">
            <span>Tinjau status kesepakatan</span>
            <ArrowUpRightIcon className="size-3" />
          </p>
        </div>
      </div>

      {/* Content & Pipeline Overview Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Content Status Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Status Konten Website</h3>

          {/* Posts item */}
          <div
            onClick={() => onNavigateTab("posts")}
            className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-3.5 transition hover:border-primary/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <FileTextIcon className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Artikel Blog</p>
                <p className="text-[11px] text-muted-foreground">
                  {publishedPostsCount} terbit dari {posts.length} artikel
                </p>
              </div>
            </div>
            <ArrowUpRightIcon className="size-4 text-muted-foreground" />
          </div>

          {/* Portfolios item */}
          <div
            onClick={() => onNavigateTab("portfolios")}
            className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-3.5 transition hover:border-primary/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <BriefcaseIcon className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Portofolio Klien</p>
                <p className="text-[11px] text-muted-foreground">
                  {publishedPortfoliosCount} terbit dari {portfolios.length} studi kasus
                </p>
              </div>
            </div>
            <ArrowUpRightIcon className="size-4 text-muted-foreground" />
          </div>

          {/* Services item */}
          <div
            onClick={() => onNavigateTab("services")}
            className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-3.5 transition hover:border-primary/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <SparklesIcon className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Paket Layanan</p>
                <p className="text-[11px] text-muted-foreground">
                  {publishedServicesCount} terbit dari {services.length} paket
                </p>
              </div>
            </div>
            <ArrowUpRightIcon className="size-4 text-muted-foreground" />
          </div>
        </div>

        {/* Right: Recent Leads Widget */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Prospek Masuk Terbaru</h3>
              <p className="text-xs text-muted-foreground">
                Daftar permohonan konsultasi dari calon klien melalui website.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("crm")}
              className="text-xs font-medium text-primary hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="mt-3 divide-y divide-border">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                    {lead.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {lead.clientName}
                      {lead.companyName ? ` (${lead.companyName})` : ""}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Layanan: {lead.serviceRequested}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                    {lead.whatsappNumber}
                  </span>
                  <span className="rounded-md border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}

            {leads.length === 0 && (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Belum ada prospek konsultasi yang masuk.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
