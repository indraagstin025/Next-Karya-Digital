"use client";

import React, { useState } from "react";
import { ImageIcon, SearchIcon } from "lucide-react";
import type { CmsMediaItem } from "../types";
import { formatBytes } from "../utils";
import { INPUT_CLASS, SECONDARY_BTN_CLASS } from "../constants";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItems: CmsMediaItem[];
  onSelect: (item: CmsMediaItem) => void;
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  mediaItems,
  onSelect,
  title = "Pilih Gambar dari Pustaka Media",
}: MediaPickerModalProps) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const imageItems = mediaItems
    .filter((m) => m.mimeType.startsWith("image/"))
    .filter(
      (m) =>
        !search.trim() ||
        m.originalName.toLowerCase().includes(search.toLowerCase()) ||
        (m.altText && m.altText.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-picker-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ImageIcon className="size-4" />
            </div>
            <div>
              <h3 id="media-picker-title" className="text-base font-bold text-foreground">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground">
                Pilih aset visual yang sudah tersimpan untuk digunakan pada konten ini.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={SECONDARY_BTN_CLASS}
            aria-label="Tutup pemilih gambar"
          >
            Tutup
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan nama berkas atau deskripsi..."
              className={`${INPUT_CLASS} pl-9`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {imageItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <ImageIcon className="mb-2 size-10 text-muted-foreground/40" />
              <p className="text-xs font-semibold text-muted-foreground">
                Belum ada gambar yang sesuai di Pustaka Media.
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Anda dapat mengunggah berkas baru melalui tab Gambar & Berkas di CMS.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {imageItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-muted/20 text-left transition hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-background">
                    <img
                      src={item.url}
                      alt={item.altText || item.originalName}
                      className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {item.originalName}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {formatBytes(item.fileSize)}
                      {item.width && item.height ? ` • ${item.width}x${item.height}px` : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
