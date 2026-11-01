"use client";

import React from "react";
import { PRIMARY_BTN_CLASS, SECONDARY_BTN_CLASS } from "../constants";

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflictData: { message: string; currentData?: any } | null;
  onReload: () => Promise<void>;
}

export function ConflictModal({
  isOpen,
  onClose,
  conflictData,
  onReload,
}: ConflictModalProps) {
  if (!isOpen || !conflictData) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div className="w-full max-w-[540px] rounded-2xl border border-rose-500/60 bg-card text-card-foreground p-6 shadow-2xl space-y-4">
        <span className="inline-flex rounded-md border border-rose-500/40 bg-rose-950/70 px-2.5 py-1 text-xs font-bold text-destructive">
          Data sudah berubah
        </span>
        <h2
          id="conflict-modal-title"
          className="text-lg font-extrabold text-foreground"
        >
          Data ini baru saja diubah orang lain
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {conflictData.message} Perubahan Anda tidak disimpan agar pekerjaan rekan tim tidak tertimpa. Muat ulang data, lalu ulangi perubahan Anda.
        </p>
        {conflictData.currentData && (
          <div className="rounded-xl border border-border bg-muted/40 p-3.5 text-xs space-y-1">
            <p className="font-bold text-foreground">
              Versi terbaru:
            </p>
            <p className="text-muted-foreground">
              Judul/Nama:{" "}
              <strong className="text-foreground">
                {conflictData.currentData.title ||
                  conflictData.currentData.question ||
                  conflictData.currentData.clientName}
              </strong>
            </p>
            <p className="tabular-nums text-muted-foreground">
              Terakhir diubah:{" "}
              <span className="font-mono text-primary">
                {conflictData.currentData.updatedAt}
              </span>
            </p>
          </div>
        )}
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={SECONDARY_BTN_CLASS}
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={async () => {
              onClose();
              await onReload();
            }}
            className={PRIMARY_BTN_CLASS}
          >
            Muat Ulang Data Terbaru
          </button>
        </div>
      </div>
    </div>
  );
}
