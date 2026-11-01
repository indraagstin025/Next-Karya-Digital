"use client";

import React from "react";
import type { CmsSnapshotItem } from "../types";
import { formatDateTimeId } from "../utils";
import { PRIMARY_BTN_CLASS, SECONDARY_BTN_CLASS } from "../constants";

interface SnapshotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: string;
  title: string;
  loading: boolean;
  items: CmsSnapshotItem[];
  onRestore: (snapshotId: string) => Promise<void>;
  mutating: boolean;
}

export function SnapshotDialog({
  isOpen,
  onClose,
  entityType,
  title,
  loading,
  items,
  onRestore,
  mutating,
}: SnapshotDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="snapshot-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
    >
      <div className="w-full max-w-[640px] rounded-xl border border-border bg-card text-card-foreground shadow-xs p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
          <div>
            <span className="inline-flex rounded-md border border-sky-400/40 bg-sky-950/60 px-2 py-0.5 font-mono text-[11px] font-bold text-primary">
              Menyimpan 5 versi terakhir ({entityType})
            </span>
            <h2
              id="snapshot-modal-title"
              className="mt-1.5 text-base font-extrabold text-foreground"
            >
              Riwayat Versi: {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={SECONDARY_BTN_CLASS}
          >
            Tutup (Esc)
          </button>
        </div>

        {loading ? (
          <p className="py-8 text-center text-xs text-muted-foreground">
            Memuat riwayat versi dari server...
          </p>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted/40 p-5 text-center text-xs text-muted-foreground">
            Belum ada versi tersimpan. Versi baru tersimpan otomatis setiap kali Anda menekan <strong>Tayangkan</strong>.
          </div>
        ) : (
          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
            {items.map((snap) => (
              <div
                key={snap.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-4 text-xs"
              >
                <div className="space-y-1">
                  <p className="font-bold text-foreground">
                    Versi #{snap.version} • {snap.title}
                  </p>
                  <p className="tabular-nums text-muted-foreground">
                    Disimpan pada {formatDateTimeId(snap.createdAt)} oleh{" "}
                    {snap.author?.fullName || "Staf"}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={mutating}
                  onClick={() => onRestore(snap.id)}
                  className={PRIMARY_BTN_CLASS}
                >
                  Kembalikan sebagai Draf
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
