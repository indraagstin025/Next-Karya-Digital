"use client";

import React, { useState } from "react";
import {
  FileTextIcon,
  PlusIcon,
  SearchIcon,
  FolderIcon,
  PencilIcon,
  HistoryIcon,
  ImageIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import type { CmsCategory, CmsMediaItem, CmsPost, ContentStatus } from "../types";
import {
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BTN_CLASS,
  SECONDARY_BTN_CLASS,
  DANGER_BTN_CLASS,
} from "../constants";
import {
  slugifyText,
  formatDateShortId,
  extractBodyTextFromBlocks,
  buildBlocksFromBodyText,
} from "../utils";
import { StatusBadge } from "../components/StatusBadge";
import { UrlField } from "../components/UrlField";
import { SeoSection } from "../components/SeoSection";
import { MediaPickerModal } from "../components/MediaPickerModal";

export interface PostModuleProps {
  posts: CmsPost[];
  categories: CmsCategory[];
  mediaItems: CmsMediaItem[];
  onRefresh: () => Promise<void>;
  apiMutate: (
    endpoint: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: any,
    updatedAtHeader?: string
  ) => Promise<any>;
  setNotice: (notice: { type: "success" | "error" | "info"; text: string } | null) => void;
  openSnapshotModal: (entityType: "POST", entityId: string, title: string) => void;
}

export function PostModule({
  posts,
  categories,
  mediaItems,
  onRefresh,
  apiMutate,
  setNotice,
  openSnapshotModal,
}: PostModuleProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Editor Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [tags, setTags] = useState("Web Development, Teknologi");
  const [readingTime, setReadingTime] = useState(4);
  const [coverUrl, setCoverUrl] = useState("");
  const [coverAlt, setCoverAlt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);

  // Category Form States
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");

  function resetForm() {
    setEditorOpen(false);
    setEditingId(null);
    setUpdatedAt("");
    setTitle("");
    setSlug("");
    setExcerpt("");
    setCategoryId(categories[0]?.id || "");
    setTags("Web Development, Teknologi");
    setReadingTime(4);
    setCoverUrl("");
    setCoverAlt("");
    setSeoTitle("");
    setSeoDesc("");
    setBodyText("");
    setUploadingCover(false);
  }

  function startEdit(post: CmsPost) {
    setEditingId(post.id);
    setUpdatedAt(post.updatedAt);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setCategoryId(post.categoryId);
    setTags(Array.isArray(post.tags) ? post.tags.join(", ") : "");
    setReadingTime(post.readingTimeMinutes || 4);
    setCoverUrl(post.coverUrl || "");
    setCoverAlt(post.coverAlt || "");
    setSeoTitle(post.seoTitle || "");
    setSeoDesc(post.seoDescription || "");
    setBodyText(extractBodyTextFromBlocks(post.content));
    setEditorOpen(true);
  }

  async function handleSavePost(e: React.FormEvent) {
    e.preventDefault();
    const tagsArr = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Record<string, any> = {
      title: title.trim(),
      slug: (slug.trim() || slugifyText(title)).slice(0, 255),
      excerpt: excerpt.trim(),
      categoryId: categoryId || categories[0]?.id,
      tags: tagsArr,
      readingTimeMinutes: Number(readingTime) || 4,
      coverUrl: coverUrl.trim() || null,
      coverAlt: coverAlt.trim() || null,
      seoTitle: seoTitle.trim() || null,
      seoDescription: seoDesc.trim() || null,
      content: buildBlocksFromBodyText(bodyText.trim() || excerpt.trim()),
    };

    if (editingId) {
      payload.updatedAt = updatedAt;
      const updated = await apiMutate(`posts/${editingId}`, "PATCH", payload, updatedAt);
      if (updated) {
        setNotice({ type: "success", text: `Artikel "${updated.title}" berhasil diperbarui.` });
        resetForm();
        await onRefresh();
      }
    } else {
      const created = await apiMutate("posts", "POST", payload);
      if (created) {
        setNotice({ type: "success", text: `Draf artikel "${created.title}" berhasil dibuat.` });
        resetForm();
        await onRefresh();
      }
    }
  }

  async function handleLifecycle(post: CmsPost, action: "publish" | "archive") {
    const result = await apiMutate(
      `posts/${post.id}/${action}`,
      "POST",
      { updatedAt: post.updatedAt },
      post.updatedAt
    );
    if (result) {
      setNotice({
        type: "success",
        text:
          action === "publish"
            ? `Artikel "${post.title}" berhasil diterbitkan.`
            : `Artikel "${post.title}" berhasil diarsipkan.`,
      });
      await onRefresh();
    }
  }

  async function handleDirectCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const generatedAlt = title.trim()
        ? `Gambar sampul artikel: ${title.trim()}`
        : file.name.replace(/\.[^/.]+$/, "");
      formData.append("altText", generatedAlt);

      const created = await apiMutate("media", "POST", formData);
      if (created) {
        setCoverUrl(created.url);
        if (!coverAlt.trim()) setCoverAlt(created.altText || generatedAlt);
        setNotice({
          type: "success",
          text: created.isDuplicate
            ? "Gambar identik sudah ada di Pustaka Media. Menggunakan gambar yang telah ada."
            : "Gambar sampul berhasil diunggah ke Pustaka Media.",
        });
        await onRefresh();
      }
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const payload = {
      name: newCatName.trim(),
      slug: (newCatSlug.trim() || slugifyText(newCatName)).slice(0, 100),
    };

    const created = await apiMutate("categories", "POST", payload);
    if (created) {
      setNotice({ type: "success", text: `Kategori "${created.name}" berhasil ditambahkan.` });
      setNewCatName("");
      setNewCatSlug("");
      await onRefresh();
    }
  }

  async function handleDeleteCategory(cat: CmsCategory) {
    if (!confirm(`Hapus kategori "${cat.name}"? Pastikan tidak ada artikel yang menggunakan kategori ini.`)) {
      return;
    }
    const res = await apiMutate(`categories/${cat.id}`, "DELETE");
    if (res) {
      setNotice({ type: "success", text: `Kategori "${cat.name}" berhasil dihapus.` });
      await onRefresh();
    }
  }

  // Filtered post items
  const filteredPosts = posts.filter((post) => {
    const matchSearch =
      !search.trim() ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.slug.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || post.categoryId === categoryFilter;
    const matchStatus = statusFilter === "all" || post.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage) || 1;
  const paginatedPosts = filteredPosts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Artikel Blog</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tulis, sunting, dan atur publikasi artikel wawasan digital Next Karya.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCategoryModalOpen(true)}
            className={SECONDARY_BTN_CLASS}
          >
            <FolderIcon className="size-4 mr-1.5" />
            Kelola Kategori
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setEditorOpen(true);
            }}
            className={PRIMARY_BTN_CLASS}
          >
            <PlusIcon className="size-4 mr-1.5" />
            Tulis Artikel
          </button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-3 sm:grid-cols-4">
        <div className="relative sm:col-span-2">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari berdasarkan judul atau slug..."
            className={`${INPUT_CLASS} pl-9`}
          />
        </div>
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className={INPUT_CLASS}
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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

      {/* 3. Table of Posts */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Artikel</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tanggal Terbit</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedPosts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {post.coverUrl ? (
                        <img
                          src={post.coverUrl}
                          alt={post.coverAlt || post.title}
                          className="size-10 rounded-md object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground shrink-0">
                          <FileTextIcon className="size-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                          {post.title}
                        </p>
                        <p className="text-[11px] font-mono text-muted-foreground truncate max-w-xs">
                          /{post.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {post.category?.name || "Tanpa Kategori"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {post.publishedAt ? formatDateShortId(post.publishedAt) : "Belum terbit"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openSnapshotModal("POST", post.id, post.title)}
                        title="Riwayat Revisi"
                        className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <HistoryIcon className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(post)}
                        title="Sunting Artikel"
                        className="rounded-md border border-border p-1.5 text-primary hover:bg-primary/10"
                      >
                        <PencilIcon className="size-3.5" />
                      </button>
                      {post.status !== "PUBLISHED" ? (
                        <button
                          type="button"
                          onClick={() => handleLifecycle(post, "publish")}
                          className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-500 hover:bg-emerald-500/20"
                        >
                          Terbitkan
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleLifecycle(post, "archive")}
                          className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[11px] font-semibold text-destructive hover:bg-destructive/20"
                        >
                          Arsipkan
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    Tidak ada artikel yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <span className="text-xs text-muted-foreground">
              Menampilkan {paginatedPosts.length} dari {filteredPosts.length} artikel
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

      {/* 4. Post Editor Modal */}
      {editorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-base font-bold text-foreground">
                {editingId ? "Sunting Artikel Blog" : "Tulis Artikel Baru"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="flex-1 overflow-y-auto p-6 space-y-4">
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
                placeholder="strategi-transformasi-digital"
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
                  <label className={LABEL_CLASS}>Estimasi Waktu Baca (Menit)</label>
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
                <label className={LABEL_CLASS}>Ringkasan (Excerpt) *</label>
                <textarea
                  required
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkasan singkat artikel untuk kartu preview dan meta tag."
                  className={`${INPUT_CLASS} h-auto py-2`}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Tag / Topik (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Web Development, UI/UX, SEO"
                  className={INPUT_CLASS}
                />
              </div>

              {/* Cover Image Picker & Direct Upload */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <label className={LABEL_CLASS}>Gambar Sampul (Cover Image)</label>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  {coverUrl && (
                    <img
                      src={coverUrl}
                      alt={coverAlt || "Sampul"}
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
                      {uploadingCover ? "Mengunggah..." : "Unggah Gambar"}
                      <input
                        type="file"
                        accept="image/webp,image/png,image/jpeg"
                        onChange={handleDirectCoverUpload}
                        disabled={uploadingCover}
                        className="hidden"
                      />
                    </label>
                    {coverUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCoverUrl("");
                          setCoverAlt("");
                        }}
                        className="text-xs text-destructive hover:underline ml-2"
                      >
                        Hapus Sampul
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Body Content Blocks */}
              <div>
                <label className={LABEL_CLASS}>Isi Konten Artikel *</label>
                <textarea
                  required
                  rows={10}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Gunakan Markdown sederhana: ## Subjudul, ### Bagian, - Poin daftar, atau paragraf biasa."
                  className={`${INPUT_CLASS} h-auto py-2 font-mono text-xs`}
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Gunakan dua baris baru untuk memisahkan paragraf.
                </p>
              </div>

              <SeoSection
                idPrefix="post"
                title={seoTitle}
                setTitle={setSeoTitle}
                desc={seoDesc}
                setDesc={setSeoDesc}
              />

              <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
                <button type="button" onClick={resetForm} className={SECONDARY_BTN_CLASS}>
                  Batal
                </button>
                <button type="submit" className={PRIMARY_BTN_CLASS}>
                  {editingId ? "Simpan Perubahan" : "Simpan Draf"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Category Manager Drawer / Modal */}
      {categoryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Kelola Kategori Artikel</h3>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="my-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!newCatSlug) setNewCatSlug(slugifyText(e.target.value));
                  }}
                  placeholder="Nama Kategori"
                  className={INPUT_CLASS}
                />
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(slugifyText(e.target.value))}
                  placeholder="Slug (otomatis)"
                  className={INPUT_CLASS}
                />
              </div>
              <button type="submit" className={PRIMARY_BTN_CLASS}>
                Tambah Kategori
              </button>
            </form>

            <div className="flex-1 overflow-y-auto divide-y divide-border border-t border-border pt-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{cat.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">/{cat.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      {cat._count?.posts || 0} artikel
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-xs text-destructive hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Universal Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        mediaItems={mediaItems}
        onSelect={(item) => {
          setCoverUrl(item.url);
          if (!coverAlt.trim()) setCoverAlt(item.altText || item.originalName);
        }}
        title="Pilih Gambar Sampul Artikel"
      />
    </div>
  );
}
