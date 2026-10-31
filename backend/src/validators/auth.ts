import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const revokeSessionsSchema = z.object({
  reason: z.string().min(5, "Alasan pencabutan sesi minimal 5 karakter").default("Pencabutan darurat sesi HP hilang/tertinggal"),
});
