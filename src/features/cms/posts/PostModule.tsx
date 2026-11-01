"use client";

import React, { useState } from "react";
import { FolderIcon, PlusIcon } from "lucide-react";
import type { CmsCategory, CmsMediaItem, CmsPost } from "../types";
import { PRIMARY_BTN_CLASS, SECONDARY_BTN_CLASS } from "../constants";
import {
  slugifyText,
  extractBodyTextFromBlocks,
  buildBlocksFromBodyText,
} from "../utils";
import { MediaPickerModal } from "../components/MediaPickerModal";
import { PostDatatable } from "./components/PostDatatable";
import { PostEditorModal } from "./components/PostEditorModal";
import { CategoryManagerModal } from "./components/CategoryManagerModal";

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
  // Modal Visibility States
  const [editorOpen, setEditorOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

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
    if (
      !confirm(
        `Hapus kategori "${cat.name}"? Pastikan tidak ada artikel yang menggunakan kategori ini.`
      )
    ) {
      return;
    }
    const res = await apiMutate(`categories/${cat.id}`, "DELETE");
    if (res) {
      setNotice({ type: "success", text: `Kategori "${cat.name}" berhasil dihapus.` });
      await onRefresh();
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Artikel Blog
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tulis, sunting, dan atur publikasi artikel wawasan digital Next Karya Solusindo.
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

      {/* 2. Datatable Card Mewah Shadcn Studio */}
      <PostDatatable
        posts={posts}
        categories={categories}
        onStartEdit={startEdit}
        onLifecycle={handleLifecycle}
        onOpenSnapshot={(post) => openSnapshotModal("POST", post.id, post.title)}
      />

      {/* 3. Post Editor Modal */}
      <PostEditorModal
        open={editorOpen}
        onClose={resetForm}
        editingId={editingId}
        title={title}
        setTitle={setTitle}
        slug={slug}
        setSlug={setSlug}
        excerpt={excerpt}
        setExcerpt={setExcerpt}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        tags={tags}
        setTags={setTags}
        readingTime={readingTime}
        setReadingTime={setReadingTime}
        coverUrl={coverUrl}
        setCoverUrl={setCoverUrl}
        coverAlt={coverAlt}
        setCoverAlt={setCoverAlt}
        seoTitle={seoTitle}
        setSeoTitle={setSeoTitle}
        seoDesc={seoDesc}
        setSeoDesc={setSeoDesc}
        bodyText={bodyText}
        setBodyText={setBodyText}
        categories={categories}
        uploadingCover={uploadingCover}
        onDirectCoverUpload={handleDirectCoverUpload}
        onOpenMediaPicker={() => setMediaPickerOpen(true)}
        onSavePost={handleSavePost}
      />

      {/* 4. Category Manager Modal */}
      <CategoryManagerModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categories={categories}
        newCatName={newCatName}
        setNewCatName={setNewCatName}
        newCatSlug={newCatSlug}
        setNewCatSlug={setNewCatSlug}
        onCreateCategory={handleCreateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* 5. Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        mediaItems={mediaItems}
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

export default PostModule;
