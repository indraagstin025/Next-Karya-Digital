import { CONTACT_SERVICE_LABELS, type CONTACT_SERVICES } from "./schema";

export const DEFAULT_OFFICIAL_WHATSAPP = "6283820117314";

export function getOfficialWhatsAppNumber(): string {
  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || DEFAULT_OFFICIAL_WHATSAPP;
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }
  return digits || DEFAULT_OFFICIAL_WHATSAPP;
}

export function buildWhatsAppDirectUrl(customText?: string): string {
  const phone = getOfficialWhatsAppNumber();
  const text =
    customText ??
    "Halo Tim Next Karya Digital Solutions, saya ingin berkonsultasi mengenai pembuatan website/aplikasi.";
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export interface WhatsAppConsultationPayload {
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  message: string;
}

export function buildWhatsAppConsultationUrl(
  payload: WhatsAppConsultationPayload
): string {
  const phone = getOfficialWhatsAppNumber();
  const serviceKey = payload.service as (typeof CONTACT_SERVICES)[number];
  const serviceLabel = CONTACT_SERVICE_LABELS[serviceKey] ?? payload.service;

  const lines = [
    "Halo Tim *Next Karya Digital Solutions*,",
    "Saya ingin berkonsultasi mengenai rencana proyek dengan detail berikut:",
    "",
    `• *Nama:* ${payload.name}`,
    `• *Email:* ${payload.email}`,
    `• *No. WhatsApp:* ${payload.whatsapp}`,
    `• *Kebutuhan Layanan:* ${serviceLabel}`,
    "",
    "*Ringkasan Kebutuhan:*",
    payload.message,
  ];

  const encodedText = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${phone}?text=${encodedText}`;
}
