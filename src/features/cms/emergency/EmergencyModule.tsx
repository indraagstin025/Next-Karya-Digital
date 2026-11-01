"use client";

import React, { useState } from "react";
import type {
  CmsEmergencyOverview,
  CmsPageItem,
  CmsPortfolio,
  CmsPost,
  CmsServiceItem,
  CmsStaffMember,
} from "../types";
import { formatDateTimeId } from "../utils";
import {
  DANGER_BTN_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BTN_CLASS,
} from "../constants";

interface EmergencyModuleProps {
  emergencyOverview: CmsEmergencyOverview | null;
  staffUsers: CmsStaffMember[];
  posts: CmsPost[];
  portfolios: CmsPortfolio[];
  services: CmsServiceItem[];
  pages: CmsPageItem[];
  apiMutate: (
    endpoint: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: any,
    updatedAtHeader?: string
  ) => Promise<any>;
  loadWorkspaceData: () => Promise<void>;
  setNotice: (notice: { type: "success" | "error" | "info"; text: string } | null) => void;
  mutating: boolean;
}

export function EmergencyModule({
  emergencyOverview,
  staffUsers,
  posts,
  portfolios,
  services,
  pages,
  apiMutate,
  loadWorkspaceData,
  setNotice,
  mutating,
}: EmergencyModuleProps) {
  const [emFormReason, setEmFormReason] = useState("");
  const [emBannerText, setEmBannerText] = useState(
    emergencyOverview?.site?.alertBanner || ""
  );
  const [emBannerReason, setEmBannerReason] = useState("");
  const [emUnpublishEntity, setEmUnpublishEntity] = useState<
    "POST" | "PORTFOLIO" | "SERVICE" | "PAGE"
  >("POST");
  const [emUnpublishTargetId, setEmUnpublishTargetId] = useState("");
  const [emUnpublishReason, setEmUnpublishReason] = useState("");
  const [emRevokeReason, setEmRevokeReason] = useState("");

  const unpublishOptions =
    emUnpublishEntity === "POST"
      ? posts.map((p) => ({ id: p.id, label: `${p.title} (${p.status})` }))
      : emUnpublishEntity === "PORTFOLIO"
      ? portfolios.map((p) => ({ id: p.id, label: `${p.title} (${p.status})` }))
      : emUnpublishEntity === "SERVICE"
      ? services.map((s) => ({ id: s.id, label: `${s.title} (${s.status})` }))
      : pages.map((pg) => ({ id: pg.id, label: `${pg.title} (${pg.status})` }));

  // --- EMERGENCY HANDLERS ---
  async function handleToggleFormLock(lock: boolean) {
    if (emFormReason.trim().length < 5) {
      setNotice({
        type: "error",
        text: "Alasan tindakan darurat wajib diisi minimal 5 karakter.",
      });
      return;
    }
    const endpoint = lock ? "emergency/lock-form" : "emergency/unlock-form";
    const res = await apiMutate(endpoint, "POST", {
      reason: emFormReason.trim(),
    });
    if (res) {
      setNotice({
        type: "success",
        text: res.message,
      });
      setEmFormReason("");
      await loadWorkspaceData();
    }
  }

  async function handleSetEmergencyBanner(isActive: boolean) {
    if (emBannerReason.trim().length < 5) {
      setNotice({
        type: "error",
        text: "Alasan perubahan banner darurat wajib diisi minimal 5 karakter.",
      });
      return;
    }
    const res = await apiMutate("emergency/banner", "POST", {
      isActive,
      alertBanner: isActive ? emBannerText.trim() : null,
      reason: emBannerReason.trim(),
    });
    if (res) {
      setNotice({
        type: "success",
        text: res.message,
      });
      setEmBannerReason("");
      await loadWorkspaceData();
    }
  }

  async function handleEmergencyUnpublish(e: React.FormEvent) {
    e.preventDefault();
    if (!emUnpublishTargetId.trim() || emUnpublishReason.trim().length < 5) {
      setNotice({
        type: "error",
        text: "Pilih konten target dan isi alasan darurat minimal 5 karakter.",
      });
      return;
    }
    const res = await apiMutate("emergency/unpublish", "POST", {
      targetEntity: emUnpublishEntity,
      targetId: emUnpublishTargetId.trim(),
      reason: emUnpublishReason.trim(),
    });
    if (res) {
      setNotice({
        type: "success",
        text: res.message,
      });
      setEmUnpublishReason("");
      await loadWorkspaceData();
    }
  }

  async function handleRevokeUserSessions(user: CmsStaffMember) {
    if (!window.confirm(`Keluarkan ${user.fullName} dari semua perangkat? Yang bersangkutan harus login ulang.`)) return;
    if (emRevokeReason.trim().length < 5) {
      setNotice({
        type: "error",
        text: "Isi alasan pencabutan sesi minimal 5 karakter pada kolom alasan keamanan.",
      });
      return;
    }
    const res = await apiMutate(`users/${user.id}/revoke-sessions`, "POST", {
      reason: emRevokeReason.trim(),
    });
    if (res) {
      setNotice({
        type: "success",
        text:
          res.message ||
          `Sesi login untuk ${user.fullName} berhasil dicabut secara instan.`,
      });
      setEmRevokeReason("");
      await loadWorkspaceData();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header: Page Title and Subtitle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Penanganan Darurat
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Kontrol keamanan darurat, pembatasan akses, dan audit aktivitas situs Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Switch 1: Contact Form Lock */}
        <section
          aria-labelledby="em-lock-heading"
          className="rounded-xl border border-border bg-card text-card-foreground shadow-xs p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2
              id="em-lock-heading"
              className="text-base font-extrabold text-foreground"
            >
              1. Matikan Sementara Formulir Konsultasi
            </h2>
            {emergencyOverview?.site?.isFormLocked ? (
              <span className="rounded-md border border-rose-500/40 bg-rose-950/60 px-2.5 py-1 text-xs font-bold text-destructive">
                DIMATIKAN
              </span>
            ) : (
              <span className="rounded-md border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                NORMAL
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Gunakan saat formulir dibanjiri spam. Pengunjung otomatis diarahkan ke tombol WhatsApp, jadi calon klien tetap bisa menghubungi Anda.
          </p>
          <div>
            <label htmlFor="em-form-reason" className={LABEL_CLASS}>
              Alasan (wajib, minimal 5 karakter)
            </label>
            <input
              id="em-form-reason"
              type="text"
              value={emFormReason}
              onChange={(e) => setEmFormReason(e.target.value)}
              placeholder="Contoh: Formulir dibanjiri spam"
              className={INPUT_CLASS}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={
                mutating || Boolean(emergencyOverview?.site?.isFormLocked)
              }
              onClick={() => handleToggleFormLock(true)}
              className={DANGER_BTN_CLASS}
            >
              Matikan Formulir
            </button>
            <button
              type="button"
              disabled={
                mutating || !emergencyOverview?.site?.isFormLocked
              }
              onClick={() => handleToggleFormLock(false)}
              className={PRIMARY_BTN_CLASS}
            >
              Aktifkan Formulir
            </button>
          </div>
        </section>

        {/* Switch 2: Site-Wide Alert Banner */}
        <section
          aria-labelledby="em-banner-heading"
          className="rounded-xl border border-border bg-card text-card-foreground shadow-xs p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2
              id="em-banner-heading"
              className="text-base font-extrabold text-foreground"
            >
              2. Pengumuman di Bagian Atas Situs
            </h2>
            {emergencyOverview?.site?.isAlertActive ? (
              <span className="rounded-md border border-amber-500/40 bg-amber-950/60 px-2.5 py-1 text-xs font-bold text-[#FBBF24]">
                SEDANG TAMPIL
              </span>
            ) : (
              <span className="rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                TIDAK TAMPIL
              </span>
            )}
          </div>
          <div>
            <label htmlFor="em-banner-text" className={LABEL_CLASS}>
              Isi Pengumuman (maks 300 karakter)
            </label>
            <input
              id="em-banner-text"
              type="text"
              maxLength={300}
              value={emBannerText}
              onChange={(e) => setEmBannerText(e.target.value)}
              placeholder="Contoh: Pemeliharaan terjadwal malam ini pukul 23:00 WIB."
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="em-banner-reason" className={LABEL_CLASS}>
              Alasan (wajib, minimal 5 karakter)
            </label>
            <input
              id="em-banner-reason"
              type="text"
              value={emBannerReason}
              onChange={(e) => setEmBannerReason(e.target.value)}
              placeholder="Contoh: Informasi jadwal maintenance server klien"
              className={INPUT_CLASS}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={mutating}
              onClick={() => handleSetEmergencyBanner(true)}
              className={PRIMARY_BTN_CLASS}
            >
              Tampilkan Pengumuman
            </button>
            <button
              type="button"
              disabled={mutating || !emergencyOverview?.site?.isAlertActive}
              onClick={() => handleSetEmergencyBanner(false)}
              className={DANGER_BTN_CLASS}
            >
              Sembunyikan Pengumuman
            </button>
          </div>
        </section>

        {/* Switch 3: 1-Tap Emergency Unpublish */}
        <section
          aria-labelledby="em-unpublish-heading"
          className="rounded-xl border border-border bg-card text-card-foreground shadow-xs p-5 space-y-4"
        >
          <h2
            id="em-unpublish-heading"
            className="text-base font-extrabold text-foreground"
          >
            3. Tarik Konten dari Situs
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Sembunyikan konten dari situs dan ubah statusnya menjadi draf. Perubahan tampil di situs dalam hitungan detik.
          </p>
          <form onSubmit={handleEmergencyUnpublish} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="em-unpub-type" className={LABEL_CLASS}>
                  Tipe Entitas
                </label>
                <select
                  id="em-unpub-type"
                  value={emUnpublishEntity}
                  onChange={(e) => {
                    setEmUnpublishEntity(e.target.value as any);
                    setEmUnpublishTargetId("");
                  }}
                  className={INPUT_CLASS}
                >
                  <option value="POST">Artikel (POST)</option>
                  <option value="PORTFOLIO">Portofolio (PORTFOLIO)</option>
                  <option value="SERVICE">Layanan (SERVICE)</option>
                  <option value="PAGE">Halaman Statis (PAGE)</option>
                </select>
              </div>
              <div>
                <label htmlFor="em-unpub-target" className={LABEL_CLASS}>
                  Pilih Rekaman Target<span className="text-destructive" aria-hidden="true"> *</span>
                </label>
                <select
                  id="em-unpub-target"
                  value={emUnpublishTargetId}
                  onChange={(e) => setEmUnpublishTargetId(e.target.value)}
                  className={INPUT_CLASS}
                  required
                >
                  <option value="">Pilih konten...</option>
                  {unpublishOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="em-unpub-reason" className={LABEL_CLASS}>
                Alasan Penurunan Darurat (Wajib, min. 5 karakter)<span className="text-destructive" aria-hidden="true"> *</span>
              </label>
              <input
                id="em-unpub-reason"
                type="text"
                required
                value={emUnpublishReason}
                onChange={(e) => setEmUnpublishReason(e.target.value)}
                placeholder="Contoh: Revisi data metrik atas permintaan klien"
                className={INPUT_CLASS}
              />
            </div>
            <button
              type="submit"
              disabled={mutating}
              className={DANGER_BTN_CLASS}
            >
              Tarik Konten Sekarang
            </button>
          </form>
        </section>

        {/* Switch 4: Staff Session Revocation */}
        <section
          aria-labelledby="em-revoke-heading"
          className="rounded-xl border border-border bg-card text-card-foreground shadow-xs p-5 space-y-4"
        >
          <h2
            id="em-revoke-heading"
            className="text-base font-extrabold text-foreground"
          >
            4. Pencabutan Sesi Staf Instan (Token Revocation)
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Menaikkan <span className="font-mono text-foreground">tokenVersion</span>{" "}
            di PostgreSQL &amp; Redis sehingga seluruh token JWT aktif milik staf
            tersebut gugur seketika.
          </p>
          <div>
            <label htmlFor="em-revoke-reason" className={LABEL_CLASS}>
              Alasan Keamanan Pencabutan Sesi (Wajib sebelum klik Cabut Sesi)
            </label>
            <input
              id="em-revoke-reason"
              type="text"
              value={emRevokeReason}
              onChange={(e) => setEmRevokeReason(e.target.value)}
              placeholder="Contoh: Pergantian perangkat kerja staf"
              className={INPUT_CLASS}
            />
          </div>
          <div className="space-y-2.5">
            {staffUsers.map((u) => (
              <div
                key={u.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-muted/30 p-3 text-xs"
              >
                <div>
                  <p className="font-bold text-foreground">
                    {u.fullName}{" "}
                    <span className="font-mono text-[11px] text-primary">
                      (v{u.tokenVersion ?? 0})
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    {u.email} • {u.jobTitle}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={mutating}
                  onClick={() => handleRevokeUserSessions(u)}
                  className={DANGER_BTN_CLASS}
                >
                  Cabut Sesi
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Immutable Emergency Audit Log Table */}
      <section
        aria-labelledby="em-audit-heading"
        className="rounded-xl border border-border bg-card text-card-foreground shadow-xs p-5"
      >
        <h2
          id="em-audit-heading"
          className="border-b border-border pb-3 text-base font-extrabold text-foreground"
        >
          Jejak Audit Darurat (Immutable Emergency Audit Logs)
        </h2>
        {!emergencyOverview?.emergencyLogs ||
        emergencyOverview.emergencyLogs.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            Belum ada riwayat tindakan darurat yang tercatat.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2.5 pr-4 font-bold">Waktu (WIB)</th>
                  <th className="py-2.5 pr-4 font-bold">Tindakan</th>
                  <th className="py-2.5 pr-4 font-bold">Target</th>
                  <th className="py-2.5 pr-4 font-bold">Eksekutor</th>
                  <th className="py-2.5 font-bold">Alasan Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3358]">
                {emergencyOverview.emergencyLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-3 pr-4 tabular-nums text-muted-foreground">
                      {formatDateTimeId(log.createdAt)}
                    </td>
                    <td className="py-3 pr-4 font-mono font-bold text-[#FBBF24]">
                      {log.actionType}
                    </td>
                    <td className="py-3 pr-4 font-mono text-foreground">
                      {log.targetEntity}:{log.targetId}
                    </td>
                    <td className="py-3 pr-4 text-foreground">
                      {log.actor?.fullName || "Staf Internal"}
                    </td>
                    <td className="py-3 text-muted-foreground">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
