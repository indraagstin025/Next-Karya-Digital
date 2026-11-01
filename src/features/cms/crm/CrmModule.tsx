"use client";

import React, { useState } from "react";
import {
  UsersIcon,
  PlusIcon,
  SearchIcon,
  CalendarIcon,
  MessageSquareIcon,
  XIcon,
  UserCheckIcon,
} from "lucide-react";
import type { CmsLeadItem, CmsScheduleItem, CmsStaffMember, LeadStatus } from "../types";
import {
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BTN_CLASS,
  SECONDARY_BTN_CLASS,
} from "../constants";
import { formatDateShortId } from "../utils";
import { LeadStatusBadge } from "../components/StatusBadge";

export interface CrmModuleProps {
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

export function CrmModule({
  leads,
  schedules,
  staffUsers,
  onRefresh,
  apiMutate,
  setNotice,
}: CrmModuleProps) {
  const [activeSubView, setActiveSubView] = useState<"leads" | "schedules">("leads");
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [selectedLeadForNotes, setSelectedLeadForNotes] = useState<CmsLeadItem | null>(null);
  const [noteText, setNoteText] = useState("");

  // Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // New Lead Form States
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("Pengembangan Web");
  const [dealValue, setDealValue] = useState(0);
  const [message, setMessage] = useState("");

  // New Schedule Form States
  const [newScheduleModalOpen, setNewScheduleModalOpen] = useState(false);
  const [schedTaskName, setSchedTaskName] = useState("");
  const [schedLeadId, setSchedLeadId] = useState("");
  const [schedAssignedToId, setSchedAssignedToId] = useState(staffUsers[0]?.id || "");
  const [schedStartDate, setSchedStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [schedEndDate, setSchedEndDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
  );

  async function handleCreateLead(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      clientName: clientName.trim(),
      companyName: companyName.trim() || null,
      whatsappNumber: whatsapp.trim(),
      email: email.trim() || null,
      serviceRequested: service.trim(),
      dealValue: Number(dealValue) || 0,
      message: message.trim() || null,
      status: "BARU",
    };

    const created = await apiMutate("crm/leads", "POST", payload);
    if (created) {
      setNotice({
        type: "success",
        text: `Prospek "${created.clientName}" berhasil dicatat ke pipeline.`,
      });
      setNewLeadModalOpen(false);
      setClientName("");
      setCompanyName("");
      setWhatsapp("");
      setEmail("");
      setMessage("");
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

  async function handleAddLeadNote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedLeadForNotes || !noteText.trim()) return;

    const res = await apiMutate(`crm/leads/${selectedLeadForNotes.id}/notes`, "POST", {
      note: noteText.trim(),
    });
    if (res) {
      setNotice({ type: "success", text: "Catatan internal berhasil ditambahkan ke prospek." });
      setNoteText("");
      setSelectedLeadForNotes(null);
      await onRefresh();
    }
  }

  async function handleCreateSchedule(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      taskName: schedTaskName.trim(),
      leadId: schedLeadId || null,
      assignedToId: schedAssignedToId || staffUsers[0]?.id,
      startDate: new Date(schedStartDate).toISOString(),
      endDate: new Date(schedEndDate).toISOString(),
      status: "PERSIAPAN",
    };

    const created = await apiMutate("crm/schedules", "POST", payload);
    if (created) {
      setNotice({ type: "success", text: `Jadwal "${created.taskName}" berhasil dibuat.` });
      setNewScheduleModalOpen(false);
      setSchedTaskName("");
      await onRefresh();
    }
  }

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
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Manajemen Calon Klien & Proyek
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
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
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
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeSubView === "schedules"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Jadwal & Agenda Proyek ({schedules.length})
        </button>
      </div>

