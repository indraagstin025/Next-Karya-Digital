"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOutIcon, RefreshCwIcon, ShieldCheckIcon } from "lucide-react";
import type { StructuredSubTab } from "./types";
import {
  DashboardView,
  type AnalyticsDateRange,
  type PeriodFilter,
} from "@/features/dashboard";
import { CrmView } from "@/features/crm";
import { PostModule } from "./posts/PostModule";
import { PortfolioModule } from "./portfolios/PortfolioModule";
import { ServiceModule } from "./services/ServiceModule";
import { MediaModule } from "./media/MediaModule";
import { StructuredModule } from "./structured/StructuredModule";
import { EmergencyModule } from "./emergency/EmergencyModule";
import { TeamModule } from "./team/TeamModule";
import { PasswordCard } from "./profile/PasswordCard";
import { useWorkspace } from "./WorkspaceContext";
import { DANGER_BTN_CLASS } from "./constants";

export type WorkspaceSectionId =
  | "dashboard"
  | "posts"
  | "portfolios"
  | "services"
  | "structured-faqs"
  | "structured-testimonials"
  | "structured-pages"
  | "structured-redirects"
  | "media"
  | "crm-leads"
  | "crm-schedules"
  | "emergency"
  | "team"
  | "profile";

export interface WorkspaceSectionProps {
  section: WorkspaceSectionId;
}

const structuredSubTabs: Record<
  Extract<WorkspaceSectionId, `structured-${string}`>,
  StructuredSubTab
> = {
  "structured-faqs": "faqs",
  "structured-testimonials": "testimonials",
  "structured-pages": "pages",
  "structured-redirects": "redirects",
};

const structuredPaths: Record<StructuredSubTab, string> = {
  faqs: "/cms/konten-pendukung/faq",
  testimonials: "/cms/konten-pendukung/testimoni",
  pages: "/cms/konten-pendukung/halaman",
  redirects: "/cms/konten-pendukung/pengalihan",
};

const workspacePaths: Record<string, string> = {
  dashboard: "/dashboard",
  posts: "/cms/artikel",
  portfolios: "/cms/portofolio",
  services: "/cms/layanan",
  structured: structuredPaths.faqs,
  media: "/cms/media",
  crm: "/crm/calon-klien",
  emergency: "/pengaturan/darurat",
  team: "/pengaturan/anggota",
  profile: "/pengaturan/profil",
};

