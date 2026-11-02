"use client";

import React, { useState } from "react";
import { AlertTriangleIcon, Loader2Icon, ShieldAlertIcon, XIcon } from "lucide-react";
import { DANGER_BTN_CLASS, SECONDARY_BTN_CLASS } from "../constants";

export interface EmergencyTakedownTarget {
  entityType: "POST" | "PORTFOLIO";
  entityId: string;
  title: string;
  slug?: string;
}

export interface EmergencyTakedownDialogProps {
  open: boolean;
  target: EmergencyTakedownTarget | null;
  onClose: () => void;
  onConfirm: (target: EmergencyTakedownTarget, reason: string) => Promise<void>;
}

export function EmergencyTakedownDialog({
  open,
  target,
  onClose,
  onConfirm,
}: EmergencyTakedownDialogProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !target) return null;

  const entityLabel = target.entityType === "POST" ? "Artikel Blog" : "Portofolio Klien";
  const isValidReason = reason.trim().length >= 5;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!target) return;

    if (!isValidReason) {
      setError("Alasan takedown darurat wajib diisi minimal 5 karakter.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onConfirm(target, reason.trim());
      setReason("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Gagal melakukan takedown darurat. Silakan coba kembali.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    if (submitting) return;
    setReason("");
    setError(null);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-takedown-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-destructive/30 bg-card p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
              <ShieldAlertIcon className="size-5" />
            </div>
            <div>
              <h3
                id="emergency-takedown-title"
                className="text-base font-bold text-foreground flex items-center gap-2"
              >
                Takedown Darurat
                <span className="rounded-md bg-destructive/15 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                  Protokol Keamanan
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pencabutan publikasi instan untuk mitigasi insiden konten.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors disabled:opacity-50"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Target Info */}
        <div className="rounded-xl border border-border bg-muted/40 p-3.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Tipe Konten</span>
            <span className="font-medium text-foreground">{entityLabel}</span>
          </div>
          <div className="flex items-start justify-between gap-3 pt-1 border-t border-border/60">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground shrink-0 mt-0.5">
              Judul
            </span>
            <span className="font-semibold text-foreground text-right truncate max-w-xs">
              {target.title}
            </span>
          </div>
          {target.slug && (
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>Path:</span>
              <span className="truncate max-w-xs">/{target.slug}</span>
            </div>
          )}
        </div>

        {/* Audit Warning Callout */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangleIcon className="size-4 shrink-0 mt-0.5 text-amber-500" />
          <div className="space-y-1 leading-relaxed">
            <p className="font-semibold">Perhatian Audit Keamanan:</p>
            <p className="text-[11px] opacity-90">
              Status konten akan langsung dikembalikan ke DRAF, cache publik dibersihkan, dan catatan
              penarikan ini direkam permanen dalam Emergency Audit Log beserta identitas staf eksekutor.
            </p>
          </div>
        </div>

        {/* Reason Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="takedown-reason"
                className="text-xs font-semibold text-foreground"
              >
                Alasan Takedown Darurat <span className="text-destructive">*</span>
              </label>
              <span
                className={`text-[11px] ${
                  isValidReason ? "text-muted-foreground" : "text-destructive font-medium"
                }`}
              >
                {reason.trim().length}/5 karakter
              </span>
            </div>
            <textarea
              id="takedown-reason"
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: Menarik konten karena klaim hak cipta gambar atau perbaikan materi sensitif dari prinsipal klien."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:border-destructive"
              disabled={submitting}
              autoFocus
            />
            {error && (
              <p className="text-[11px] font-medium text-destructive mt-1">{error}</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className={SECONDARY_BTN_CLASS}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || !isValidReason}
              className={`${DANGER_BTN_CLASS} flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting ? (
                <>
                  <Loader2Icon className="size-3.5 animate-spin" />
                  Memproses Takedown...
                </>
              ) : (
                <>
                  <ShieldAlertIcon className="size-3.5" />
                  Eksekusi Takedown
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmergencyTakedownDialog;
