"use client";

import React, { useState } from "react";
import { FolderIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import type { CmsCategory } from "../../types";
import {
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BTN_CLASS,
  SECONDARY_BTN_CLASS,
} from "../../constants";
import { slugifyText } from "../../utils";
import { Badge } from "@/components/ui/badge";

export interface CategoryManagerModalProps {
  open: boolean;
  onClose: () => void;
  categories: CmsCategory[];
  newCatName: string;
  setNewCatName: (v: string) => void;
  newCatSlug: string;
  setNewCatSlug: (v: string) => void;
  onCreateCategory: (e: React.FormEvent) => Promise<void>;
  onDeleteCategory: (cat: CmsCategory) => Promise<void>;
}

export function CategoryManagerModal({
  open,
  onClose,
  categories,
  newCatName,
  setNewCatName,
  newCatSlug,
  setNewCatSlug,
  onCreateCategory,
  onDeleteCategory,
}: CategoryManagerModalProps) {
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreateCategory(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FolderIcon className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Kelola Kategori Artikel
              </h3>
              <p className="text-xs text-muted-foreground">
                Atur pengelompokan topik artikel blog dan wawasan digital.
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Form Tambah Kategori */}
          <form
            onSubmit={handleCreate}
            className="rounded-xl border border-border bg-muted/20 p-4 space-y-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tambah Kategori Baru
            </h4>
            <div>
              <label className={LABEL_CLASS}>Nama Kategori *</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  if (!newCatSlug) {
                    setNewCatSlug(slugifyText(e.target.value));
                  }
                }}
                placeholder="Contoh: Arsitektur Cloud & Keamanan"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Slug Kategori (URL)</label>
              <input
                type="text"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(slugifyText(e.target.value))}
                placeholder="arsitektur-cloud-keamanan"
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={submitting || !newCatName.trim()}
                className={PRIMARY_BTN_CLASS}
              >
                <PlusIcon className="size-4 mr-1.5" />
                {submitting ? "Menambahkan..." : "Tambah Kategori"}
              </button>
            </div>
          </form>

          {/* Daftar Kategori Yang Ada */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Kategori Aktif ({categories.length})
            </h4>
            <div className="divide-y divide-border rounded-xl border border-border bg-card">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3.5 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Badge className="bg-primary/10 text-primary border-0 rounded-sm font-semibold h-auto px-2 py-0.5">
                      {cat.name}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground truncate">
                      /{cat.slug}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteCategory(cat)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer transition-colors"
                    title={`Hapus kategori ${cat.name}`}
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </div>
              ))}

              {categories.length === 0 && (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  Belum ada kategori yang terdaftar.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className={SECONDARY_BTN_CLASS}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryManagerModal;
