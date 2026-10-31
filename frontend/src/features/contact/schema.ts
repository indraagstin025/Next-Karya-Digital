import * as z from "zod";

const CONTROL_CHAR_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export const CONTACT_SERVICES = [
  "website",
  "cms",
  "redesign",
  "webapp",
  "mobile",
  "other",
] as const;

export const CONTACT_SERVICE_LABELS: Record<(typeof CONTACT_SERVICES)[number], string> = {
  website: "Pembuatan Website Bisnis / Landing Page",
  cms: "Website Sekolah / Komunitas / Portal Berita CMS",
  redesign: "Redesign & Optimalisasi Website",
  webapp: "Aplikasi Web & Dashboard Kustom",
  mobile: "Pengembangan Aplikasi Mobile",
  other: "Konsultasi Lainnya",
};

const SOURCE_PAGES = ["/", "/kontak", "/layanan", "/portofolio", "/blog", "/tentang-kami"];

const cleanString = (label: string) =>
  z
    .string({ error: `${label} wajib diisi.` })
    .transform((val) => val.normalize("NFKC").trim())
    .refine((val) => !CONTROL_CHAR_REGEX.test(val), {
      error: `${label} mengandung karakter yang tidak diizinkan.`,
    });

export const contactMessageSchema = z.object({
  name: cleanString("Nama").pipe(
    z
      .string()
      .min(2, { error: "Nama minimal 2 karakter." })
      .max(100, { error: "Nama maksimal 100 karakter." })
  ),
  email: cleanString("Email").pipe(
    z
      .string()
      .min(1, { error: "Email wajib diisi." })
      .max(120, { error: "Email maksimal 120 karakter." })
      .pipe(z.email({ error: "Format email tidak valid." }))
      .transform((val) => val.toLowerCase())
  ),
  service: z.enum(CONTACT_SERVICES, { error: "Pilih kebutuhan layanan yang tersedia." }),
  message: cleanString("Pesan").pipe(
    z
      .string()
      .min(10, { error: "Pesan minimal 10 karakter." })
      .max(2000, { error: "Pesan maksimal 2000 karakter." })
  ),
  sourcePage: z
    .string()
    .optional()
    .transform((val) => (val && SOURCE_PAGES.includes(val) ? val : "/kontak")),
  websiteUrl: z.string().max(200).optional(),
});

export interface ContactMessageInput {
  name: string;
  email: string;
  service: string;
  message: string;
  sourcePage?: string;
  websiteUrl?: string;
}

export type ContactErrorKind =
  | "validation"
  | "locked"
  | "timeout"
  | "csrf"
  | "server";

export interface ContactFieldErrors {
  name?: string[];
  email?: string[];
  service?: string[];
  message?: string[];
}

export interface SubmitContactResult {
  success: boolean;
  message: string;
  errorKind?: ContactErrorKind;
  fieldErrors?: ContactFieldErrors;
  retryAfterSeconds?: number;
}

export function extractContactFieldErrors(
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>
): ContactFieldErrors {
  const fieldErrors: ContactFieldErrors = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (field === "name" || field === "email" || field === "service" || field === "message") {
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
  }
  return fieldErrors;
}
