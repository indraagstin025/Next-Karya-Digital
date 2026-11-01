"use client";

import React from "react";
import { BriefcaseIcon, FileTextIcon } from "lucide-react";
import type { CmsAnalyticsOverview, DashboardEmergencyNotice } from "./types";
import { EmergencyAlertBanner } from "./components/EmergencyAlertBanner";
import { StatCards } from "./components/StatCards";
import { ContentStatusCard } from "./components/ContentStatusCard";
import { DashboardLeadPreview, RecentLeadsCard } from "./components/RecentLeadsCard";

const PRIMARY_BTN_CLASS =
  "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer min-h-11";
const SECONDARY_BTN_CLASS =
  "inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer min-h-11";

export interface DashboardViewProps {
  totalLeadsCount: number;
  newLeadsCount: number;
  dealLeadsCount: number;
  leadsPreview: DashboardLeadPreview[];
  publishedPostsCount: number;
  totalPostsCount: number;
  publishedPortfoliosCount: number;
  totalPortfoliosCount: number;
  publishedServicesCount: number;
  totalServicesCount: number;
  analytics?: CmsAnalyticsOverview | null;
  emergencyNotice?: DashboardEmergencyNotice | null;
  onNavigateTab: (tab: string, sub?: string) => void;
  onNewPost?: () => void;
  onNewPortfolio?: () => void;
}

export function DashboardView({
  totalLeadsCount,
  newLeadsCount,
  dealLeadsCount,
  leadsPreview,
  publishedPostsCount,
  totalPostsCount,
  publishedPortfoliosCount,
  totalPortfoliosCount,
  publishedServicesCount,
  totalServicesCount,
  analytics,
  emergencyNotice,
  onNavigateTab,
  onNewPost,
  onNewPortfolio,
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Emergency Notice if activated */}
      <EmergencyAlertBanner
        notice={emergencyNotice}
        onNavigateToEmergency={() => onNavigateTab("emergency")}
      />

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
      <StatCards
        totalLeadsCount={totalLeadsCount}
        newLeadsCount={newLeadsCount}
        dealLeadsCount={dealLeadsCount}
        metrics={analytics?.metrics}
        onNavigateToCrm={() => onNavigateTab("crm")}
        onNavigateToAnalytics={() => onNavigateTab("dashboard")}
      />

      {/* Content & Pipeline Overview Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Content Status Cards */}
        <ContentStatusCard
          publishedPostsCount={publishedPostsCount}
          totalPostsCount={totalPostsCount}
          publishedPortfoliosCount={publishedPortfoliosCount}
          totalPortfoliosCount={totalPortfoliosCount}
          publishedServicesCount={publishedServicesCount}
          totalServicesCount={totalServicesCount}
          onNavigateToPosts={() => onNavigateTab("posts")}
          onNavigateToPortfolios={() => onNavigateTab("portfolios")}
          onNavigateToServices={() => onNavigateTab("services")}
        />

        {/* Right: Recent Leads Widget */}
        <RecentLeadsCard
          leads={leadsPreview}
          onNavigateToCrm={() => onNavigateTab("crm")}
        />
      </div>
    </div>
  );
}
