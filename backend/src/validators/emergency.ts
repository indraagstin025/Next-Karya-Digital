import { z } from "zod";

export const unpublishContentSchema = z.object({
  site_id: z.string().min(1).default("nextkarya-main"),
  targetEntity: z.enum(["POST", "PORTFOLIO", "SERVICE", "PAGE"]),
  targetId: z.string().min(1),
  reason: z.string().min(5, "Alasan tindakan darurat minimal 5 karakter"),
});

export const lockFormSchema = z.object({
  site_id: z.string().min(1).default("nextkarya-main"),
  reason: z.string().min(5, "Alasan tindakan darurat minimal 5 karakter"),
});

export const unlockFormSchema = z.object({
  site_id: z.string().min(1).default("nextkarya-main"),
  reason: z.string().min(5, "Alasan tindakan darurat minimal 5 karakter"),
});

export const alertBannerSchema = z.object({
  site_id: z.string().min(1).default("nextkarya-main"),
  isActive: z.boolean(),
  alertBanner: z.string().optional().nullable(),
  reason: z.string().min(5, "Alasan tindakan darurat minimal 5 karakter"),
});

export const reassignLeadEmergencySchema = z.object({
  newAssignedToId: z.string().min(1, "ID staf pengganti wajib ditentukan"),
  reason: z.string().min(5, "Alasan tindakan darurat minimal 5 karakter"),
});
