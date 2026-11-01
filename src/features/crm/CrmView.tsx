"use client";

import React from "react";
import { PlusIcon } from "lucide-react";
import type { CmsLeadItem, CmsScheduleItem, CmsStaffMember, LeadStatus } from "./types";
import { useCrm } from "./hooks/useCrm";
import { LeadPipelineTable } from "./components/LeadPipelineTable";
import { LeadInteractionDrawer } from "./components/LeadInteractionDrawer";
import { NewLeadModal } from "./components/NewLeadModal";
import { ScheduleGanttView } from "./components/ScheduleGanttView";
import { NewScheduleModal } from "./components/NewScheduleModal";

const PRIMARY_BTN_CLASS =
  "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer min-h-11";

export interface CrmViewProps {
  leads: CmsLeadItem[];
  schedules: CmsScheduleItem[];
  staffUsers: CmsStaffMember[];
  onRefresh: () => Promise<void>;
  apiMutate: (
    endpoint: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: any,
    updatedAtHeader?: string
  ) => Promise<any>;
  setNotice: (notice: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export function CrmView({
  leads,
  schedules,
  staffUsers,
  onRefresh,
  apiMutate,
  setNotice,
}: CrmViewProps) {
  const {
    activeSubView,
    setActiveSubView,
    newLeadModalOpen,
    setNewLeadModalOpen,
    selectedLeadForNotes,
    setSelectedLeadForNotes,
    newScheduleModalOpen,
    setNewScheduleModalOpen,
  } = useCrm();

  async function handleCreateLead(payload: {
    clientName: string;
    companyName?: string | null;
    whatsappNumber: string;
    email?: string | null;
    serviceRequested: string;
    dealValue: number;
    message?: string | null;
  }) {
    const created = await apiMutate("crm/leads", "POST", { ...payload, status: "BARU" });
    if (created) {
      setNotice({
        type: "success",
        text: `Prospek "${created.clientName}" berhasil dicatat ke pipeline.`,
      });
      await onRefresh();
    }
  }

  async function handleUpdateLeadStatus(lead: CmsLeadItem, status: LeadStatus) {
    const updated = await apiMutate(
      `crm/leads/${lead.id}`,
      "PATCH",
      { status, updatedAt: lead.updatedAt },
      lead.updatedAt
    );
    if (updated) {
      setNotice({
        type: "success",
        text: `Status prospek "${lead.clientName}" diperbarui menjadi ${status}.`,
      });
      await onRefresh();
    }
  }

  async function handleReassignLead(lead: CmsLeadItem, newAssignedToId: string) {
    const updated = await apiMutate(
      `crm/leads/${lead.id}`,
      "PATCH",
      { assignedToId: newAssignedToId || null, updatedAt: lead.updatedAt },
      lead.updatedAt
    );
    if (updated) {
      setNotice({
        type: "success",
        text: `PIC prospek "${lead.clientName}" berhasil diperbarui.`,
      });
      await onRefresh();
    }
  }

  async function handleAddLeadNote(leadId: string, noteText: string) {
    const res = await apiMutate(`crm/leads/${leadId}/notes`, "POST", {
      note: noteText,
    });
    if (res) {
      setNotice({
        type: "success",
        text: "Catatan internal berhasil ditambahkan ke prospek.",
      });
      setSelectedLeadForNotes(null);
      await onRefresh();
    }
  }

  async function handleCreateSchedule(payload: {
    taskName: string;
    leadId?: string | null;
    assignedToId?: string | null;
    startDate: string;
    endDate: string;
  }) {
    const created = await apiMutate("crm/schedules", "POST", {
      ...payload,
      status: "PERSIAPAN",
    });
    if (created) {
      setNotice({
        type: "success",
        text: `Jadwal "${created.taskName}" berhasil dibuat.`,
      });
      await onRefresh();
    }
  }

  async function handleDeleteSchedule(id: string) {
    if (!window.confirm("Hapus agenda jadwal ini?")) return;
    const res = await apiMutate(`crm/schedules/${id}`, "DELETE", {});
    if (res) {
      setNotice({
        type: "success",
        text: "Jadwal proyek berhasil dihapus.",
      });
      await onRefresh();
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Manajemen Calon Klien &amp; Proyek
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola alur pipeline konsultasi klien, penugasan staf, dan jadwal pengerjaan proyek.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeSubView === "leads" ? (
            <button
              type="button"
              onClick={() => setNewLeadModalOpen(true)}
              className={PRIMARY_BTN_CLASS}
            >
              <PlusIcon className="size-4 mr-1.5" />
              Catat Prospek Baru
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setNewScheduleModalOpen(true)}
              className={PRIMARY_BTN_CLASS}
            >
              <PlusIcon className="size-4 mr-1.5" />
              Buat Jadwal Baru
            </button>
          )}
        </div>
      </div>

      {/* 2. Sub Tabs Toggle */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveSubView("leads")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer min-h-11 ${
            activeSubView === "leads"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Pipeline Calon Klien ({leads.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubView("schedules")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer min-h-11 ${
            activeSubView === "schedules"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Jadwal &amp; Agenda Proyek ({schedules.length})
        </button>
      </div>

      {/* 3. Sub View Content */}
      {activeSubView === "leads" ? (
        <LeadPipelineTable
          leads={leads}
          staffUsers={staffUsers}
          onUpdateStatus={handleUpdateLeadStatus}
          onReassign={handleReassignLead}
          onOpenNotes={setSelectedLeadForNotes}
        />
      ) : (
        <ScheduleGanttView
          schedules={schedules}
          onDeleteSchedule={handleDeleteSchedule}
        />
      )}

      {/* 4. Modals and Drawers */}
      <LeadInteractionDrawer
        lead={selectedLeadForNotes}
        onClose={() => setSelectedLeadForNotes(null)}
        onSubmitNote={handleAddLeadNote}
      />

      <NewLeadModal
        isOpen={newLeadModalOpen}
        onClose={() => setNewLeadModalOpen(false)}
        onSubmit={handleCreateLead}
      />

      <NewScheduleModal
        isOpen={newScheduleModalOpen}
        onClose={() => setNewScheduleModalOpen(false)}
        leads={leads}
        staffUsers={staffUsers}
        onSubmit={handleCreateSchedule}
      />
    </div>
  );
}
