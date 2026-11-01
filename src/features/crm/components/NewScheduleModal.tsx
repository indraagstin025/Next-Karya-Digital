"use client";

import React, { useState } from "react";
import { CalendarIcon, XIcon } from "lucide-react";
import type { CmsLeadItem, CmsStaffMember } from "../types";

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-11";
const LABEL_CLASS = "block text-xs font-semibold text-foreground mb-1";
const PRIMARY_BTN_CLASS =
  "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer min-h-11";
const SECONDARY_BTN_CLASS =
  "inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer min-h-11";

interface NewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: CmsLeadItem[];
  staffUsers: CmsStaffMember[];
  onSubmit: (payload: {
    taskName: string;
    leadId?: string | null;
    assignedToId?: string | null;
    startDate: string;
    endDate: string;
  }) => Promise<void>;
}

export function NewScheduleModal({
  isOpen,
  onClose,
  leads,
  staffUsers,
  onSubmit,
}: NewScheduleModalProps) {
  const [taskName, setTaskName] = useState("");
  const [leadId, setLeadId] = useState("");
  const [assignedToId, setAssignedToId] = useState(staffUsers[0]?.id || "");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        taskName: taskName.trim(),
        leadId: leadId || null,
        assignedToId: assignedToId || null,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-schedule-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarIcon className="size-4" />
            </div>
            <div>
              <h2 id="new-schedule-modal-title" className="text-base font-bold text-foreground">
                Buat Agenda / Jadwal Proyek Baru
              </h2>
              <p className="text-xs text-muted-foreground">
                Tentukan target milestone pengerjaan website untuk klien.
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

        <form onSubmit={handleSubmit} className="my-4 space-y-4">
          <div>
            <label htmlFor="sched-name" className={LABEL_CLASS}>
              Nama Milestone / Tugas<span className="text-destructive">*</span>
            </label>
            <input
              id="sched-name"
              type="text"
              required
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Contoh: Desain Prototipe UI/UX & Wireframing"
              className={INPUT_CLASS}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sched-lead" className={LABEL_CLASS}>
                Tautkan Prospek Klien (Opsional)
              </label>
              <select
                id="sched-lead"
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="">Tanpa tautan klien</option>
                {leads.map((ld) => (
                  <option key={ld.id} value={ld.id}>
                    {ld.clientName} ({ld.serviceRequested})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sched-pic" className={LABEL_CLASS}>
                Staf Penanggung Jawab (PIC)
              </label>
              <select
                id="sched-pic"
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                className={INPUT_CLASS}
              >
                {staffUsers.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.fullName} ({st.jobTitle || "Staf"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sched-start" className={LABEL_CLASS}>
                Tanggal Mulai<span className="text-destructive">*</span>
              </label>
              <input
                id="sched-start"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="sched-end" className={LABEL_CLASS}>
                Batas Akhir (Deadline)<span className="text-destructive">*</span>
              </label>
              <input
                id="sched-end"
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button type="button" onClick={onClose} className={SECONDARY_BTN_CLASS}>
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={PRIMARY_BTN_CLASS}
            >
              {submitting ? "Menyimpan..." : "Simpan Agenda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
