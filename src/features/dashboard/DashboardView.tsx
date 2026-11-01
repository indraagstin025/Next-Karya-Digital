"use client";

import React from "react";
import {
  BriefcaseIcon,
  CheckCircle2Icon,
  FileTextIcon,
  MessageSquareIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { CmsAnalyticsOverview, DashboardEmergencyNotice } from "./types";
import { EmergencyAlertBanner } from "./components/EmergencyAlertBanner";
import { StatisticsCard } from "./components/StatisticsCard";
import { ProductInsightsCard } from "./components/ProductInsightsCard";
import { TotalEarningCard } from "./components/TotalEarningCard";
import { SalesMetricsCard } from "./components/SalesMetricsCard";
import {
  DashboardTransactionTable,
  defaultTransactionData,
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
  const visitorsCount = analytics?.metrics?.visitors ?? 21153;
  const pageviewsCount = analytics?.metrics?.pageviews ?? 64200;
  const conversionRate = analytics?.metrics?.conversionRate ?? 14.8;
  const whatsappClicks = analytics?.metrics?.whatsappClicks ?? 48;

  // Map real leads to template datatable items if available, or fall back to template sample data
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
            amount: 12500000 + (index % 5) * 4500000,
            status: itemStatus,
            paidBy: index % 2 === 0 ? "mastercard" : "visa",
          };
        })
      : defaultTransactionData;

  const totalPipelineValue =
    dealLeadsCount > 0
      ? (dealLeadsCount * 18500000).toLocaleString("id-ID")
      : "36.150.000";

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
            Ringkasan performa digital, metrik pengunjung, dan pipeline klien Next Karya Solusindo.
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

      {/* Grid Layout Identik Sesuai Template Asli */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        {/* Baris 1: Kartu Statistik Ber-ikon (Statistics Cards) */}
        <div className="col-span-full grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatisticsCard
            icon={<UsersIcon className="size-4" />}
            title="Prospek Konsultasi"
            value={newLeadsCount.toString()}
            changePercentage="+18.2%"
            subtitle={`dari total ${totalLeadsCount} prospek`}
            onClick={() => onNavigateTab("crm")}
          />
          <StatisticsCard
            icon={<TrendingUpIcon className="size-4" />}
            title="Pengunjung Unik"
            value={visitorsCount.toLocaleString("id-ID")}
            changePercentage="+12.4%"
            subtitle={`${pageviewsCount.toLocaleString("id-ID")} tayangan`}
            onClick={() => onNavigateTab("dashboard")}
          />
          <StatisticsCard
            icon={<MessageSquareIcon className="size-4" />}
            title="Konversi Kontak"
            value={`${conversionRate.toFixed(1)}%`}
            changePercentage="+4.3%"
            subtitle={`${whatsappClicks} interaksi WA`}
          />
          <StatisticsCard
            icon={<CheckCircle2Icon className="size-4" />}
            title="Deal & Kontrak"
            value={dealLeadsCount.toString()}
            changePercentage="+22.5%"
            subtitle="solusi digital aktif"
            onClick={() => onNavigateTab("crm")}
          />
        </div>

        {/* Baris 2 Kiri: Product Insights Card & Total Earning Card */}
        <div className="grid gap-6 max-xl:col-span-full lg:max-xl:grid-cols-2">
          <ProductInsightsCard
            title="Product & Portofolio Insight"
            publishedDate={`Terbit ${publishedPortfoliosCount} Portofolio, ${publishedPostsCount} Artikel`}
            reachedValue={visitorsCount.toLocaleString("id-ID")}
            orderValue={totalLeadsCount.toString()}
            className="justify-between gap-3 *:data-[slot=card-content]:space-y-5"
          />

          <TotalEarningCard
            title="Total Nilai Pipeline"
            earning={totalPipelineValue}
            trend="up"
            percentage={18}
            comparisonText="Target deal triwulan kuartal berjalan"
            className="justify-between gap-5 sm:min-w-0"
          />
        </div>

        {/* Baris 2 Kanan: Sales Metrics Card dengan Recharts */}
        <SalesMetricsCard
          activeLeadsValue={`${totalLeadsCount} Klien`}
          dealValue={`Rp ${totalPipelineValue}`}
          completedProjectsValue={`${publishedPortfoliosCount} Proyek`}
          className="col-span-full *:data-[slot=card-content]:space-y-6 xl:col-span-2"
        />

        {/* Baris 3: Datatable Prospek Klien Ber-avatar & Badge */}
        <Card className="col-span-full w-full py-0">
          <DashboardTransactionTable data={tableData} />
        </Card>
      </div>
    </div>
  );
}

export default DashboardView;
