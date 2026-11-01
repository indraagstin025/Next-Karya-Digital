export type LeadStatus =
  | "BARU"
  | "DIHUBUNGI"
  | "PROPOSAL"
  | "DEAL"
  | "BATAL";

export type ScheduleStatus =
  | "PERSIAPAN"
  | "BERJALAN"
  | "REVIEW"
  | "SELESAI";

export interface InteractionNote {
  id: string;
  leadId: string;
  authorId: string;
  note: string;
  createdAt: string;
  author?: {
    id: string;
    fullName: string;
    jobTitle?: string | null;
  };
}

export interface CmsLeadItem {
  id: string;
  site_id: string;
  clientName: string;
  companyName: string | null;
  whatsappNumber: string;
  email: string | null;
  serviceRequested: string;
  dealValue: number;
  status: LeadStatus;
  message: string | null;
  assignedToId: string | null;
  nextFollowUpDate?: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    fullName: string;
    email?: string;
  } | null;
  interactionNotes?: InteractionNote[];
}

export interface CmsScheduleItem {
  id: string;
  site_id: string;
  taskName: string;
  leadId: string | null;
  assignedToId: string | null;
  startDate: string;
  endDate: string;
  status: ScheduleStatus;
  createdAt?: string;
  updatedAt: string;
  lead?: {
    id: string;
    clientName: string;
    serviceRequested?: string;
    companyName?: string | null;
  } | null;
  assignedTo?: {
    id: string;
    fullName: string;
  } | null;
}

export interface CmsStaffMember {
  id: string;
  fullName: string;
  email: string;
  jobTitle?: string | null;
  role?: string;
  tokenVersion?: number;
}
