"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  LogOutIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  UserCheckIcon,
} from "lucide-react";
import type { CmsStaffUser } from "@/lib/cms-server";
import type { CmsSnapshotItem } from "./types";
import { AdminTemplateShell } from "./AdminTemplateShell";
import { ConflictModal } from "./components/ConflictModal";
import { SnapshotDialog } from "./snapshots/SnapshotDialog";
import { DashboardView } from "@/features/dashboard";
import { CrmView } from "@/features/crm";
import { PostModule } from "./posts/PostModule";
import { PortfolioModule } from "./portfolios/PortfolioModule";
import { ServiceModule } from "./services/ServiceModule";
import { MediaModule } from "./media/MediaModule";
import { StructuredModule } from "./structured/StructuredModule";
import { EmergencyModule } from "./emergency/EmergencyModule";
import { useCmsData } from "./hooks/useCmsData";
import { useCmsMutation } from "./hooks/useCmsMutation";
import {
  DANGER_BTN_CLASS,
  PRIMARY_BTN_CLASS,
  SECONDARY_BTN_CLASS,
} from "./constants";

export interface CmsWorkspaceProps {
  currentUser: CmsStaffUser;
}

export function CmsWorkspace({ currentUser }: CmsWorkspaceProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);

  // Centralized CMS Data
  const {
    activeTab,
    setActiveTab,
    subTab,
    setStructuredSubTab,
    loading,
    categories,
    posts,
    portfolios,
    services,
    faqs,
    testimonials,
    pages,
    redirects,
    mediaItems,
    staffUsers,
    leads,
    schedules,
    analyticsOverview,
    emergencyOverview,
    loadWorkspaceData,
  } = useCmsData();

  // Centralized Mutation Handler
  const {
    mutating,
    bannerNotice,
    setBannerNotice,
    clearNotice,
    conflictModal,
    clearConflict,
    apiMutate,
  } = useCmsMutation();

  // Version History Snapshot Dialog State
  const [snapshotModal, setSnapshotModal] = useState<{
    entityType: "POST" | "PORTFOLIO" | "SERVICE" | "PAGE";
    entityId: string;
    title: string;
    items: CmsSnapshotItem[];
    loading: boolean;
  } | null>(null);

  // Close modals on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSnapshotModal(null);
        clearConflict();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearConflict]);

  // Open snapshot history modal
  async function openSnapshotModal(
    entityType: "POST" | "PORTFOLIO" | "SERVICE" | "PAGE",
    entityId: string,
    title: string
  ) {
    setSnapshotModal({
      entityType,
      entityId,
      title,
      items: [],
      loading: true,
    });

    try {
      const res = await fetch(
        `/api/cms/content-snapshots?entityType=${entityType}&entityId=${encodeURIComponent(
          entityId
        )}`
      );
      const payload = await res.json();
      setSnapshotModal({
        entityType,
        entityId,
        title,
        items: payload?.success && Array.isArray(payload.data) ? payload.data : [],
        loading: false,
      });
    } catch {
      setSnapshotModal((prev) => (prev ? { ...prev, loading: false } : null));
    }
  }

  // Restore snapshot version
  async function handleRestoreSnapshot(snapshotId: string) {
    const res = await apiMutate(`content-snapshots/${snapshotId}/restore`, "POST", {});
    if (res) {
      setBannerNotice({
        type: "success",
        text: res.message || "Versi tersimpan berhasil dipulihkan sebagai draf.",
      });
      setSnapshotModal(null);
      await loadWorkspaceData();
    }
  }

  // Sign out handler
  async function handleLogout() {
    await fetch("/api/cms/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <AdminTemplateShell
      currentUser={currentUser}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      subTab={subTab}
      setStructuredSubTab={setStructuredSubTab}
      isDark={isDark}
      setIsDark={setIsDark}
      loading={loading}
      mutating={mutating}
      onRefresh={loadWorkspaceData}
      onLogout={handleLogout}
      counts={{
        posts: posts.length,
        portfolios: portfolios.length,
        services: services.length,
        structured: faqs.length + testimonials.length + pages.length + redirects.length,
        media: mediaItems.length,
        leads: leads.length,
        emergency: emergencyOverview?.emergencyLogs?.length || 0,
      }}
      emergencyOverview={emergencyOverview}
    >
      <div className="min-w-0 space-y-6">
        {/* Banner Notification */}
        {bannerNotice && (
          <div
            role={bannerNotice.type === "error" ? "alert" : "status"}
            className={`flex items-center justify-between gap-4 rounded-xl border p-4 text-xs sm:text-sm ${
              bannerNotice.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : bannerNotice.type === "info"
                ? "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {bannerNotice.type === "success" && (
                <CheckCircle2Icon className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              )}
              {bannerNotice.type === "info" && (
                <InfoIcon className="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
              )}
              {bannerNotice.type === "error" && (
                <AlertTriangleIcon className="size-4 shrink-0 text-destructive" />
              )}
              <p className="font-semibold">{bannerNotice.text}</p>
            </div>
            <button
              type="button"
              onClick={clearNotice}
              className="min-h-11 shrink-0 rounded-md border border-current/30 px-3 py-1.5 text-xs font-bold hover:bg-black/20 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Global Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <RefreshCwIcon className="size-8 animate-spin text-primary" />
            <p className="mt-4 text-sm font-semibold text-foreground">
              Memuat data CMS Next Karya...
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sinkronisasi basis data PostgreSQL &amp; Redis
            </p>
          </div>
        ) : (
          <>
            {/* TAB 0: DASHBOARD OVERVIEW */}
            {activeTab === "dashboard" && (
              <DashboardView
                totalLeadsCount={leads.length}
                newLeadsCount={leads.filter((l) => l.status === "BARU").length}
                dealLeadsCount={leads.filter((l) => l.status === "DEAL").length}
                leadsPreview={leads.map((l) => ({
                  id: l.id,
                  clientName: l.clientName,
                  companyName: l.companyName,
                  serviceRequested: l.serviceRequested,
                  whatsappNumber: l.whatsappNumber,
                  status: l.status,
                }))}
                publishedPostsCount={posts.filter((p) => p.status === "PUBLISHED").length}
                totalPostsCount={posts.length}
                publishedPortfoliosCount={portfolios.filter((p) => p.status === "PUBLISHED").length}
                totalPortfoliosCount={portfolios.length}
                publishedServicesCount={services.filter((s) => s.status === "PUBLISHED").length}
                totalServicesCount={services.length}
                analytics={analyticsOverview}
                emergencyNotice={
                  emergencyOverview?.site
                    ? {
                        isFormLocked: Boolean(emergencyOverview.site.isFormLocked),
                        isAlertActive: Boolean(emergencyOverview.site.isAlertActive),
                        alertBanner: emergencyOverview.site.alertBanner,
                      }
                    : null
                }
                onNavigateTab={(tab, sub) => {
                  setActiveTab(tab as any);
                  if (sub) setStructuredSubTab(sub as any);
                }}
                onNewPost={() => setActiveTab("posts")}
                onNewPortfolio={() => setActiveTab("portfolios")}
              />
            )}

            {/* TAB 1: ARTIKEL BLOG */}
            {activeTab === "posts" && (
              <PostModule
                posts={posts}
                categories={categories}
                mediaItems={mediaItems}
                onRefresh={loadWorkspaceData}
                apiMutate={apiMutate}
                setNotice={setBannerNotice}
                openSnapshotModal={(entityType, entityId, title) =>
                  openSnapshotModal(entityType, entityId, title)
                }
              />
            )}

            {/* TAB 2: PORTOFOLIO KLIEN */}
            {activeTab === "portfolios" && (
              <PortfolioModule
                portfolios={portfolios}
                mediaItems={mediaItems}
                onRefresh={loadWorkspaceData}
                apiMutate={apiMutate}
                setNotice={setBannerNotice}
                openSnapshotModal={(entityType, entityId, title) =>
                  openSnapshotModal(entityType, entityId, title)
                }
              />
            )}

            {/* TAB 3: PAKET LAYANAN */}
            {activeTab === "services" && (
              <ServiceModule
                services={services}
                onRefresh={loadWorkspaceData}
                apiMutate={apiMutate}
                setNotice={setBannerNotice}
                openSnapshotModal={(entityType, entityId, title) =>
                  openSnapshotModal(entityType, entityId, title)
                }
              />
            )}

            {/* TAB 4: KONTEN PENDUKUNG (FAQ, TESTIMONI, HALAMAN STATIS, REDIRECT) */}
            {activeTab === "structured" && (
              <StructuredModule
                subTab={subTab}
                setStructuredSubTab={setStructuredSubTab}
                faqs={faqs}
                testimonials={testimonials}
                pages={pages}
                redirects={redirects}
                portfolios={portfolios}
                apiMutate={apiMutate}
                loadWorkspaceData={loadWorkspaceData}
                setNotice={setBannerNotice}
                openSnapshotModal={(entityType, entityId, title) =>
                  openSnapshotModal(
                    entityType as "POST" | "PORTFOLIO" | "SERVICE" | "PAGE",
                    entityId,
                    title
                  )
                }
                mutating={mutating}
              />
            )}

            {/* TAB 5: PUSTAKA MEDIA */}
            {activeTab === "media" && (
              <MediaModule
                mediaItems={mediaItems}
                onRefresh={loadWorkspaceData}
                apiMutate={apiMutate}
                setNotice={setBannerNotice}
              />
            )}

            {/* TAB 6: CRM & CALON KLIEN */}
            {activeTab === "crm" && (
              <CrmView
                leads={leads}
                schedules={schedules}
                staffUsers={staffUsers}
                onRefresh={loadWorkspaceData}
                apiMutate={apiMutate}
                setNotice={setBannerNotice}
              />
            )}

            {/* TAB 7: PENANGANAN DARURAT */}
            {activeTab === "emergency" && (
              <EmergencyModule
                emergencyOverview={emergencyOverview}
                staffUsers={staffUsers}
                posts={posts}
                portfolios={portfolios}
                services={services}
                pages={pages}
                apiMutate={apiMutate}
                loadWorkspaceData={loadWorkspaceData}
                setNotice={setBannerNotice}
                mutating={mutating}
              />
            )}

            {/* TAB 8: PROFIL PENGGUNA */}
            {activeTab === "profile" && (
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
                          {currentUser.role}
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
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Snapshot Version History & Restore Modal */}
      <SnapshotDialog
        isOpen={Boolean(snapshotModal)}
        onClose={() => setSnapshotModal(null)}
        entityType={snapshotModal?.entityType || ""}
        title={snapshotModal?.title || ""}
        loading={Boolean(snapshotModal?.loading)}
        items={snapshotModal?.items || []}
        onRestore={handleRestoreSnapshot}
        mutating={mutating}
      />

      {/* Concurrent Modification Conflict Modal */}
      <ConflictModal
        isOpen={Boolean(conflictModal)}
        onClose={clearConflict}
        conflictData={conflictModal}
        onReload={loadWorkspaceData}
      />
    </AdminTemplateShell>
  );
}
