"use client";

import React, { useState } from "react";
import {
  FileTextIcon,
  ImageIcon,
  SearchIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import type { CmsCategory, CmsMediaItem } from "../../types";
import {
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BTN_CLASS,
  SECONDARY_BTN_CLASS,
} from "../../constants";
import { slugifyText } from "../../utils";
import { UrlField } from "../../components/UrlField";
import { SeoSection } from "../../components/SeoSection";

export interface PostEditorModalProps {
  open: boolean;
  onClose: () => void;
  editingId: string | null;
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  excerpt: string;
  setExcerpt: (v: string) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  tags: string;
  setTags: (v: string) => void;
  readingTime: number;
  setReadingTime: (v: number) => void;
  coverUrl: string;
  setCoverUrl: (v: string) => void;
  coverAlt: string;
  setCoverAlt: (v: string) => void;
  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoDesc: string;
  setSeoDesc: (v: string) => void;
  bodyText: string;
  setBodyText: (v: string) => void;
  categories: CmsCategory[];
  uploadingCover: boolean;
  onDirectCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onOpenMediaPicker: () => void;
  onSavePost: (e: React.FormEvent) => Promise<void>;
}

export function PostEditorModal({
  open,
  onClose,
  editingId,
  title,
  setTitle,
  slug,
  setSlug,
  excerpt,
  setExcerpt,
  categoryId,
  setCategoryId,
  tags,
  setTags,
  readingTime,
  setReadingTime,
  coverUrl,
  setCoverUrl,
  coverAlt,
  setCoverAlt,
  seoTitle,
  setSeoTitle,
  seoDesc,
  setSeoDesc,
  bodyText,
  setBodyText,
  categories,
  uploadingCover,
  onDirectCoverUpload,
  onOpenMediaPicker,
  onSavePost,
}: PostEditorModalProps) {
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSavePost(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileTextIcon className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {editingId ? "Sunting Artikel Blog" : "Tulis Artikel Baru"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Kelola konten publikasi wawasan dan artikel digital Next Karya.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Tab Navigasi Editor */}
        <div className="flex border-b border-border bg-muted/30 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "content"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Konten Utama
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "seo"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Media & SEO Google
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === "content" ? (
            <>
              <div>
                <label className={LABEL_CLASS}>Judul Artikel *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingId && !slug) {
                      setSlug(slugifyText(e.target.value));
                    }
                  }}
                  placeholder="Contoh: Strategi Transformasi Digital UMKM 2026"
                  className={INPUT_CLASS}
                />
              </div>

              <UrlField
                id="post-slug"
                prefix="/blog/"
                value={slug}
                onChange={setSlug}
                placeholder="strategi-transformasi-digital-umkm-2026"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL_CLASS}>Kategori *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={INPUT_CLASS}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Waktu Baca (Menit)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={readingTime}
                    onChange={(e) => setReadingTime(Number(e.target.value))}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>Ringkasan Singkat (Excerpt) *</label>
                <textarea
                  required
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat pengantar artikel untuk kartu pratinjau..."
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Isi Tubuh Artikel (Content) *</label>
                <textarea
                  required
                  rows={10}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Tuliskan isi artikel lengkap di sini..."
                  className={`${INPUT_CLASS} font-sans leading-relaxed`}
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Gunakan paragraf baru untuk memisahkan babak pembahasan artikel.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Cover Image Upload & Media Picker */}
              <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
                <span className={LABEL_CLASS}>Gambar Sampul Artikel</span>
                {coverUrl ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={coverUrl}
                      alt={coverAlt || "Pratinjau sampul"}
                      className="size-20 rounded-lg border border-border object-cover shadow-xs"
                    />
                    <div className="flex-1 space-y-2">
                      <p className="text-xs font-mono text-muted-foreground truncate max-w-md">
                        {coverUrl}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCoverUrl("")}
                          className="text-xs text-rose-500 hover:underline"
                        >
                          Hapus Sampul
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <label className={`${PRIMARY_BTN_CLASS} cursor-pointer`}>
                      <UploadIcon className="size-4 mr-1.5" />
                      {uploadingCover ? "Mengunggah..." : "Unggah Gambar"}
                      <input
                        type="file"
                        accept="image/webp,image/png,image/jpeg"
                        onChange={onDirectCoverUpload}
                        disabled={uploadingCover}
                        className="sr-only"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={onOpenMediaPicker}
                      className={SECONDARY_BTN_CLASS}
                    >
                      <ImageIcon className="size-4 mr-1.5" />
                      Pilih dari Pustaka Media
                    </button>
                  </div>
                )}

                <div>
                  <label className={LABEL_CLASS}>Teks Keterangan Gambar (Alt Text)</label>
                  <input
                    type="text"
                    value={coverAlt}
                    onChange={(e) => setCoverAlt(e.target.value)}
                    placeholder="Deskripsi singkat gambar untuk aksesibilitas dan SEO..."
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>Tagar / Kata Kunci (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Web Development, Transformasi Digital, Next.js"
                  className={INPUT_CLASS}
                />
              </div>

              <SeoSection
                idPrefix="post"
                title={seoTitle}
                setTitle={setSeoTitle}
                desc={seoDesc}
                setDesc={setSeoDesc}
              />
            </>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className={SECONDARY_BTN_CLASS}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className={PRIMARY_BTN_CLASS}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Menyimpan..."
                : editingId
                ? "Perbarui Artikel"
                : "Simpan Draf Artikel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostEditorModal;
