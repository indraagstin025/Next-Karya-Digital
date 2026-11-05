"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "lucide-react";
import type { CmsStaffUser } from "@/lib/cms-server";
import type { CmsSnapshotItem } from "./types";
import { CmsShell } from "./CmsShell";
import { ConflictModal } from "./components/ConflictModal";
import { SnapshotDialog } from "./snapshots/SnapshotDialog";
import { useCmsData } from "./hooks/useCmsData";
import { useCmsMutation } from "./hooks/useCmsMutation";
import {
  WorkspaceContext,
  type SnapshotEntityType,
} from "./WorkspaceContext";

export interface AdminWorkspaceProps {
  currentUser: CmsStaffUser;
  children: React.ReactNode;
}

export function AdminWorkspace({ currentUser, children }: AdminWorkspaceProps) {
  const router = useRouter();

  const data = useCmsData();
  const mutation = useCmsMutation();

  const { loadWorkspaceData } = data;

  const refreshWorkspaceSilently = useCallback(
    () => loadWorkspaceData({ silent: true }),
    [loadWorkspaceData]
  );

  const {
    mutating,
    bannerNotice,
    setBannerNotice,
    clearNotice,
    conflictModal,
    clearConflict,
    apiMutate,
  } = mutation;

  const [snapshotModal, setSnapshotModal] = useState<{
    entityType: SnapshotEntityType;
    entityId: string;
    title: string;
    items: CmsSnapshotItem[];
    loading: boolean;
  } | null>(null);

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

  async function openSnapshotModal(
    entityType: SnapshotEntityType,
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

  async function handleLogout() {
    await fetch("/api/cms/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <WorkspaceContext.Provider
      value={{
        currentUser,
        data,
        mutation,
        refreshWorkspaceSilently,
        openSnapshotModal,
        handleLogout,
      }}
    >
      <CmsShell isAdmin={Boolean(currentUser.isAdmin)}>
        <div className="min-w-0 space-y-6">
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

          {data.loadError && (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-700 sm:flex-row sm:items-center sm:justify-between sm:text-sm dark:text-amber-300"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangleIcon className="size-4 shrink-0" />
                <p className="font-semibold">{data.loadError}</p>
              </div>
              <button
                type="button"
                onClick={() => loadWorkspaceData()}
                className="min-h-11 shrink-0 rounded-md border border-amber-500/40 px-3 py-1.5 text-xs font-bold hover:bg-amber-500/10 cursor-pointer"
              >
                Coba lagi
              </button>
            </div>
          )}

          {children}
        </div>

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

        <ConflictModal
          isOpen={Boolean(conflictModal)}
          onClose={clearConflict}
          conflictData={conflictModal}
          onReload={loadWorkspaceData}
        />
      </CmsShell>
    </WorkspaceContext.Provider>
  );
}
