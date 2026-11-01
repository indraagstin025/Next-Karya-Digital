"use client";

import React, { useState } from "react";
import {
  BriefcaseIcon,
  PlusIcon,
  SearchIcon,
  PencilIcon,
  HistoryIcon,
  ImageIcon,
  UploadIcon,
  XIcon,
  StarIcon,
} from "lucide-react";
import type { CmsMediaItem, CmsPortfolio } from "../types";
import {
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BTN_CLASS,
  SECONDARY_BTN_CLASS,
} from "../constants";
import { slugifyText, formatDateShortId } from "../utils";
import { StatusBadge } from "../components/StatusBadge";
import { UrlField } from "../components/UrlField";
import { MediaPickerModal } from "../components/MediaPickerModal";

export interface PortfolioModuleProps {
  portfolios: CmsPortfolio[];
  mediaItems: CmsMediaItem[];
  onRefresh: () => Promise<void>;
  apiMutate: (
    endpoint: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: any,
    updatedAtHeader?: string
  ) => Promise<any>;
  setNotice: (notice: { type: "success" | "error" | "info"; text: string } | null) => void;
  openSnapshotModal: (entityType: "PORTFOLIO", entityId: string, title: string) => void;
}

export function PortfolioModule({
  portfolios,
  mediaItems,
  onRefresh,
  apiMutate,
  setNotice,
  openSnapshotModal,
}: PortfolioModuleProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [clientName, setClientName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("Sistem Web Internal");
  const [summary, setSummary] = useState("");
  const [impactSummary, setImpactSummary] = useState("");
  const [metricResult, setMetricResult] = useState("");
  const [technologies, setTechnologies] = useState("Next.js, Express.js, PostgreSQL");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailAlt, setThumbnailAlt] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  function resetForm() {
    setEditorOpen(false);
    setEditingId(null);
    setUpdatedAt("");
    setTitle("");
    setSlug("");
    setClientName("");
    setServiceCategory("Sistem Web Internal");
    setSummary("");
    setImpactSummary("");
    setMetricResult("");
    setTechnologies("Next.js, Express.js, PostgreSQL");
    setThumbnailUrl("");
    setThumbnailAlt("");
    setProjectUrl("");
    setIsFeatured(false);
    setSortOrder(1);
    setUploadingThumb(false);
  }

  function startEdit(item: CmsPortfolio) {
    setEditingId(item.id);
    setUpdatedAt(item.updatedAt);
    setTitle(item.title);
    setSlug(item.slug);
    setClientName(item.clientName);
    setServiceCategory(item.serviceCategory);
    setSummary(item.summary);
    setImpactSummary(item.impactSummary || "");
    setMetricResult(item.metricResult || "");
    setTechnologies(Array.isArray(item.technologies) ? item.technologies.join(", ") : "");
    setThumbnailUrl(item.thumbnailUrl || "");
    setThumbnailAlt(item.thumbnailAlt || "");
    setProjectUrl(item.projectUrl || "");
    setIsFeatured(Boolean(item.isFeatured));
    setSortOrder(item.sortOrder || 1);
    setEditorOpen(true);
  }

  async function handleSavePortfolio(e: React.FormEvent) {
    e.preventDefault();
    const techArr = technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Record<string, any> = {
      title: title.trim(),
      slug: (slug.trim() || slugifyText(title)).slice(0, 255),
      clientName: clientName.trim(),
      serviceCategory: serviceCategory.trim(),
      summary: summary.trim(),
      impactSummary: impactSummary.trim() || null,
      metricResult: metricResult.trim() || null,
      technologies: techArr,
      thumbnailUrl: thumbnailUrl.trim() || null,
      thumbnailAlt: thumbnailAlt.trim() || title.trim(),
      projectUrl: projectUrl.trim() || null,
      content: { description: summary.trim() },
      isFeatured,
      sortOrder: Number(sortOrder) || 1,
    };

    if (editingId) {
      payload.updatedAt = updatedAt;
      const updated = await apiMutate(`portfolios/${editingId}`, "PATCH", payload, updatedAt);
      if (updated) {
        setNotice({ type: "success", text: `Portofolio "${updated.title}" berhasil diperbarui.` });
        resetForm();
        await onRefresh();
      }
    } else {
      const created = await apiMutate("portfolios", "POST", payload);
      if (created) {
        setNotice({ type: "success", text: `Portofolio "${created.title}" berhasil ditambahkan.` });
        resetForm();
        await onRefresh();
      }
    }
  }

  async function handleLifecycle(item: CmsPortfolio, action: "publish" | "archive") {
    if (
      action === "archive" &&
      !confirm(`Arsipkan "${item.title}"? Konten akan disembunyikan dari website publik.`)
    ) {
      return;
    }

    const res = await apiMutate(
      `portfolios/${item.id}/${action}`,
      "POST",
      { updatedAt: item.updatedAt },
      item.updatedAt
    );
    if (res) {
      setNotice({
        type: "success",
        text:
          action === "publish"
            ? `Portofolio "${item.title}" berhasil ditayangkan.`
            : `Portofolio "${item.title}" berhasil diarsipkan.`,
      });
      await onRefresh();
    }
  }

  async function handleDirectThumbUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const allowed = ["image/webp", "image/png", "image/jpeg"];
    if (!allowed.includes(file.type)) {
      setNotice({
        type: "error",
        text: "Format berkas tidak didukung. Harap pilih gambar WebP, PNG, atau JPEG.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice({ type: "error", text: "Ukuran berkas melebihi batas maksimal 5 MB." });
      return;
    }

    setUploadingThumb(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const generatedAlt = title.trim()
        ? `Thumbnail portofolio: ${title.trim()}`
        : file.name.replace(/\.[^/.]+$/, "");
      formData.append("altText", generatedAlt);

      const created = await apiMutate("media", "POST", formData);
      if (created) {
        setThumbnailUrl(created.url);
        if (!thumbnailAlt.trim()) setThumbnailAlt(created.altText || generatedAlt);
        setNotice({
          type: "success",
          text: created.isDuplicate
            ? "Gambar identik sudah ada di Pustaka Media."
            : "Thumbnail portofolio berhasil diunggah.",
        });
        await onRefresh();
      }
    } finally {
      setUploadingThumb(false);
    }
  }

  const filteredPortfolios = portfolios.filter((item) => {
    const matchSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.clientName.toLowerCase().includes(search.toLowerCase()) ||
      item.serviceCategory.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredPortfolios.length / itemsPerPage) || 1;
  const paginatedPortfolios = filteredPortfolios.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Portofolio Klien</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dokumentasikan rekam jejak solusi digital dan hasil terukur proyek klien Next Karya.
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
          Tambah Portofolio
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari berdasarkan nama klien, judul, atau kategori..."
            className={`${INPUT_CLASS} pl-9`}
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className={INPUT_CLASS}
          >
            <option value="all">Semua Status</option>
            <option value="PUBLISHED">Sudah Tayang</option>
            <option value="DRAFT">Draf</option>
            <option value="ARCHIVED">Diarsipkan</option>
          </select>
        </div>
      </div>

      {/* 3. Table of Portfolios */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Studi Kasus Proyek</th>
                <th className="px-4 py-3">Klien</th>
                <th className="px-4 py-3">Solusi</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tanggal Terbit</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedPortfolios.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.thumbnailAlt || item.title}
                          className="size-10 rounded-md object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground shrink-0">
                          <BriefcaseIcon className="size-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                            {item.title}
                          </p>
                          {item.isFeatured && (
                            <StarIcon className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-muted-foreground truncate max-w-xs">
                          /{item.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{item.clientName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.serviceCategory}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.publishedAt ? formatDateShortId(item.publishedAt) : "Belum terbit"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openSnapshotModal("PORTFOLIO", item.id, item.title)}
                        title="Riwayat Revisi"
                        className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <HistoryIcon className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        title="Sunting Portofolio"
                        className="rounded-md border border-border p-1.5 text-primary hover:bg-primary/10"
                      >
                        <PencilIcon className="size-3.5" />
                      </button>
                      {item.status !== "PUBLISHED" ? (
                        <button
                          type="button"
                          onClick={() => handleLifecycle(item, "publish")}
                          className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-500 hover:bg-emerald-500/20"
                        >
                          Terbitkan
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleLifecycle(item, "archive")}
                          className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[11px] font-semibold text-destructive hover:bg-destructive/20"
                        >
                          Arsipkan
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedPortfolios.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    Tidak ada portofolio yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <span className="text-xs text-muted-foreground">
              Menampilkan {paginatedPortfolios.length} dari {filteredPortfolios.length} portofolio
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className={SECONDARY_BTN_CLASS}
              >
                Sebelumnya
              </button>
              <span className="text-xs font-semibold px-2">
                Halaman {page} dari {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={SECONDARY_BTN_CLASS}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Portfolio Editor Modal */}
      {editorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-base font-bold text-foreground">
                {editingId ? "Sunting Portofolio Klien" : "Tambah Portofolio Baru"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSavePortfolio} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL_CLASS}>Judul Portofolio *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingId && !slug) setSlug(slugifyText(e.target.value));
                    }}
                    placeholder="Contoh: Otomasi Sistem Logistik PT Maju"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Nama Klien *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Contoh: PT Maju Gemilang"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <UrlField
                id="portfolio-slug"
                prefix="/portofolio/"
                value={slug}
                onChange={setSlug}
                placeholder="otomasi-sistem-logistik"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={LABEL_CLASS}>Kategori Solusi *</label>
                  <input
                    type="text"
                    required
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    placeholder="Web App, Mobile App, Cloud"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Metrik Hasil Terukur</label>
                  <input
                    type="text"
                    value={metricResult}
                    onChange={(e) => setMetricResult(e.target.value)}
                    placeholder="Contoh: +350% Efisiensi"
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
                <label className={LABEL_CLASS}>Ringkasan Proyek *</label>
                <textarea
                  required
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Jelaskan tantangan bisnis klien dan solusi yang dikerjakan oleh Next Karya."
                  className={`${INPUT_CLASS} h-auto py-2`}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Ringkasan Dampak Bisnis (Impact)</label>
                <textarea
                  rows={2}
                  value={impactSummary}
                  onChange={(e) => setImpactSummary(e.target.value)}
                  placeholder="Dampak konkret pasca implementasi bagi operasional klien."
                  className={`${INPUT_CLASS} h-auto py-2`}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Teknologi yang Digunakan (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="Next.js, Tailwind CSS, PostgreSQL, Docker"
                  className={INPUT_CLASS}
                />
              </div>

              {/* Thumbnail Picker */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <label className={LABEL_CLASS}>Thumbnail Gambar Proyek</label>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  {thumbnailUrl && (
                    <img
                      src={thumbnailUrl}
                      alt={thumbnailAlt || "Thumbnail"}
                      className="size-16 rounded-lg object-cover border border-border"
                    />
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaPickerOpen(true)}
                      className={SECONDARY_BTN_CLASS}
                    >
                      <ImageIcon className="size-4 mr-1.5" />
                      Pilih dari Pustaka
                    </button>
                    <label className={`${SECONDARY_BTN_CLASS} cursor-pointer`}>
                      <UploadIcon className="size-4 mr-1.5" />
                      {uploadingThumb ? "Mengunggah..." : "Unggah Gambar"}
                      <input
                        type="file"
                        accept="image/webp,image/png,image/jpeg"
                        onChange={handleDirectThumbUpload}
                        disabled={uploadingThumb}
                        className="hidden"
                      />
                    </label>
                    {thumbnailUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailUrl("");
                          setThumbnailAlt("");
                        }}
                        className="text-xs text-destructive hover:underline ml-2"
                      >
                        Hapus Thumbnail
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="port-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="size-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="port-featured" className="text-xs font-semibold text-foreground cursor-pointer">
                  Tandai sebagai Portofolio Unggulan (Tampil di Beranda Utama)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
                <button type="button" onClick={resetForm} className={SECONDARY_BTN_CLASS}>
                  Batal
                </button>
                <button type="submit" className={PRIMARY_BTN_CLASS}>
                  {editingId ? "Simpan Perubahan" : "Tambah Portofolio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        mediaItems={mediaItems}
        onSelect={(item) => {
          setThumbnailUrl(item.url);
          if (!thumbnailAlt.trim()) setThumbnailAlt(item.altText || item.originalName);
        }}
        title="Pilih Thumbnail Portofolio"
      />
    </div>
  );
}
