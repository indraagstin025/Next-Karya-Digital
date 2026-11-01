"use client";

import React, { useState } from "react";
import { MessageSquareIcon, SearchIcon, UserCheckIcon } from "lucide-react";
import type { CmsLeadItem, CmsStaffMember, LeadStatus } from "../types";

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-11";
const ICON_BTN_CLASS =
  "inline-flex items-center justify-center rounded-lg border border-border bg-card p-2 text-foreground shadow-xs transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer min-h-11 min-w-11";

interface LeadPipelineTableProps {
  leads: CmsLeadItem[];
  staffUsers: CmsStaffMember[];
  onUpdateStatus: (lead: CmsLeadItem, status: LeadStatus) => Promise<void>;
  onReassign: (lead: CmsLeadItem, staffId: string) => Promise<void>;
  onOpenNotes: (lead: CmsLeadItem) => void;
}

export function LeadPipelineTable({
  leads,
  staffUsers,
  onUpdateStatus,
  onReassign,
  onOpenNotes,
}: LeadPipelineTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLeads = leads.filter((item) => {
    const matchSearch =
      !search.trim() ||
      item.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (item.companyName && item.companyName.toLowerCase().includes(search.toLowerCase())) ||
      item.whatsappNumber.includes(search);
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama klien, perusahaan, atau no WhatsApp..."
            className={`${INPUT_CLASS} pl-9`}
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={INPUT_CLASS}
          >
            <option value="all">Semua Status Pipeline ({leads.length})</option>
            <option value="BARU">Baru Masuk</option>
            <option value="DIHUBUNGI">Sudah Dihubungi</option>
            <option value="PROPOSAL">Proposal Penawaran</option>
            <option value="DEAL">Deal / Kesepakatan</option>
            <option value="BATAL">Batal</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        {filteredLeads.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs transition hover:border-primary/50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-foreground truncate">
                  {item.clientName}
                </h3>
                {item.companyName && (
                  <span className="text-xs text-muted-foreground truncate">
                    • {item.companyName}
                  </span>
                )}
                <span className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {item.serviceRequested}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <a
                  href={`https://wa.me/${item.whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  +{item.whatsappNumber}
                </a>
                {item.email && <span>{item.email}</span>}
                {item.dealValue > 0 && (
                  <span className="font-semibold text-foreground">
                    Est. Rp {item.dealValue.toLocaleString("id-ID")}
                  </span>
                )}
              </div>
              {item.message && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 italic">
                  &quot;{item.message}&quot;
                </p>
              )}
            </div>

            {/* Actions & Status Control */}
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3 sm:border-t-0 sm:pt-0 shrink-0">
              {/* Status Selector */}
              <select
                value={item.status}
                onChange={(e) => onUpdateStatus(item, e.target.value as LeadStatus)}
                className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground cursor-pointer min-h-11"
              >
                <option value="BARU">BARU</option>
                <option value="DIHUBUNGI">DIHUBUNGI</option>
                <option value="PROPOSAL">PROPOSAL</option>
                <option value="DEAL">DEAL</option>
                <option value="BATAL">BATAL</option>
              </select>

              {/* Staff Reassign */}
              <select
                value={item.assignedToId || ""}
                onChange={(e) => onReassign(item, e.target.value)}
                className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground cursor-pointer min-h-11"
                title="Pilih PIC Penanggung Jawab"
              >
                <option value="">Belum Ditugaskan</option>
                {staffUsers.map((st) => (
                  <option key={st.id} value={st.id}>
                    PIC: {st.fullName}
                  </option>
                ))}
              </select>

              {/* Notes Drawer Button */}
              <button
                type="button"
                onClick={() => onOpenNotes(item)}
                className={ICON_BTN_CLASS}
                aria-label="Catatan interaksi"
                title="Buka catatan komunikasi klien"
              >
                <MessageSquareIcon className="size-4" />
              </button>
            </div>
          </article>
        ))}

        {filteredLeads.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-xs text-muted-foreground">
            Tidak ada calon klien yang sesuai dengan filter pencarian.
          </div>
        )}
      </div>
    </div>
  );
}
