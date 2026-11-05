"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderIcon, PlusIcon } from "lucide-react";
import type { CmsCategory, CmsPost } from "../types";
import { PRIMARY_BTN_CLASS, SECONDARY_BTN_CLASS } from "../constants";
import { slugifyText } from "../utils";
import { PostDatatable } from "./components/PostDatatable";
import { CategoryManagerModal } from "./components/CategoryManagerModal";
import {
  EmergencyTakedownDialog,
  type EmergencyTakedownTarget,
} from "../emergency/EmergencyTakedownDialog";

export type CmsMutationResult = {
  message?: string;
  name?: string;
  title?: string;
  [key: string]: unknown;
} | null;

export interface PostModuleProps {
  posts: CmsPost[];
  categories: CmsCategory[];
  onRefresh: () => Promise<void>;
  apiMutate: (
    endpoint: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: unknown,
    updatedAtHeader?: string
  ) => Promise<CmsMutationResult>;
  setNotice: (notice: { type: "success" | "error" | "info"; text: string } | null) => void;
  openSnapshotModal: (entityType: "POST", entityId: string, title: string) => void;
}

export function PostModule({
  posts,
  categories,
  onRefresh,
  apiMutate,
  setNotice,
  openSnapshotModal,
}: PostModuleProps) {
  const router = useRouter();

  // Modal Visibility States
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [takedownTarget, setTakedownTarget] = useState<EmergencyTakedownTarget | null>(null);

  // Category Form States
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");

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

  async function handleEmergencyTakedownConfirm(
    target: EmergencyTakedownTarget,
    reason: string
  ) {
    const res = await apiMutate("emergency/unpublish", "POST", {
      targetEntity: target.entityType,
      targetId: target.entityId,
      reason,
    });
    if (res) {
      setNotice({
        type: "success",
        text:
          res.message ||
          `Artikel "${target.title}" berhasil ditarik secara darurat ke status DRAF.`,
      });
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
            Kelola publikasi artikel, panduan teknis, dan informasi layanan pada website.
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
          <Link
            href="/cms/artikel/baru"
            className={PRIMARY_BTN_CLASS}
          >
            <PlusIcon className="size-4 mr-1.5" />
            Tulis Artikel
          </Link>
        </div>
      </div>

      {/* 2. Datatable Card Mewah Shadcn Studio */}
      <PostDatatable
        posts={posts}
        categories={categories}
        onStartEdit={(post) => router.push(`/cms/artikel/${post.id}/edit`)}
        onLifecycle={handleLifecycle}
        onOpenSnapshot={(post) => openSnapshotModal("POST", post.id, post.title)}
        onEmergencyTakedown={(post) =>
          setTakedownTarget({
            entityType: "POST",
            entityId: post.id,
            title: post.title,
            slug: post.slug,
          })
        }
      />

      {/* 3. Category Manager Modal */}
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

      {/* 4. Emergency Takedown Dialog */}
      <EmergencyTakedownDialog
        open={Boolean(takedownTarget)}
        target={takedownTarget}
        onClose={() => setTakedownTarget(null)}
        onConfirm={handleEmergencyTakedownConfirm}
      />
    </div>
  );
}

export default PostModule;
