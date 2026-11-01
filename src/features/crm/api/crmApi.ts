import type { CmsLeadItem, CmsScheduleItem, LeadStatus } from "../types";

/**
 * Service API untuk modul CRM (Customer Relationship Management).
 * Mengelola prospek calon klien dan jadwal pengerjaan proyek.
 */
export const crmApi = {
  /**
   * Membuat catatan prospek calon klien baru.
   */
  createLead: async (payload: {
    clientName: string;
    companyName?: string | null;
    whatsappNumber: string;
    email?: string | null;
    serviceRequested: string;
    dealValue?: number;
    message?: string | null;
  }): Promise<CmsLeadItem | null> => {
    try {
      const res = await fetch("/api/cms/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, status: "BARU" }),
      });
      const json = await res.json();
      return json?.success ? json.data : null;
    } catch (error) {
      console.error("[crmApi] createLead error:", error);
      return null;
    }
  },

  /**
   * Memperbarui status alur pipeline prospek klien.
   */
  updateLeadStatus: async (
    leadId: string,
    status: LeadStatus,
    updatedAt: string
  ): Promise<CmsLeadItem | null> => {
    try {
      const res = await fetch(`/api/cms/crm/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-updated-at": updatedAt,
          "If-Unmodified-Since": updatedAt,
        },
        body: JSON.stringify({ status, updatedAt }),
      });
      const json = await res.json();
      return json?.success ? json.data : null;
    } catch (error) {
      console.error("[crmApi] updateLeadStatus error:", error);
      return null;
    }
  },

  /**
   * Mengalihkan penanggung jawab (PIC Staf) prospek klien.
   */
  reassignLead: async (
    leadId: string,
    assignedToId: string | null,
    updatedAt: string
  ): Promise<CmsLeadItem | null> => {
    try {
      const res = await fetch(`/api/cms/crm/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-updated-at": updatedAt,
          "If-Unmodified-Since": updatedAt,
        },
        body: JSON.stringify({ assignedToId, updatedAt }),
      });
      const json = await res.json();
      return json?.success ? json.data : null;
    } catch (error) {
      console.error("[crmApi] reassignLead error:", error);
      return null;
    }
  },

  /**
   * Menambahkan catatan internal komunikasi staf dengan klien.
   */
  addNote: async (leadId: string, note: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/cms/crm/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      const json = await res.json();
      return Boolean(json?.success);
    } catch (error) {
      console.error("[crmApi] addNote error:", error);
      return false;
    }
  },

  /**
   * Membuat jadwal atau milestone pengerjaan proyek baru.
   */
  createSchedule: async (payload: {
    taskName: string;
    leadId?: string | null;
    assignedToId?: string | null;
    startDate: string;
    endDate: string;
  }): Promise<CmsScheduleItem | null> => {
    try {
      const res = await fetch("/api/cms/crm/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, status: "PERSIAPAN" }),
      });
      const json = await res.json();
      return json?.success ? json.data : null;
    } catch (error) {
      console.error("[crmApi] createSchedule error:", error);
      return null;
    }
  },

  /**
   * Menghapus agenda jadwal proyek.
   */
  deleteSchedule: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/cms/crm/schedules/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      return Boolean(json?.success);
    } catch (error) {
      console.error("[crmApi] deleteSchedule error:", error);
      return false;
    }
  },
};
