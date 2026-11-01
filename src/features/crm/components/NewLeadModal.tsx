"use client";

import React, { useState } from "react";
import { UsersIcon, XIcon } from "lucide-react";

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-11";
const LABEL_CLASS = "block text-xs font-semibold text-foreground mb-1";
const PRIMARY_BTN_CLASS =
  "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer min-h-11";
const SECONDARY_BTN_CLASS =
  "inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer min-h-11";

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    clientName: string;
    companyName?: string | null;
    whatsappNumber: string;
    email?: string | null;
    serviceRequested: string;
    dealValue: number;
    message?: string | null;
  }) => Promise<void>;
}

export function NewLeadModal({ isOpen, onClose, onSubmit }: NewLeadModalProps) {
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("Pengembangan Web");
  const [dealValue, setDealValue] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        clientName: clientName.trim(),
        companyName: companyName.trim() || null,
        whatsappNumber: whatsapp.trim(),
        email: email.trim() || null,
        serviceRequested: service.trim(),
        dealValue: Number(dealValue) || 0,
        message: message.trim() || null,
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
      aria-labelledby="new-lead-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UsersIcon className="size-4" />
            </div>
            <div>
              <h2 id="new-lead-modal-title" className="text-base font-bold text-foreground">
                Catat Prospek Baru ke Pipeline
              </h2>
              <p className="text-xs text-muted-foreground">
                Tambahkan calon klien baru yang menghubungi melalui kontak pribadi atau rujukan.
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

        <form onSubmit={handleSubmit} className="my-4 space-y-4 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lead-name" className={LABEL_CLASS}>
                Nama Klien<span className="text-destructive">*</span>
              </label>
              <input
                id="lead-name"
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="dr. Hendra Wijaya"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="lead-comp" className={LABEL_CLASS}>
                Nama Perusahaan / Bisnis
              </label>
              <input
                id="lead-comp"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Klinik Pratama Sehat"
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lead-wa" className={LABEL_CLASS}>
                No. WhatsApp<span className="text-destructive">*</span>
              </label>
              <input
                id="lead-wa"
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="6281234567890"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="lead-email" className={LABEL_CLASS}>
                Email Klien
              </label>
              <input
                id="lead-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hendra@kliniksehat.com"
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lead-service" className={LABEL_CLASS}>
                Layanan yang Diminati
              </label>
              <input
                id="lead-service"
                type="text"
                required
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="Website Company Profile / Sistem Informasi"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="lead-val" className={LABEL_CLASS}>
                Estimasi Nilai Deal (Rp)
              </label>
              <input
                id="lead-val"
                type="number"
                min={0}
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value) || 0)}
                className={`${INPUT_CLASS} tabular-nums`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="lead-msg" className={LABEL_CLASS}>
              Kebutuhan &amp; Catatan Singkat
            </label>
            <textarea
              id="lead-msg"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Klien menginginkan website modern dengan fitur booking online..."
              className={`${INPUT_CLASS} h-auto leading-relaxed`}
            />
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
              {submitting ? "Menyimpan..." : "Simpan ke Pipeline"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