export function WorkspaceSection({ section }: WorkspaceSectionProps) {
  const router = useRouter();
  const {
    currentUser,
    data,
    mutation,
    refreshWorkspaceSilently,
    openSnapshotModal,
    handleLogout,
  } = useWorkspace();

  const [dashboardPeriod, setDashboardPeriod] = useState<PeriodFilter>("30d");
  const [dashboardRange, setDashboardRange] =
    useState<AnalyticsDateRange | null>(null);

  const handleDashboardPeriodChange = useCallback(
    (period: PeriodFilter, range: AnalyticsDateRange | null = null) => {
      setDashboardPeriod(period);
      setDashboardRange(period === "custom" ? range : null);
      data.refreshAnalyticsByPeriod(
        period,
        period === "custom" ? range : null
      );
    },
    [data]
  );

  const handleNavigateTab = useCallback(
    (tab: string, sub?: string) => {
      if (tab === "structured" && sub && sub in structuredPaths) {
        router.push(structuredPaths[sub as StructuredSubTab]);
        return;
      }

      const target = workspacePaths[tab];
      if (target) router.push(target);
    },
    [router]
  );

  const handleStructuredSubTabChange = useCallback(
    (sub: StructuredSubTab) => {
      router.push(structuredPaths[sub]);
    },
    [router]
  );

  const handleCrmSubViewChange = useCallback(
    (view: "leads" | "schedules") => {
      router.push(view === "leads" ? "/crm/calon-klien" : "/crm/jadwal");
    },
    [router]
  );

  if (data.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <RefreshCwIcon className="size-8 animate-spin text-primary" />
        <p className="mt-4 text-sm font-semibold text-foreground">
          Memuat data Command Center...
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Sinkronisasi basis data PostgreSQL &amp; Redis
        </p>
      </div>
    );
  }

  if (section === "dashboard") {
    return (
      <DashboardView
        totalLeadsCount={data.leads.length}
        newLeadsCount={data.leads.filter((l) => l.status === "BARU").length}
        leadsPreview={data.leads.map((l) => ({
          id: l.id,
          clientName: l.clientName,
          companyName: l.companyName,
          serviceRequested: l.serviceRequested,
          whatsappNumber: l.whatsappNumber,
          dealValue: l.dealValue,
          status: l.status,
        }))}
        publishedPostsCount={
          data.posts.filter((p) => p.status === "PUBLISHED").length
        }
        publishedPortfoliosCount={
          data.portfolios.filter((p) => p.status === "PUBLISHED").length
        }
        analytics={data.analyticsOverview}
        selectedPeriod={dashboardPeriod}
        selectedRange={dashboardRange}
        onPeriodChange={handleDashboardPeriodChange}
        emergencyNotice={
          data.emergencyOverview?.site
            ? {
                isFormLocked: Boolean(data.emergencyOverview.site.isFormLocked),
                isAlertActive: Boolean(data.emergencyOverview.site.isAlertActive),
                alertBanner: data.emergencyOverview.site.alertBanner,
              }
            : null
        }
        onNavigateTab={handleNavigateTab}
      />
    );
  }

  if (section === "posts") {
    return (
      <PostModule
        posts={data.posts}
        categories={data.categories}
        onRefresh={refreshWorkspaceSilently}
        apiMutate={mutation.apiMutate}
        setNotice={mutation.setBannerNotice}
        openSnapshotModal={(entityType, entityId, title) =>
          openSnapshotModal(entityType, entityId, title)
        }
      />
    );
  }

  if (section === "portfolios") {
    return (
      <PortfolioModule
        portfolios={data.portfolios}
        mediaItems={data.mediaItems}
        onRefresh={refreshWorkspaceSilently}
        apiMutate={mutation.apiMutate}
        setNotice={mutation.setBannerNotice}
        openSnapshotModal={(entityType, entityId, title) =>
          openSnapshotModal(entityType, entityId, title)
        }
      />
    );
  }

  if (section === "services") {
    return (
      <ServiceModule
        services={data.services}
        onRefresh={refreshWorkspaceSilently}
        apiMutate={mutation.apiMutate}
        setNotice={mutation.setBannerNotice}
        openSnapshotModal={(entityType, entityId, title) =>
          openSnapshotModal(entityType, entityId, title)
        }
      />
    );
  }

  if (section in structuredSubTabs) {
    return (
      <StructuredModule
        subTab={structuredSubTabs[section as keyof typeof structuredSubTabs]}
        setStructuredSubTab={handleStructuredSubTabChange}
        faqs={data.faqs}
        testimonials={data.testimonials}
        pages={data.pages}
        redirects={data.redirects}
        portfolios={data.portfolios}
        apiMutate={mutation.apiMutate}
        loadWorkspaceData={refreshWorkspaceSilently}
        setNotice={mutation.setBannerNotice}
        openSnapshotModal={(entityType, entityId, title) =>
          openSnapshotModal(
            entityType as "POST" | "PORTFOLIO" | "SERVICE" | "PAGE",
            entityId,
            title
          )
        }
        mutating={mutation.mutating}
      />
    );
  }

  if (section === "media") {
    return (
      <MediaModule
        mediaItems={data.mediaItems}
        onRefresh={refreshWorkspaceSilently}
        apiMutate={mutation.apiMutate}
        setNotice={mutation.setBannerNotice}
      />
    );
  }

  if (section === "crm-leads" || section === "crm-schedules") {
    return (
      <CrmView
        activeSubView={section === "crm-leads" ? "leads" : "schedules"}
        onSubViewChange={handleCrmSubViewChange}
        leads={data.leads}
        schedules={data.schedules}
        staffUsers={data.staffUsers}
        onRefresh={refreshWorkspaceSilently}
        apiMutate={mutation.apiMutate}
        setNotice={mutation.setBannerNotice}
      />
    );
  }

  if (section === "emergency") {
    return (
      <EmergencyModule
        emergencyOverview={data.emergencyOverview}
        staffUsers={data.staffUsers}
        posts={data.posts}
        portfolios={data.portfolios}
        services={data.services}
        pages={data.pages}
        apiMutate={mutation.apiMutate}
        loadWorkspaceData={data.loadWorkspaceData}
        setNotice={mutation.setBannerNotice}
        mutating={mutation.mutating}
      />
    );
  }

  if (section === "team") {
    return <TeamModule />;
  }

  if (section === "profile") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Profil Saya
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Informasi akun staf dan kendali sesi login aktif Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                {currentUser.fullName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  {currentUser.fullName}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {currentUser.jobTitle || "Internal Staff"}
                </p>
                <span className="mt-1 inline-flex rounded-md border border-emerald-500/40 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {currentUser.isAdmin ? "ADMIN" : currentUser.role}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium text-foreground">{currentUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID Pengguna:</span>
                <span className="font-mono text-muted-foreground">{currentUser.id}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-base font-bold text-foreground">Keamanan Sesi</h2>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sesi Anda dilindungi token otentikasi JWT dengan pembatasan rotasi dan pencabutan real-time via Redis.
                {!currentUser.isAdmin &&
                  " Kata sandi akun Anda dikelola terpusat oleh admin."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className={`${DANGER_BTN_CLASS} w-full flex items-center justify-center gap-2`}
            >
              <LogOutIcon className="size-4" />
              Keluar dari Sesi CMS
            </button>
          </div>

          {currentUser.isAdmin && <PasswordCard />}
        </div>
      </div>
    );
  }

  return null;
}
