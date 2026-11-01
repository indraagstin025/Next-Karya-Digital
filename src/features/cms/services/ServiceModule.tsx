"use client";

import React, { useState } from "react";
import {
  SparklesIcon,
  PlusIcon,
  SearchIcon,
  PencilIcon,
  HistoryIcon,
  XIcon,
} from "lucide-react";
import type { CmsServiceItem } from "../types";
import {
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BTN_CLASS,
  SECONDARY_BTN_CLASS,
} from "../constants";
import { slugifyText } from "../utils";
import { StatusBadge } from "../components/StatusBadge";
import { UrlField } from "../components/UrlField";

export interface ServiceModuleProps {
  services: CmsServiceItem[];
  onRefresh: () => Promise<void>;
  apiMutate: (
    endpoint: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: any,
    updatedAtHeader?: string
  ) => Promise<any>;
  setNotice: (notice: { type: "success" | "error" | "info"; text: string } | null) => void;
  openSnapshotModal: (entityType: "SERVICE", entityId: string, title: string) => void;
}

export function ServiceModule({
  services,
  onRefresh,
  apiMutate,
  setNotice,
  openSnapshotModal,
}: ServiceModuleProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("GlobeIcon");
  const [shortDesc, setShortDesc] = useState("");
  const [features, setFeatures] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [priceNote, setPriceNote] = useState("");
  const [badge, setBadge] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Konsultasi Gratis");
  const [ctaHref, setCtaHref] = useState("/kontak");
  const [sortOrder, setSortOrder] = useState(1);

  function resetForm() {
    setEditorOpen(false);
    setEditingId(null);
    setUpdatedAt("");
    setTitle("");
    setSlug("");
    setIcon("GlobeIcon");
    setShortDesc("");
    setFeatures("");
    setPriceLabel("");
    setPriceNote("");
    setBadge("");
    setCtaLabel("Konsultasi Gratis");
    setCtaHref("/kontak");
    setSortOrder(1);
  }

  function startEdit(item: CmsServiceItem) {
    setEditingId(item.id);
    setUpdatedAt(item.updatedAt);
    setTitle(item.title);
    setSlug(item.slug);
    setIcon(item.icon || "GlobeIcon");
    setShortDesc(item.shortDesc);
    setFeatures(Array.isArray(item.features) ? item.features.join("\n") : "");
    setPriceLabel(item.priceLabel);
    setPriceNote(item.priceNote || "");
    setBadge(item.badge || "");
    setCtaLabel(item.ctaLabel || "Konsultasi Gratis");
    setCtaHref(item.ctaHref || "/kontak");
    setSortOrder(item.sortOrder || 1);
    setEditorOpen(true);
  }

  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault();
    const featuresArr = features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload: Record<string, any> = {
      title: title.trim(),
      slug: (slug.trim() || slugifyText(title)).slice(0, 255),
      icon: icon.trim() || "GlobeIcon",
      shortDesc: shortDesc.trim(),
      features: featuresArr,
      priceLabel: priceLabel.trim(),
      priceNote: priceNote.trim() || null,
      badge: badge.trim() || null,
      ctaLabel: ctaLabel.trim() || "Konsultasi Gratis",
      ctaHref: ctaHref.trim() || "/kontak",
      sortOrder: Number(sortOrder) || 1,
    };

    if (editingId) {
      payload.updatedAt = updatedAt;
      const updated = await apiMutate(`services/${editingId}`, "PATCH", payload, updatedAt);
      if (updated) {
        setNotice({ type: "success", text: `Layanan "${updated.title}" berhasil diperbarui.` });
        resetForm();
        await onRefresh();
      }
    } else {
      const created = await apiMutate("services", "POST", payload);
      if (created) {
        setNotice({ type: "success", text: `Layanan "${created.title}" berhasil dibuat.` });
        resetForm();
        await onRefresh();
      }
    }
  }

  async function handleLifecycle(item: CmsServiceItem, action: "publish" | "archive") {
    if (
      action === "archive" &&
      !confirm(`Arsipkan "${item.title}"? Konten akan disembunyikan dari penawaran publik.`)
    ) {
      return;
    }

    const res = await apiMutate(
      `services/${item.id}/${action}`,
      "POST",
      { updatedAt: item.updatedAt },
      item.updatedAt
    );
    if (res) {
      setNotice({
        type: "success",
        text:
          action === "publish"
            ? `Layanan "${item.title}" berhasil ditayangkan.`
            : `Layanan "${item.title}" berhasil diarsipkan.`,
      });
      await onRefresh();
    }
  }

  const filteredServices = services.filter((item) => {
    const matchSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Paket Layanan</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Atur katalog solusi digital, fitur paket, dan skema harga Next Karya.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setEditorOpen(true);
          }}
          className={PRIMARY_BTN_CLASS}
        >
          <PlusIcon className="size-4 mr-1.5" />
          Tambah Layanan
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama layanan atau deskripsi..."
            className={`${INPUT_CLASS} pl-9`}
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={INPUT_CLASS}
          >
            <option value="all">Semua Status</option>
            <option value="PUBLISHED">Sudah Tayang</option>
            <option value="DRAFT">Draf</option>
            <option value="ARCHIVED">Diarsipkan</option>
          </select>
        </div>
      </div>

      {/* 3. Grid of Service Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition hover:border-primary/50"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <SparklesIcon className="size-4" />
                  </div>
                  {service.badge && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {service.badge}
                    </span>
                  )}
                </div>
                <StatusBadge status={service.status} />
              </div>

              <h3 className="text-sm font-bold text-foreground">{service.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {service.shortDesc}
              </p>

              <div className="mt-4 rounded-lg bg-muted/40 p-2.5">
                <p className="text-base font-bold text-foreground">{service.priceLabel}</p>
                {service.priceNote && (
                  <p className="text-[10px] text-muted-foreground">{service.priceNote}</p>
                )}
              </div>

              {Array.isArray(service.features) && service.features.length > 0 && (
                <ul className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                  {service.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 truncate">
                      <span className="size-1 rounded-full bg-primary shrink-0" />
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                  {service.features.length > 4 && (
                    <li className="text-[10px] text-primary font-medium">
                      +{service.features.length - 4} fitur lainnya
                    </li>
                  )}
                </ul>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
              <span className="text-[10px] font-mono text-muted-foreground">
                Urutan: {service.sortOrder}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openSnapshotModal("SERVICE", service.id, service.title)}
                  title="Riwayat Revisi"
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <HistoryIcon className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(service)}
                  title="Sunting Layanan"
                  className="rounded-md border border-border p-1.5 text-primary hover:bg-primary/10"
                >
                  <PencilIcon className="size-3.5" />
                </button>
                {service.status !== "PUBLISHED" ? (
                  <button
                    type="button"
                    onClick={() => handleLifecycle(service, "publish")}
                    className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-500 hover:bg-emerald-500/20"
                  >
                    Terbitkan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLifecycle(service, "archive")}
                    className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[11px] font-semibold text-destructive hover:bg-destructive/20"
                  >
                    Arsipkan
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground text-xs">
            Tidak ada layanan yang cocok dengan filter.
          </div>
        )}
      </div>

      {/* 4. Service Editor Modal */}
      {editorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-base font-bold text-foreground">
                {editingId ? "Sunting Paket Layanan" : "Tambah Layanan Baru"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className={LABEL_CLASS}>Nama Paket Layanan *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingId && !slug) setSlug(slugifyText(e.target.value));
                  }}
                  placeholder="Contoh: Pengembangan Web Enterprise"
                  className={INPUT_CLASS}
                />
              </div>

              <UrlField
                id="service-slug"
                prefix="/layanan/"
                value={slug}
                onChange={setSlug}
                placeholder="pengembangan-web-enterprise"
              />

              <div>
                <label className={LABEL_CLASS}>Deskripsi Singkat Solusi *</label>
                <textarea
                  required
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Deskripsikan nilai tambah dan cakupan layanan."
                  className={`${INPUT_CLASS} h-auto py-2`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL_CLASS}>Label Harga *</label>
                  <input
                    type="text"
                    required
                    value={priceLabel}
                    onChange={(e) => setPriceLabel(e.target.value)}
                    placeholder="Mulai Rp 15.000.000"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Catatan Harga</label>
                  <input
                    type="text"
                    value={priceNote}
                    onChange={(e) => setPriceNote(e.target.value)}
                    placeholder="Contoh: Per proyek / modular"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={LABEL_CLASS}>Badge Unggulan</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Paling Populer"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Ikon Solusi</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="GlobeIcon"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Urutan Tampil</label>
                  <input
                    type="number"
                    min={1}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>Daftar Fitur / Deliverables (Satu per baris)</label>
                <textarea
                  rows={5}
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Arsitektur App Router Next.js&#10;Database PostgreSQL Terisolasi&#10;Audit Keamanan & Penetrasi"
                  className={`${INPUT_CLASS} h-auto py-2 font-mono text-xs`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL_CLASS}>Label Tombol CTA</label>
                  <input
                    type="text"
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    placeholder="Konsultasi Gratis"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Tautan Tombol CTA</label>
                  <input
                    type="text"
                    value={ctaHref}
                    onChange={(e) => setCtaHref(e.target.value)}
                    placeholder="#konsultasi atau /kontak"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
                <button type="button" onClick={resetForm} className={SECONDARY_BTN_CLASS}>
                  Batal
                </button>
                <button type="submit" className={PRIMARY_BTN_CLASS}>
                  {editingId ? "Simpan Perubahan" : "Simpan Layanan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
