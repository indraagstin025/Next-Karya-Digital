"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  ImageIcon,
  UploadIcon,
} from "lucide-react";
import type { CmsCategory, CmsMediaItem, CmsPost } from "../types";
import {
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BTN_CLASS,
  SECONDARY_BTN_CLASS,
} from "../constants";
import {
  buildBlocksFromBodyText,
  extractBodyTextFromBlocks,
  slugifyText,
} from "../utils";
import { UrlField } from "../components/UrlField";
import { SeoSection } from "../components/SeoSection";
import { MediaPickerModal } from "../components/MediaPickerModal";
import { MediaUploadError, uploadMediaFile } from "../media/uploadMediaFile";

type EditorTab = "content" | "seo";
type Notice = { type: "success" | "error" | "info"; text: string };

export interface PostEditorPageProps {
  mode: "create" | "edit";
  post?: CmsPost | null;
  categories: CmsCategory[];
  mediaItems: CmsMediaItem[];
  availablePosts: CmsPost[];
  initialError?: string | null;
}

function noticeClass(type: Notice["type"]) {
  if (type === "error") {
    return "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300";
  }
  if (type === "success") {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }
  return "border-primary/40 bg-primary/10 text-primary";
}

export function PostEditorPage({
  mode,
  post,
  categories,
  mediaItems,
  availablePosts,
  initialError,
}: PostEditorPageProps) {
  const router = useRouter();
  const editingId = mode === "edit" ? post?.id ?? null : null;
  const updatedAt = post?.updatedAt ?? "";

  const initialTags = post
    ? Array.isArray(post.tags)
      ? post.tags.join(", ")
      : ""
    : "Web Development, Teknologi";

  const [activeTab, setActiveTab] = useState<EditorTab>("content");
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [categoryId, setCategoryId] = useState(
    post?.categoryId || categories[0]?.id || ""
  );
  const [tags, setTags] = useState(initialTags);
  const [readingTime, setReadingTime] = useState(post?.readingTimeMinutes || 4);
  const [relatedIds, setRelatedIds] = useState<string[]>(
    Array.isArray(post?.relatedPostIds) ? post.relatedPostIds : []
  );
  const [coverUrl, setCoverUrl] = useState(post?.coverUrl ?? "");
  const [coverAlt, setCoverAlt] = useState(post?.coverAlt ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [seoDesc, setSeoDesc] = useState(post?.seoDescription ?? "");
  const [bodyText, setBodyText] = useState(
    post ? extractBodyTextFromBlocks(post.content) : ""
  );

  const [mediaList, setMediaList] = useState(mediaItems);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(
    initialError ? { type: "error", text: initialError } : null
  );

  const initialSnapshot = useMemo(
    () =>
      JSON.stringify({
        title: post?.title ?? "",
        slug: post?.slug ?? "",
        excerpt: post?.excerpt ?? "",
        categoryId: post?.categoryId || categories[0]?.id || "",
        tags: initialTags,
        readingTime: post?.readingTimeMinutes || 4,
        coverUrl: post?.coverUrl ?? "",
        coverAlt: post?.coverAlt ?? "",
        seoTitle: post?.seoTitle ?? "",
        seoDesc: post?.seoDescription ?? "",
        relatedIds: Array.isArray(post?.relatedPostIds) ? post.relatedPostIds : [],
        bodyText: post ? extractBodyTextFromBlocks(post.content) : "",
      }),
    [post, categories, initialTags]
  );

  const currentSnapshot = JSON.stringify({
    title,
    slug,
    excerpt,
    categoryId,
    tags,
    readingTime,
    coverUrl,
    coverAlt,
    seoTitle,
    seoDesc,
    relatedIds,
    bodyText,
  });

  const isDirty = currentSnapshot !== initialSnapshot;

  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function handleBack() {
    if (
      isDirty &&
      !window.confirm(
        "Perubahan artikel belum disimpan. Keluar dari editor dan kembali ke daftar artikel?"
      )
    ) {
      return;
    }

    router.push("/cms/artikel");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting || uploadingCover) return;

    if (!categoryId) {
      setNotice({
        type: "error",
        text: "Pilih kategori artikel terlebih dahulu. Kategori dibuat dari daftar Artikel.",
      });
      return;
    }

    setSubmitting(true);
    setNotice(null);

    try {
      const tagsArr = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const payload: Record<string, unknown> = {
        title: title.trim(),
        slug: (slug.trim() || slugifyText(title)).slice(0, 255),
        excerpt: excerpt.trim(),
        categoryId,
        tags: tagsArr,
        readingTimeMinutes: Number(readingTime) || 4,
        relatedPostIds: relatedIds.slice(0, 10),
        coverUrl: coverUrl.trim() || null,
        coverAlt: coverAlt.trim() || null,
        seoTitle: seoTitle.trim() || null,
        seoDescription: seoDesc.trim() || null,
        content: buildBlocksFromBodyText(bodyText.trim() || excerpt.trim()),
      };

      if (editingId) {
        payload.updatedAt = updatedAt;
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (editingId) {
        headers["x-updated-at"] = updatedAt;
        headers["If-Unmodified-Since"] = updatedAt;
      }

      const response = await fetch(
        editingId ? `/api/cms/posts/${editingId}` : "/api/cms/posts",
        {
          method: editingId ? "PATCH" : "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        router.push("/?sesi=berakhir");
        return;
      }

      if (response.status === 409) {
        setNotice({
          type: "error",
          text:
            result?.error?.message ||
            "Artikel ini baru saja diubah staf lain. Muat ulang halaman sebelum menyimpan kembali.",
        });
        return;
      }

      if (!response.ok || !result?.success) {
        const detail = result?.error?.details?.[0]?.message;
        setNotice({
          type: "error",
          text: detail
            ? `${result?.error?.message || "Artikel gagal disimpan"} (${detail})`
            : result?.error?.message || "Artikel gagal disimpan. Silakan periksa kembali isian Anda.",
        });
        return;
      }

      router.push("/cms/artikel");
      router.refresh();
    } catch {
      setNotice({
        type: "error",
        text: "Terjadi gangguan jaringan saat menyimpan artikel. Silakan coba kembali.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDirectCoverUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";

    const allowed = ["image/webp", "image/png", "image/jpeg"];
    if (!allowed.includes(file.type)) {
      setNotice({
        type: "error",
        text: "Berkas ini belum didukung. Pilih gambar berformat WebP, PNG, atau JPEG.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice({
        type: "error",
        text: "Ukuran berkas melebihi batas maksimal 5 MB.",
      });
      return;
    }

    setUploadingCover(true);
    setNotice(null);

    try {
      const generatedAlt = title.trim()
        ? `Gambar sampul artikel: ${title.trim()}`
        : file.name.replace(/\.[^/.]+$/, "");

      const { media: created, isDuplicate } = await uploadMediaFile({
        file,
        altText: generatedAlt,
      });

      setCoverUrl(created.url);
      if (!coverAlt.trim()) {
        setCoverAlt(created.altText || generatedAlt);
      }
      setMediaList((previous) =>
        previous.some((item) => item.id === created.id)
          ? previous
          : [created, ...previous]
      );
      setNotice({
        type: "success",
        text: isDuplicate
          ? "Gambar identik sudah ada di Pustaka Media. Menggunakan gambar yang telah ada."
          : "Gambar sampul berhasil diunggah ke Pustaka Media.",
      });
    } catch (err) {
      if (err instanceof MediaUploadError && err.code === "AUTHENTICATION_REQUIRED") {
        return;
      }
      setNotice({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Terjadi gangguan jaringan saat mengunggah gambar. Silakan coba kembali.",
      });
    } finally {
      setUploadingCover(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleBack}
            className={SECONDARY_BTN_CLASS}
            aria-label="Kembali ke daftar artikel"
          >
            <ArrowLeftIcon className="size-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {editingId ? "Sunting Artikel Blog" : "Tulis Artikel Baru"}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {editingId
                ? "Perbarui isi artikel dan pengaturan publikasinya."
                : "Susun artikel sebagai draf, lalu terbitkan dari daftar artikel setelah selesai."}
            </p>
          </div>
        </div>
      </div>

      {notice && (
        <div
          role={notice.type === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${noticeClass(
            notice.type
          )}`}
        >
          {notice.type === "error" ? (
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
          ) : (
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
          )}
          <p className="min-w-0 flex-1 leading-relaxed">{notice.text}</p>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="shrink-0 text-xs font-semibold underline-offset-2 hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      {categories.length === 0 && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          Belum ada kategori artikel. Kembali ke daftar Artikel dan buat kategori
          terlebih dahulu sebelum menyimpan artikel.
        </div>
      )}

      <form
        id="post-editor-form"
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card shadow-xs"
      >
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

        <div className="space-y-4 p-6">
          {activeTab === "content" ? (
            <>
              <div>
                <label className={LABEL_CLASS}>Judul Artikel *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    if (!editingId && !slug) {
                      setSlug(slugifyText(event.target.value));
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
                    onChange={(event) => setCategoryId(event.target.value)}
                    className={INPUT_CLASS}
                    required
                  >
                    {categories.length === 0 && (
                      <option value="">Belum ada kategori</option>
                    )}
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
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
                    onChange={(event) => setReadingTime(Number(event.target.value))}
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
                  onChange={(event) => setExcerpt(event.target.value)}
                  placeholder="Ringkasan 1-2 kalimat pengantar artikel untuk kartu pratinjau..."
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>Isi Artikel (Content) *</label>
                <textarea
                  required
                  rows={14}
                  value={bodyText}
                  onChange={(event) => setBodyText(event.target.value)}
                  placeholder="Tuliskan isi artikel lengkap di sini..."
                  className={`${INPUT_CLASS} font-sans leading-relaxed`}
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Pisahkan paragraf dengan baris kosong. Awali baris dengan ## untuk
                  subjudul dan - untuk daftar. Untuk blok kode, apit dengan tiga
                  backtick pada baris pembuka dan penutup, misalnya ```ts.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <label className={LABEL_CLASS}>Artikel Terkait</label>
                  <span className="text-[11px] text-muted-foreground">
                    {relatedIds.length}/10 dipilih
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Artikel yang dipilih tampil di bagian &quot;Artikel terkait&quot; pada
                  halaman blog. Jika kosong, sistem memakai artikel dari kategori yang
                  sama.
                </p>
                {availablePosts.filter((item) => item.id !== editingId).length === 0 ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Belum ada artikel lain yang bisa dipilih.
                  </p>
                ) : (
                  <div className="mt-3 max-h-56 space-y-1 overflow-y-auto rounded-lg border border-border bg-card p-2">
                    {availablePosts
                      .filter((item) => item.id !== editingId)
                      .map((item) => {
                        const checked = relatedIds.includes(item.id);
                        const disabled = !checked && relatedIds.length >= 10;
                        return (
                          <label
                            key={item.id}
                            className={`flex items-start gap-2 rounded-md px-2 py-1.5 text-xs ${
                              disabled
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer hover:bg-muted/50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disabled}
                              onChange={() =>
                                setRelatedIds((previous) =>
                                  checked
                                    ? previous.filter((id) => id !== item.id)
                                    : [...previous, item.id]
                                )
                              }
                              className="mt-0.5 size-3.5 rounded border-border text-primary"
                            />
                            <span className="min-w-0">
                              <span className="block truncate font-medium text-foreground">
                                {item.title}
                              </span>
                              <span className="block text-[11px] text-muted-foreground">
                                {item.status === "PUBLISHED"
                                  ? "Terbit"
                                  : item.status === "DRAFT"
                                  ? "Draf"
                                  : "Diarsipkan"}{" "}
                                &middot; /blog/{item.slug}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
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
                      <p className="max-w-md truncate font-mono text-xs text-muted-foreground">
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
                      <UploadIcon className="mr-1.5 size-4" />
                      {uploadingCover ? "Mengunggah..." : "Unggah Gambar"}
                      <input
                        type="file"
                        accept="image/webp,image/png,image/jpeg"
                        onChange={handleDirectCoverUpload}
                        disabled={uploadingCover}
                        className="sr-only"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setMediaPickerOpen(true)}
                      className={SECONDARY_BTN_CLASS}
                    >
                      <ImageIcon className="mr-1.5 size-4" />
                      Pilih dari Pustaka Media
                    </button>
                  </div>
                )}

                <div>
                  <label className={LABEL_CLASS}>Teks Keterangan Gambar (Alt Text)</label>
                  <input
                    type="text"
                    value={coverAlt}
                    onChange={(event) => setCoverAlt(event.target.value)}
                    placeholder="Deskripsi singkat gambar untuk aksesibilitas dan SEO..."
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>
                  Tagar / Kata Kunci (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
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

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleBack}
              className={SECONDARY_BTN_CLASS}
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className={PRIMARY_BTN_CLASS}
              disabled={submitting || uploadingCover || categories.length === 0}
            >
              {submitting
                ? "Menyimpan..."
                : editingId
                ? "Perbarui Artikel"
                : "Simpan Draf Artikel"}
            </button>
          </div>
        </div>
      </form>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        mediaItems={mediaList}
        onSelect={(media: CmsMediaItem) => {
          setCoverUrl(media.url);
          if (!coverAlt.trim()) {
            setCoverAlt(media.altText || title.trim());
          }
          setMediaPickerOpen(false);
        }}
      />
    </div>
  );
}

export default PostEditorPage;
