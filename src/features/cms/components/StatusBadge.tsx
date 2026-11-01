import React from "react";
import type { ContentStatus, LeadStatus } from "../types";

export function StatusBadge({ status }: { status: ContentStatus }) {
  if (status === "PUBLISHED") {
    return (
      <span className="inline-flex items-center rounded-md border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
        Sudah tayang
      </span>
    );
  }
  if (status === "ARCHIVED") {
    return (
      <span className="inline-flex items-center rounded-md border border-rose-500/40 bg-rose-950/60 px-2.5 py-0.5 text-[11px] font-bold text-destructive">
        Diarsipkan
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md border border-amber-500/40 bg-amber-950/60 px-2.5 py-0.5 text-[11px] font-bold text-[#FBBF24]">
      Draf
    </span>
  );
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  switch (status) {
    case "BARU":
      return (
        <span className="inline-flex items-center rounded-md border border-blue-500/40 bg-blue-950/60 px-2 py-0.5 text-[11px] font-bold text-blue-400">
          Prospek Baru
        </span>
      );
    case "DIHUBUNGI":
      return (
        <span className="inline-flex items-center rounded-md border border-cyan-500/40 bg-cyan-950/60 px-2 py-0.5 text-[11px] font-bold text-cyan-400">
          Dihubungi
        </span>
      );
    case "PROPOSAL":
      return (
        <span className="inline-flex items-center rounded-md border border-purple-500/40 bg-purple-950/60 px-2 py-0.5 text-[11px] font-bold text-purple-400">
          Proposal Dikirim
        </span>
      );
    case "DEAL":
      return (
        <span className="inline-flex items-center rounded-md border border-emerald-500/40 bg-emerald-950/60 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
          Deal / Diterima
        </span>
      );
    case "BATAL":
      return (
        <span className="inline-flex items-center rounded-md border border-rose-500/40 bg-rose-950/60 px-2 py-0.5 text-[11px] font-bold text-destructive">
          Batal / Lost
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-md border border-muted bg-muted/40 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
          {status}
        </span>
      );
  }
}
