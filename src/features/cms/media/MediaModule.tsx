"use client";

import React, { useState } from "react";
import {
  ImageIcon,
  UploadIcon,
  SearchIcon,
  Trash2Icon,
  CopyIcon,
  CheckIcon,
  FileIcon,
} from "lucide-react";
import type { CmsMediaItem } from "../types";
import {
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BTN_CLASS,
  SECONDARY_BTN_CLASS,
} from "../constants";
import { formatBytes, formatDateShortId } from "../utils";

export interface MediaModuleProps {
  mediaItems: CmsMediaItem[];
  onRefresh: () => Promise<void>;
  apiMutate: (
    endpoint: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: any,
    updatedAtHeader?: string
  ) => Promise<any>;
  setNotice: (notice: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export function MediaModule({
  mediaItems,
  onRefresh,
  apiMutate,
  setNotice,
}: MediaModuleProps) {
  const [search, setSearch] = useState("");
  const [mimeFilter, setMimeFilter] = useState("all");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      setNotice({
        type: "error",
        text: "Pilih berkas gambar atau PDF terlebih dahulu sebelum mengunggah.",
      });
      return;
    }

    const isPdf = selectedFile.type === "application/pdf";
    const maxAllowed = isPdf ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (selectedFile.size > maxAllowed) {
      setNotice({
        type: "error",
        text: `Ukuran berkas melebihi batas maksimal (${isPdf ? "10 MB untuk PDF" : "5 MB untuk Gambar"}).`,
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (altText.trim()) {
        formData.append("altText", altText.trim());
      }

      const created = await apiMutate("media", "POST", formData);
      if (created) {
        setNotice({
          type: "success",
          text: created.isDuplicate
            ? "Berkas identik sudah ada di Pustaka Media. Menggunakan berkas yang telah tersimpan."
            : `Berkas "${created.originalName}" berhasil diunggah ke Pustaka Media.`,
        });
        setSelectedFile(null);
        setAltText("");
        await onRefresh();
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(item: CmsMediaItem) {
    if (!confirm(`Hapus berkas "${item.originalName}" dari pustaka media? Tindakan ini permanen.`)) {
      return;
    }

    const res = await apiMutate(`media/${item.id}`, "DELETE");
    if (res) {
      setNotice({
        type: "success",
        text: `Berkas "${item.originalName}" berhasil dihapus.`,
      });
      await onRefresh();
    }
  }

  function handleCopyUrl(item: CmsMediaItem) {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
      setNotice({ type: "info", text: "Tautan berkas disalin ke clipboard." });
    }
  }

  const filteredMedia = mediaItems.filter((item) => {
    const matchSearch =
      !search.trim() ||
      item.originalName.toLowerCase().includes(search.toLowerCase()) ||
      (item.altText && item.altText.toLowerCase().includes(search.toLowerCase()));
    const matchMime =
      mimeFilter === "all" ||
      (mimeFilter === "image" && item.mimeType.startsWith("image/")) ||
      (mimeFilter === "pdf" && item.mimeType === "application/pdf");
    return matchSearch && matchMime;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Gambar & Berkas</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pustaka aset media digital dengan validasi keutuhan binary dan proteksi duplikasi SHA-256.
          </p>
        </div>
      </div>

      {/* 2. Upload Box */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
        <h2 className="text-sm font-semibold text-foreground mb-3">Unggah Berkas Baru</h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-5">
            <label className={LABEL_CLASS}>Pilih Berkas (WebP, PNG, JPEG, SVG, PDF)</label>
            <input
              type="file"
              accept="image/webp,image/png,image/jpeg,image/svg+xml,application/pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              disabled={uploading}
              className={`${INPUT_CLASS} file:mr-2 file:rounded-md file:border-0 file:bg-primary/10 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-primary cursor-pointer`}
            />
          </div>
          <div className="sm:col-span-4">
            <label className={LABEL_CLASS}>Teks Alternatif (Alt Text / Deskripsi)</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              disabled={uploading}
              placeholder="Contoh: Tangkapan layar dashboard analitik"
              className={INPUT_CLASS}
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className={`${PRIMARY_BTN_CLASS} w-full`}
            >
              <UploadIcon className="size-4 mr-1.5" />
              {uploading ? "Mengunggah..." : "Unggah ke Pustaka"}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Filter Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama berkas atau deskripsi..."
            className={`${INPUT_CLASS} pl-9`}
          />
        </div>
        <div>
          <select
            value={mimeFilter}
            onChange={(e) => setMimeFilter(e.target.value)}
            className={INPUT_CLASS}
          >
            <option value="all">Semua Jenis Berkas</option>
            <option value="image">Gambar Saja (WebP, PNG, JPG, SVG)</option>
            <option value="pdf">Dokumen PDF Saja</option>
          </select>
        </div>
      </div>

      {/* 4. Media Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card shadow-xs transition hover:border-primary/50"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-muted/30">
              {item.mimeType.startsWith("image/") ? (
                <img
                  src={item.url}
                  alt={item.altText || item.originalName}
                  className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center text-muted-foreground">
                  <FileIcon className="size-8" />
                  <span className="mt-1 text-[10px] font-bold uppercase">PDF</span>
                </div>
              )}
            </div>

            <div className="p-3">
              <p className="truncate text-xs font-semibold text-foreground" title={item.originalName}>
                {item.originalName}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {formatBytes(item.fileSize)}
                {item.width && item.height ? ` • ${item.width}x${item.height}px` : ""}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {formatDateShortId(item.createdAt)}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item)}
                  title="Salin Tautan Berkas"
                  className="rounded-md border border-border p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {copiedId === item.id ? (
                    <CheckIcon className="size-3.5 text-emerald-500" />
                  ) : (
                    <CopyIcon className="size-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  title="Hapus Berkas"
                  className="rounded-md border border-border p-1 text-destructive hover:bg-destructive/10"
                >
                  <Trash2Icon className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMedia.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
            Tidak ada berkas yang cocok dengan filter pencarian.
          </div>
        )}
      </div>
    </div>
  );
}