      {activeSubView === "leads" ? (
        <>
          {/* 3. Filter Bar */}
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
                <option value="all">Semua Status Pipeline</option>
                <option value="BARU">Prospek Baru</option>
                <option value="DIHUBUNGI">Dihubungi</option>
                <option value="PROPOSAL">Proposal Dikirim</option>
                <option value="DEAL">Deal / Diterima</option>
                <option value="BATAL">Batal / Lost</option>
              </select>
            </div>
          </div>

          {/* 4. Leads Table */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Nama Klien / Perusahaan</th>
                    <th className="px-4 py-3">Kontak & Kebutuhan</th>
                    <th className="px-4 py-3">Nilai Deal</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">PIC Penanggung Jawab</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{lead.clientName}</p>
                        {lead.companyName && (
                          <p className="text-[11px] text-muted-foreground">{lead.companyName}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Masuk: {formatDateShortId(lead.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-foreground">{lead.whatsappNumber}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {lead.serviceRequested}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {lead.dealValue > 0
                          ? `Rp ${lead.dealValue.toLocaleString("id-ID")}`
                          : "Belum ditaksir"}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleUpdateLeadStatus(lead, e.target.value as LeadStatus)
                          }
                          className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold"
                        >
                          <option value="BARU">BARU</option>
                          <option value="DIHUBUNGI">DIHUBUNGI</option>
                          <option value="PROPOSAL">PROPOSAL</option>
                          <option value="DEAL">DEAL</option>
                          <option value="BATAL">BATAL</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.assignedToId || ""}
                          onChange={(e) => handleReassignLead(lead, e.target.value)}
                          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                        >
                          <option value="">Belum Ditugaskan</option>
                          {staffUsers.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.fullName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLeadForNotes(lead)}
                          title="Tambah Catatan Konsultasi"
                          className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <MessageSquareIcon className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        Belum ada data calon klien yang cocok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* 5. Project Schedules View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schedules.map((sched) => (
              <div
                key={sched.id}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {sched.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDateShortId(sched.startDate)} - {formatDateShortId(sched.endDate)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground">{sched.taskName}</h3>
                  {sched.lead && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Klien: {sched.lead.clientName}
                    </p>
                  )}
                  {sched.assignedTo && (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      PIC: {sched.assignedTo.fullName}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {schedules.length === 0 && (
              <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
                Belum ada jadwal proyek yang tercatat.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Catat Prospek Baru */}
      {newLeadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-base font-bold text-foreground">Catat Prospek Klien Baru</h3>
              <button
                type="button"
                onClick={() => setNewLeadModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className={LABEL_CLASS}>Nama Klien *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Contoh: Bpk. Hendra"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Nama Perusahaan / Organisasi</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Contoh: CV Makmur Sejahtera"
                  className={INPUT_CLASS}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS}>Nomor WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="08123456789"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="klien@perusahaan.com"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS}>Layanan yang Diminati</label>
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="Web Development / App"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Estimasi Nilai Deal (Rp)</label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    placeholder="15000000"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>Pesan / Catatan Awal Kebutuhan</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ringkasan kebutuhan dari diskusi atau form."
                  className={`${INPUT_CLASS} h-auto py-2`}
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setNewLeadModalOpen(false)}
                  className={SECONDARY_BTN_CLASS}
                >
                  Batal
                </button>
                <button type="submit" className={PRIMARY_BTN_CLASS}>
                  Simpan Prospek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer Catatan Prospek */}
      {selectedLeadForNotes && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Catatan: {selectedLeadForNotes.clientName}
                </h3>
                <p className="text-xs text-muted-foreground">{selectedLeadForNotes.companyName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadForNotes(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddLeadNote} className="my-4 space-y-3">
              <label className={LABEL_CLASS}>Tambah Catatan Interaksi / Progres Baru</label>
              <textarea
                required
                rows={4}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Catat hasil meeting, poin negosiasi, atau komitmen tindak lanjut..."
                className={`${INPUT_CLASS} h-auto py-2`}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLeadForNotes(null)}
                  className={SECONDARY_BTN_CLASS}
                >
                  Tutup
                </button>
                <button type="submit" className={PRIMARY_BTN_CLASS}>
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Buat Jadwal Baru */}
      {newScheduleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-base font-bold text-foreground">Buat Jadwal / Agenda Proyek</h3>
              <button
                type="button"
                onClick={() => setNewScheduleModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="p-6 space-y-4">
              <div>
                <label className={LABEL_CLASS}>Nama Agenda / Milestone *</label>
                <input
                  type="text"
                  required
                  value={schedTaskName}
                  onChange={(e) => setSchedTaskName(e.target.value)}
                  placeholder="Contoh: Kickoff Meeting & Wireframing"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Kaitkan dengan Klien (Opsional)</label>
                <select
                  value={schedLeadId}
                  onChange={(e) => setSchedLeadId(e.target.value)}
                  className={INPUT_CLASS}
                >
                  <option value="">Tidak dikaitkan</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.clientName} {l.companyName ? `(${l.companyName})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={LABEL_CLASS}>PIC Penanggung Jawab *</label>
                <select
                  value={schedAssignedToId}
                  onChange={(e) => setSchedAssignedToId(e.target.value)}
                  className={INPUT_CLASS}
                >
                  {staffUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS}>Tanggal Mulai</label>
                  <input
                    type="date"
                    value={schedStartDate}
                    onChange={(e) => setSchedStartDate(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Tanggal Selesai</label>
                  <input
                    type="date"
                    value={schedEndDate}
                    onChange={(e) => setSchedEndDate(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setNewScheduleModalOpen(false)}
                  className={SECONDARY_BTN_CLASS}
                >
                  Batal
                </button>
                <button type="submit" className={PRIMARY_BTN_CLASS}>
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
