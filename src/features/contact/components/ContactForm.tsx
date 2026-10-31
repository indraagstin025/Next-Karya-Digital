"use client";

import React from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useContactForm } from "../hooks/useContactForm";
import { CONTACT_SERVICES, CONTACT_SERVICE_LABELS } from "../schema";

const FIELD_CLASS =
  "w-full rounded-xl border bg-[#F8FAFC] dark:bg-slate-800 px-4 py-3 text-[13.5px] text-[#041E42] dark:text-white placeholder:text-[#647896] transition-all duration-200 focus:border-[#005090] focus:bg-white dark:focus:bg-slate-900";
const FIELD_OK = "border-[#5B789E] dark:border-slate-600";
const FIELD_ERR = "border-rose-700 dark:border-rose-400";
const LABEL_CLASS = "mb-2 block text-[13px] font-bold text-[#041E42] dark:text-slate-200";

function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-semibold text-rose-800 dark:text-rose-300">
      {messages[0]}
    </p>
  );
}

export function ContactFormCard({ sourcePage = "/kontak" }: { sourcePage?: string }) {
  const { formData, fieldErrors, formStatus, isOnline, handleChange, handleSubmit } =
    useContactForm(sourcePage);
  const sending = formStatus.type === "sending";

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[24px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 lg:p-9 shadow-[0_18px_46px_-12px_rgba(10,35,80,0.08)] transition-colors duration-300 hover:border-[#005090] dark:hover:border-slate-700"
      noValidate
      aria-busy={sending}
    >
      <div className="mb-6 pb-4 border-b border-[#E2E8F0] dark:border-slate-800">
        <h3 className="text-[18px] sm:text-[20px] font-extrabold text-[#041E42] dark:text-white">
          Formulir Konsultasi Proyek
        </h3>
        <p className="mt-1 text-xs sm:text-[13px] text-[#4A5D78] dark:text-slate-400">
          Isi detail singkat di bawah ini untuk menjadwalkan diskusi bersama tim rekayasa Next Karya.
        </p>
      </div>

      {!isOnline && (
        <p
          role="status"
          className="mb-5 rounded-xl border border-amber-700 bg-amber-50 p-3 text-[13px] font-semibold text-amber-900 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-200"
        >
          Perangkat sedang offline. Anda tetap dapat mengisi formulir, tombol kirim aktif lagi setelah koneksi pulih.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASS} htmlFor="contact-name">
            Nama Lengkap
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            placeholder="Contoh: Budi Pratama"
            required
            maxLength={100}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
            className={`${FIELD_CLASS} ${fieldErrors.name ? FIELD_ERR : FIELD_OK}`}
          />
          <FieldError id="contact-name-error" messages={fieldErrors.name} />
        </div>
        <div>
          <label className={LABEL_CLASS} htmlFor="contact-email-input">
            Alamat Email
          </label>
          <input
            id="contact-email-input"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="nama@perusahaan.com atau email aktif"
            required
            maxLength={120}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
            className={`${FIELD_CLASS} ${fieldErrors.email ? FIELD_ERR : FIELD_OK}`}
          />
          <FieldError id="contact-email-error" messages={fieldErrors.email} />
        </div>
      </div>

      <div className="mt-5">
        <label className={LABEL_CLASS} htmlFor="contact-service">
          Kebutuhan Layanan
        </label>
        <select
          id="contact-service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          aria-invalid={Boolean(fieldErrors.service)}
          className={`${FIELD_CLASS} ${fieldErrors.service ? FIELD_ERR : FIELD_OK}`}
        >
          {CONTACT_SERVICES.map((value) => (
            <option key={value} value={value} className="text-slate-900 bg-white">
              {CONTACT_SERVICE_LABELS[value]}
            </option>
          ))}
        </select>
        <FieldError id="contact-service-error" messages={fieldErrors.service} />
      </div>

      <div className="mt-5">
        <label className={LABEL_CLASS} htmlFor="contact-message">
          Pesan &amp; Ringkasan Kebutuhan
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Ceritakan rencana proyek website atau kendala sistem yang ingin Anda selesaikan..."
          required
          maxLength={2000}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
          className={`${FIELD_CLASS} resize-y ${fieldErrors.message ? FIELD_ERR : FIELD_OK}`}
        />
        <FieldError id="contact-message-error" messages={fieldErrors.message} />
        <p className="mt-1.5 text-xs tabular-nums text-[#4A5D78] dark:text-slate-400">
          {formData.message.length} / 2000 karakter
        </p>
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website-url">Situs web</label>
        <input
          id="contact-website-url"
          name="websiteUrl"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.websiteUrl}
          onChange={handleChange}
        />
      </div>

      <button
        id="submit-button"
        type="submit"
        disabled={sending || !isOnline}
        className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#005090] hover:bg-[#003E70] px-6 py-3.5 text-[14px] font-bold text-white shadow-[0_10px_25px_-5px_rgba(0,80,144,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-5px_rgba(0,80,144,0.55)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        <span>{sending ? "Sedang Mengirim..." : "Kirim Pesan Konsultasi"}</span>
        <PaperPlaneIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>

      {formStatus.message && formStatus.type !== "sending" && (
        <div
          id="form-status"
          role={formStatus.type === "error" ? "alert" : "status"}
          className={`nk-card-enter mt-4 p-3.5 rounded-xl text-[13px] font-medium ${
            formStatus.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-400"
              : "bg-rose-50 text-rose-900 border border-rose-700 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-400"
          }`}
        >
          <span className="font-bold">
            {formStatus.type === "success" ? "Terkirim. " : "Belum terkirim. "}
          </span>
          {formStatus.message}
        </div>
      )}
    </form>
  );
}

export function ContactForm() {
  return (
    <ScrollReveal direction="right" delayMs={100}>
      <ContactFormCard sourcePage="/kontak" />
    </ScrollReveal>
  );
}
