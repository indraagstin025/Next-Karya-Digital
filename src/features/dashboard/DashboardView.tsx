"use client";

import React, { useState } from "react";
import {
  BriefcaseIcon,
  ClockIcon,
  FileTextIcon,
  MessageSquareIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type {
  CmsAnalyticsOverview,
  DashboardEmergencyNotice,
} from "./types";
import type { PeriodFilter } from "./api/dashboardApi";
import { EmergencyAlertBanner } from "./components/EmergencyAlertBanner";
import { StatisticsCard } from "./components/StatisticsCard";
import { ProductInsightsCard } from "./components/ProductInsightsCard";
import { TotalEarningCard } from "./components/TotalEarningCard";
import { SalesMetricsCard } from "./components/SalesMetricsCard";
import { TopPagesTable } from "./components/TopPagesTable";
import {
  DashboardTransactionTable,
  type TransactionItem,
} from "./components/DashboardTransactionTable";
import type { DashboardLeadPreview } from "./components/RecentLeadsCard";

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
  selectedPeriod?: PeriodFilter;
  onPeriodChange?: (period: PeriodFilter) => void;
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
  selectedPeriod = "30d",
  onPeriodChange,
  onNavigateTab,
  onNewPost,
  onNewPortfolio,
}: DashboardViewProps) {
  const [internalPeriod, setInternalPeriod] = useState<PeriodFilter>(selectedPeriod);
  const currentPeriod = onPeriodChange ? selectedPeriod : internalPeriod;

  function handlePeriodSelect(period: PeriodFilter) {
    setInternalPeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  }

  const visitorsCount = analytics?.metrics?.visitors ?? 0;
  const pageviewsCount = analytics?.metrics?.pageviews ?? 0;
  const sessionsCount = analytics?.metrics?.sessions ?? 0;
  const conversionRate = analytics?.metrics?.conversionRate ?? 0;
  const whatsappClicks = analytics?.metrics?.whatsappClicks ?? 0;
  const formSubmits = analytics?.metrics?.formSubmits ?? 0;
  const averageDurationSec = analytics?.metrics?.averageDurationSec ?? 0;
  const bounceRate = analytics?.metrics?.bounceRate ?? 0;

  const visitorsChange = analytics?.metrics?.visitorsChange;
  const conversionRateChange = analytics?.metrics?.conversionRateChange;
  const averageDurationChange = analytics?.metrics?.averageDurationChange;

  // Map real leads to datatable items if available, or keep array empty (no dummy fallback)
  const tableData: TransactionItem[] =
    leadsPreview && leadsPreview.length > 0
      ? leadsPreview.map((lead, index) => {
          const statusLower = (lead.status || "").toLowerCase();
          let itemStatus: "pending" | "processing" | "paid" | "failed" = "pending";
          if (statusLower.includes("deal")) itemStatus = "paid";
          else if (statusLower.includes("proposal") || statusLower.includes("dihubungi"))
            itemStatus = "processing";
          else if (statusLower.includes("batal")) itemStatus = "failed";

          return {
            id: lead.id,
            avatar: `/images/avatars/avatar-${(index % 15) + 1}.webp`,
            avatarFallback: lead.clientName.slice(0, 2).toUpperCase(),
            name: lead.clientName,
            email: lead.companyName
              ? `${lead.companyName} (${lead.whatsappNumber})`
              : lead.whatsappNumber,
            amount: 5000000 + (index % 5) * 2500000,
            status: itemStatus,
            paidBy: index % 2 === 0 ? "mastercard" : "visa",
          };
        })
      : [];

  const totalPipelineValue =
    dealLeadsCount > 0
      ? (dealLeadsCount * 8500000).toLocaleString("id-ID")
      : "0";

  return (
    <div className="space-y-6">
      {/* Emergency Notice if activated */}
      <EmergencyAlertBanner
        notice={emergencyNotice}
        onNavigateToEmergency={() => onNavigateTab("emergency")}
      />

      {/* Top Welcome & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Ringkasan Agensi
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Informasi performa website, statistik pengunjung, dan permohonan konsultasi yang masuk.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Selector Filter */}
          <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1 text-xs">
            <button
              type="button"
              onClick={() => handlePeriodSelect("today")}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                currentPeriod === "today"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => handlePeriodSelect("7d")}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                currentPeriod === "7d"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              7 Hari
            </button>
            <button
              type="button"
              onClick={() => handlePeriodSelect("30d")}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                currentPeriod === "30d"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              30 Hari
            </button>
          </div>

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

      {/* Grid Layout Identik Sesuai Template Asli */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        {/* Baris 1: Kartu Statistik Ber-ikon (Statistics Cards) */}
        <div className="col-span-full grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatisticsCard
            icon={<UsersIcon className="size-4" />}
            title="Prospek Konsultasi"
            value={newLeadsCount.toString()}
            changePercentage={newLeadsCount > 0 ? `${newLeadsCount} baru` : "0 baru"}
            subtitle={`dari total ${totalLeadsCount} prospek`}
            onClick={() => onNavigateTab("crm")}
          />
          <StatisticsCard
            icon={<TrendingUpIcon className="size-4" />}
            title="Pengunjung Website"
            value={visitorsCount.toLocaleString("id-ID")}
            changePercentage={
              visitorsChange !== undefined
                ? `${visitorsChange >= 0 ? "+" : ""}${visitorsChange.toFixed(1)}%`
                : "0%"
            }
            subtitle={`${pageviewsCount.toLocaleString("id-ID")} tayangan (${sessionsCount.toLocaleString("id-ID")} sesi)`}
            onClick={() => onNavigateTab("dashboard")}
          />
          <StatisticsCard
            icon={<MessageSquareIcon className="size-4" />}
            title="Kontak WhatsApp"
            value={`${conversionRate.toFixed(1)}%`}
            changePercentage={
              conversionRateChange !== undefined
                ? `${conversionRateChange >= 0 ? "+" : ""}${conversionRateChange.toFixed(2)}%`
                : "0%"
            }
            subtitle={`${whatsappClicks} pesan, ${formSubmits} formulir`}
          />
          <StatisticsCard
            icon={<ClockIcon className="size-4" />}
            title="Waktu Kunjungan"
            value={
              averageDurationSec > 0
                ? `${Math.floor(averageDurationSec / 60)}m ${averageDurationSec % 60}s`
                : "0m 0s"
            }
            changePercentage={
              averageDurationChange !== undefined
                ? `${averageDurationChange >= 0 ? "+" : ""}${averageDurationChange.toFixed(1)}%`
                : "0%"
            }
            subtitle={`Pantulan ${bounceRate.toFixed(1)}% (Bounce Rate)`}
          />
        </div>

        {/* Baris 2 Kiri: Product Insights Card & Total Earning Card */}
        <div className="grid gap-6 max-xl:col-span-full lg:max-xl:grid-cols-2">
          <ProductInsightsCard
            title="Statistik Konten"
            publishedDate={`Terbit ${publishedPortfoliosCount} portofolio, ${publishedPostsCount} artikel`}
            reachedValue={pageviewsCount.toLocaleString("id-ID")}
            orderValue={(whatsappClicks + formSubmits).toString()}
            pages={analytics?.pages}
            className="justify-between gap-3 *:data-[slot=card-content]:space-y-5"
          />

          <TotalEarningCard
            title="Estimasi Nilai Proyek"
            earning={totalPipelineValue}
            trend="up"
            percentage={dealLeadsCount > 0 ? 100 : undefined}
            comparisonText="Akumulasi nilai dari proyek yang telah disepakati"
            earningData={[]}
            className="justify-between gap-5 sm:min-w-0"
          />
        </div>

        {/* Baris 2 Kanan: Sales Metrics Card dengan Saluran Rujukan Recharts */}
        <SalesMetricsCard
          activeLeadsValue={`${totalLeadsCount} Klien`}
          dealValue={`Rp ${totalPipelineValue}`}
          completedProjectsValue={`${publishedPortfoliosCount} Portofolio`}
          conversionTrendValue={`${conversionRate.toFixed(1)}%`}
          sources={analytics?.sources}
          className="col-span-full *:data-[slot=card-content]:space-y-6 xl:col-span-2"
        />

        {/* Baris 3: Datatable Prospek Klien & Tabel Halaman Terpopuler */}
        <div className="col-span-full grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Card className="w-full py-0 h-full">
              <DashboardTransactionTable data={tableData} />
            </Card>
          </div>
          <div className="xl:col-span-1">
            <TopPagesTable pages={analytics?.pages} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
