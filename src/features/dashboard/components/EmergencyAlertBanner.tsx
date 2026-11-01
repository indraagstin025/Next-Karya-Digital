"use client";

import React from "react";
import { ShieldAlertIcon } from "lucide-react";
import type { DashboardEmergencyNotice } from "../types";

interface EmergencyAlertBannerProps {
  notice?: DashboardEmergencyNotice | null;
  onNavigateToEmergency: () => void;
}

export function EmergencyAlertBanner({
  notice,
  onNavigateToEmergency,
}: EmergencyAlertBannerProps) {
  if (!notice) return null;
  const { isFormLocked, isAlertActive, alertBanner } = notice;

  if (!isFormLocked && !(isAlertActive && alertBanner)) {
    return null;
  }

  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4">
      <div className="flex items-start gap-3">
        <ShieldAlertIcon className="size-5 shrink-0 text-destructive mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-destructive">
            Status Darurat Aktif pada Website
          </h4>
          {isFormLocked && (
            <p className="mt-1 text-xs text-destructive/90">
              Formulir konsultasi publik sedang dikunci (pencegahan spam). Pengunjung otomatis diarahkan ke kontak WhatsApp saat ini.
            </p>
          )}
          {isAlertActive && alertBanner && (
            <p className="mt-1 text-xs text-destructive/90">
              Banner pengumuman darurat tayang: &quot;{alertBanner}&quot;
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onNavigateToEmergency}
          className="text-xs font-semibold text-destructive hover:underline shrink-0"
        >
          Kelola Darurat
        </button>
      </div>
    </div>
  );
}
