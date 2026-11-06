"use client";

import React, { useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
  MessageSquareIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import type {
  CmsAnalyticsOverview,
  DashboardEmergencyNotice,
} from "./types";
import type { AnalyticsDateRange, PeriodFilter } from "./date-range";
import {
  MAX_CUSTOM_RANGE_DAYS,
  RAW_EVENT_RETENTION_DAYS,
  countRangeDays,
  defaultCustomRange,
  formatRangeLabel,
  getJakartaToday,
  validateCustomRange,
} from "./date-range";
import { EmergencyAlertBanner } from "./components/EmergencyAlertBanner";
import { StatisticsCard } from "./components/StatisticsCard";
import { ProductInsightsCard } from "./components/ProductInsightsCard";
import { TotalEarningCard } from "./components/TotalEarningCard";
import { SalesMetricsCard } from "./components/SalesMetricsCard";
import { TrafficTrendChart } from "./components/TrafficTrendChart";
import { HourlyPatternChart } from "./components/HourlyPatternChart";
import { TopPagesTable } from "./components/TopPagesTable";
import { AudienceBreakdownCard } from "./components/AudienceBreakdownCard";
import { ContentClicksCard } from "./components/ContentClicksCard";
import {
  DashboardTransactionTable,
  type TransactionItem,
} from "./components/DashboardTransactionTable";
import type { DashboardLeadPreview } from "./components/RecentLeadsCard";

export interface DashboardViewProps {
  totalLeadsCount: number;
  newLeadsCount: number;
  leadsPreview: DashboardLeadPreview[];
  publishedPostsCount: number;
  publishedPortfoliosCount: number;
  analytics?: CmsAnalyticsOverview | null;
  emergencyNotice?: DashboardEmergencyNotice | null;
  selectedPeriod?: PeriodFilter;
  selectedRange?: AnalyticsDateRange | null;
  onPeriodChange?: (
    period: PeriodFilter,
    range?: AnalyticsDateRange | null
  ) => void;
  onNavigateTab: (tab: string, sub?: string) => void;
  sites?: { id: string; name: string; domain?: string }[];
  selectedSiteId?: string;
  onSiteChange?: (siteId: string) => void;
}

export function DashboardView({
  totalLeadsCount,
  newLeadsCount,
  leadsPreview,
  publishedPostsCount,
  publishedPortfoliosCount,
  analytics,
  emergencyNotice,
  selectedPeriod = "30d",
  selectedRange,
  onPeriodChange,
  onNavigateTab,
  sites,
  selectedSiteId,
  onSiteChange,
}: DashboardViewProps) {
  const [internalPeriod, setInternalPeriod] =
    useState<PeriodFilter>(selectedPeriod);
  const [internalRange, setInternalRange] =
    useState<AnalyticsDateRange | null>(null);
  const currentPeriod = onPeriodChange ? selectedPeriod : internalPeriod;
  const currentRange = onPeriodChange ? selectedRange ?? null : internalRange;
  const [rangeOpen, setRangeOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<AnalyticsDateRange>(
    () => currentRange ?? defaultCustomRange()
  );
  const todayKey = getJakartaToday();

  const draftError = validateCustomRange(draftRange, todayKey);
  const draftDays = countRangeDays(draftRange.from, draftRange.to);
  const showDraftError = Boolean(draftError);
  const showRetentionNote =
    draftDays !== null && draftDays > RAW_EVENT_RETENTION_DAYS;

  function handlePeriodSelect(
    period: PeriodFilter,
    range: AnalyticsDateRange | null = null
  ) {
    setInternalPeriod(period);
    setInternalRange(period === "custom" ? range : null);
    onPeriodChange?.(period, period === "custom" ? range : null);
  }

  function handleRangeOpenChange(open: boolean) {
    if (open) {
      setDraftRange(currentRange ?? defaultCustomRange());
    }
    setRangeOpen(open);
  }

  function handleDraftChange(field: "from" | "to", value: string) {
    setDraftRange((previous) => ({ ...previous, [field]: value }));
  }

  function handleApplyRange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validateCustomRange(draftRange, todayKey)) return;

    handlePeriodSelect("custom", draftRange);
    setRangeOpen(false);
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
            dealValue: lead.dealValue,
            serviceRequested: lead.serviceRequested,
            status: itemStatus,
          };
        })
      : [];

  const totalPipelineValue = leadsPreview
    .filter((lead) => lead.status === "DEAL")
    .reduce((total, lead) => total + lead.dealValue, 0)
    .toLocaleString("id-ID");

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
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Informasi performa website, statistik pengunjung, dan permohonan konsultasi yang masuk.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Site Selector (Option A: only rendered when > 1 site exists) */}
          {sites && sites.length > 1 && (
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs">
              <GlobeIcon className="size-3.5 text-muted-foreground" />
              <select
                value={selectedSiteId || "nextkarya-main"}
                onChange={(e) => onSiteChange?.(e.target.value)}
                aria-label="Pilih Situs"
                className="bg-transparent font-medium text-foreground cursor-pointer focus:outline-none text-xs"
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id} className="bg-popover text-popover-foreground">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Period Selector Filter */}
          <div className="flex flex-wrap items-center gap-2">
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

            <Popover open={rangeOpen} onOpenChange={handleRangeOpenChange}>
              <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1 text-xs">
                <PopoverTrigger
                  type="button"
                  aria-label="Pilih rentang tanggal kustom"
                  title={
                    currentPeriod === "custom" && currentRange
                      ? `${currentRange.from} sampai ${currentRange.to}`
                      : "Pilih rentang tanggal kustom"
                  }
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition cursor-pointer ${
                    currentPeriod === "custom"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CalendarIcon className="size-3.5" />
                  {currentPeriod === "custom" && currentRange
                    ? formatRangeLabel(currentRange)
                    : "Kustom"}
                </PopoverTrigger>
              </div>

              <PopoverContent
                align="end"
                className="w-[min(20rem,calc(100vw-2rem))]"
              >
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleApplyRange}
                >
                  <PopoverHeader>
                    <PopoverTitle>Rentang tanggal</PopoverTitle>
                    <PopoverDescription>
                      Pilih tanggal awal dan akhir. Maksimal{" "}
                      {MAX_CUSTOM_RANGE_DAYS} hari.
                    </PopoverDescription>
                  </PopoverHeader>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="dashboard-range-from" className="text-xs">
                        Dari
                      </Label>
                      <Input
                        id="dashboard-range-from"
                        type="date"
                        value={draftRange.from}
                        max={draftRange.to || todayKey}
                        onChange={(event) =>
                          handleDraftChange("from", event.target.value)
                        }
                        aria-invalid={showDraftError ? true : undefined}
                        aria-describedby={
                          showDraftError ? "dashboard-range-error" : undefined
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="dashboard-range-to" className="text-xs">
                        Sampai
                      </Label>
                      <Input
                        id="dashboard-range-to"
                        type="date"
                        value={draftRange.to}
                        min={draftRange.from || undefined}
                        max={todayKey}
                        onChange={(event) =>
                          handleDraftChange("to", event.target.value)
                        }
                        aria-invalid={showDraftError ? true : undefined}
                        aria-describedby={
                          showDraftError ? "dashboard-range-error" : undefined
                        }
                      />
                    </div>
                  </div>

                  {showDraftError ? (
                    <p
                      id="dashboard-range-error"
                      role="alert"
                      className="text-xs text-destructive"
                    >
                      {draftError}
                    </p>
                  ) : null}

                  {showRetentionNote ? (
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      Rincian browser, OS, dan klik konten hanya tersedia untuk{" "}
                      {RAW_EVENT_RETENTION_DAYS} hari terakhir.
                    </p>
                  ) : null}

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setRangeOpen(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={Boolean(draftError)}
                    >
                      Terapkan
                    </Button>
                  </div>
                </form>
              </PopoverContent>
            </Popover>
          </div>
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
              visitorsChange && visitorsChange !== 0
                ? `${visitorsChange > 0 ? "+" : ""}${visitorsChange.toFixed(1)}%`
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
              conversionRateChange && conversionRateChange !== 0
                ? `${conversionRateChange > 0 ? "+" : ""}${conversionRateChange.toFixed(1)}%`
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
              averageDurationChange && averageDurationChange !== 0
                ? `${averageDurationChange > 0 ? "+" : ""}${averageDurationChange.toFixed(1)}%`
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
          devices={analytics?.devices}
          className="col-span-full *:data-[slot=card-content]:space-y-6 xl:col-span-2"
        />

        {/* Baris 3: Grafik Garis Tren Harian & Pola Jam Sibuk */}
        <div className="col-span-full grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TrafficTrendChart
              timeline={analytics?.timeline}
              className="h-full"
            />
          </div>
          <div className="xl:col-span-1">
            <HourlyPatternChart
              hourly={analytics?.hourly}
              className="h-full"
            />
          </div>
        </div>

        {/* Baris 4: Tabel Halaman Terpopuler & Klik Konten */}
        <div className="col-span-full grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TopPagesTable pages={analytics?.pages} className="h-full" />
          </div>
          <div className="xl:col-span-1">
            <ContentClicksCard
              contentClicks={analytics?.contentClicks}
              className="h-full"
            />
          </div>
        </div>

        {/* Baris 5: Datatable Prospek Klien & Profil Pengunjung */}
        <div className="col-span-full grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Card className="w-full py-0 h-full">
              <DashboardTransactionTable data={tableData} />
            </Card>
          </div>
          <div className="xl:col-span-1">
            <AudienceBreakdownCard
              audience={analytics?.audience}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
