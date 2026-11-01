"use client";

import React from "react";

export interface DashboardLeadPreview {
  id: string;
  clientName: string;
  companyName?: string | null;
  serviceRequested: string;
  whatsappNumber: string;
  status: string;
}

interface RecentLeadsCardProps {
  leads: DashboardLeadPreview[];
  onNavigateToCrm: () => void;
}

export function RecentLeadsCard({
  leads,
  onNavigateToCrm,
}: RecentLeadsCardProps) {
  return (
    <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Prospek Masuk Terbaru</h3>
          <p className="text-xs text-muted-foreground">
            Daftar permohonan konsultasi dari calon klien melalui website.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateToCrm}
          className="text-xs font-medium text-primary hover:underline"
        >
          Lihat Semua
        </button>
      </div>

      <div className="mt-3 divide-y divide-border">
        {leads.slice(0, 5).map((lead) => (
          <div key={lead.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                {lead.clientName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {lead.clientName}
                  {lead.companyName ? ` (${lead.companyName})` : ""}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  Layanan: {lead.serviceRequested}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                {lead.whatsappNumber}
              </span>
              <span className="rounded-md border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                {lead.status}
              </span>
            </div>
          </div>
        ))}

        {leads.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Belum ada prospek konsultasi yang masuk.
          </div>
        )}
      </div>
    </div>
  );
}
