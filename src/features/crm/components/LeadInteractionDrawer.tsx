"use client";

import React, { useState } from "react";
import { MessageSquareIcon, XIcon } from "lucide-react";
import type { CmsLeadItem } from "../types";

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-11";
const PRIMARY_BTN_CLASS =
  "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer min-h-11";
const SECONDARY_BTN_CLASS =
  "inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer min-h-11";

interface LeadInteractionDrawerProps {
  lead: CmsLeadItem | null;
  onClose: () => void;
  onSubmitNote: (leadId: string, noteText: string) => Promise<void>;
}

export function LeadInteractionDrawer({
  lead,
  onClose,
  onSubmitNote,
}: LeadInteractionDrawerProps) {
  const [noteText, setNoteText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!lead) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim() || !lead) return;

    setSubmitting(true);
    try {
      await onSubmitNote(lead.id, noteText.trim());
      setNoteText("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notes-drawer-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquareIcon className="size-4" />
            </div>
            <div>
              <h2 id="notes-drawer-title" className="text-base font-bold text-foreground">
                Catatan Komunikasi: {lead.clientName}
              </h2>
              <p className="text-xs text-muted-foreground">
                Riwayat tindak lanjut penawaran dan negosiasi internal.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={SECONDARY_BTN_CLASS}
            aria-label="Tutup"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Existing Notes List */}
        <div className="my-4 max-h-[280px] flex-1 space-y-2.5 overflow-y-auto pr-1">
          {(!lead.interactionNotes || lead.interactionNotes.length === 0) ? (
            <div className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
              Belum ada catatan internal untuk prospek ini. Tulis catatan pertama di bawah.
            </div>
          ) : (
            lead.interactionNotes.map((n) => (
              <div key={n.id} className="rounded-xl border border-border bg-muted/30 p-3 text-xs">
                <p className="text-foreground leading-relaxed">{n.note}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/50 pt-1.5">
                  <span className="font-semibold">{n.author?.fullName || "Staf Internal"}</span>
                  <span className="tabular-nums">
                    {new Date(n.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form Add Note */}
        <form onSubmit={handleSubmit} className="border-t border-border pt-4 space-y-3">
          <label htmlFor="crm-note-input" className="block text-xs font-semibold text-foreground">
            Tambah Catatan Baru
          </label>
          <textarea
            id="crm-note-input"
            rows={3}
            required
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Contoh: Klien setuju dengan penawaran Paket Business. Menunggu pengiriman proposal resmi via WhatsApp besok."
            className={`${INPUT_CLASS} h-auto leading-relaxed`}
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className={SECONDARY_BTN_CLASS}>
              Tutup
            </button>
            <button
              type="submit"
              disabled={submitting || !noteText.trim()}
              className={PRIMARY_BTN_CLASS}
            >
              {submitting ? "Menyimpan..." : "Simpan Catatan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
