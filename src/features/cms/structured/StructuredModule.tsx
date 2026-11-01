"use client";

import React, { useState } from "react";
import { ArchiveIcon, HistoryIcon, PencilIcon } from "lucide-react";
import type {
  CmsFaq,
  CmsPageItem,
  CmsPortfolio,
  CmsRedirectItem,
  CmsTestimonial,
  StructuredSubTab,
} from "../types";
import {
  buildBlocksFromBodyText,
  extractBodyTextFromBlocks,
  slugifyText,
} from "../utils";
import {
  DANGER_BTN_CLASS,
  ICON_BTN_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BTN_CLASS,
  SECONDARY_BTN_CLASS,
} from "../constants";
import { StatusBadge } from "../components/StatusBadge";
import { UrlField } from "../components/UrlField";
import { SeoSection } from "../components/SeoSection";

interface StructuredModuleProps {
  subTab: StructuredSubTab;
  setStructuredSubTab: (tab: StructuredSubTab) => void;
  faqs: CmsFaq[];
  testimonials: CmsTestimonial[];
  pages: CmsPageItem[];
  redirects: CmsRedirectItem[];
  portfolios: CmsPortfolio[];
  apiMutate: (
    endpoint: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: any,
    updatedAtHeader?: string
  ) => Promise<any>;
  loadWorkspaceData: () => Promise<void>;
  setNotice: (notice: { type: "success" | "error" | "info"; text: string } | null) => void;
  openSnapshotModal: (entityType: string, entityId: string, title: string) => void;
  mutating: boolean;
}

export function StructuredModule({
  subTab,
  setStructuredSubTab,
  faqs,
  testimonials,
  pages,
  redirects,
  portfolios,
  apiMutate,
  loadWorkspaceData,
  setNotice,
  openSnapshotModal,
  mutating,
}: StructuredModuleProps) {
  // FAQ Form State
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqUpdatedAt, setFaqUpdatedAt] = useState("");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqCategory, setFaqCategory] = useState("Umum");
  const [faqSortOrder, setFaqSortOrder] = useState(1);
  const [faqIsActive, setFaqIsActive] = useState(true);

  // Testimonial Form State
  const [editingTestiId, setEditingTestiId] = useState<string | null>(null);
  const [testiUpdatedAt, setTestiUpdatedAt] = useState("");
  const [testiClientName, setTestiClientName] = useState("");
  const [testiClientRole, setTestiClientRole] = useState("");
  const [testiCompany, setTestiCompany] = useState("");
  const [testiContent, setTestiContent] = useState("");
  const [testiRating, setTestiRating] = useState(5);
  const [testiPortfolioId, setTestiPortfolioId] = useState("");

  // Static Page Form State
  const [pageEditorOpen, setPageEditorOpen] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageUpdatedAt, setPageUpdatedAt] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageSeoTitle, setPageSeoTitle] = useState("");
  const [pageSeoDesc, setPageSeoDesc] = useState("");
  const [pageUpdatedLabel, setPageUpdatedLabel] = useState("Diperbarui Oktober 2026");
  const [pageBodyText, setPageBodyText] = useState("");

  // Redirect Form State
  const [redirSource, setRedirSource] = useState("");
  const [redirTarget, setRedirTarget] = useState("");
  const [redirCode, setRedirCode] = useState<301 | 302>(301);

  // --- FAQ HANDLERS ---
  function resetFaqForm() {
    setEditingFaqId(null);
    setFaqUpdatedAt("");
    setFaqQuestion("");
    setFaqAnswer("");
    setFaqCategory("Umum");
    setFaqSortOrder(1);
    setFaqIsActive(true);
  }

  function selectFaqForEdit(item: CmsFaq) {
    setEditingFaqId(item.id);
    setFaqUpdatedAt(item.updatedAt);
    setFaqQuestion(item.question);
    setFaqAnswer(item.answer);
    setFaqCategory(item.category || "Umum");
    setFaqSortOrder(item.sortOrder || 1);
    setFaqIsActive(Boolean(item.isActive));
  }

  async function handleSaveFaq(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, any> = {
      question: faqQuestion.trim(),
      answer: faqAnswer.trim(),
      category: faqCategory.trim() || "Umum",
      sortOrder: Number(faqSortOrder) || 1,
      isActive: faqIsActive,
    };

    if (editingFaqId) {
      payload.updatedAt = faqUpdatedAt;
      const updated = await apiMutate(
        `faqs/${editingFaqId}`,
        "PATCH",
        payload,
        faqUpdatedAt
      );
      if (updated) {
        setNotice({
          type: "success",
          text: "Pertanyaan FAQ berhasil diperbarui.",
        });
        resetFaqForm();
        await loadWorkspaceData();
      }
    } else {
      const created = await apiMutate("faqs", "POST", payload);
      if (created) {
        setNotice({
          type: "success",
          text: "Pertanyaan FAQ baru berhasil ditambahkan.",
        });
        resetFaqForm();
        await loadWorkspaceData();
      }
    }
  }

  async function handleDeleteFaq(item: CmsFaq) {
    if (!window.confirm("Hapus pertanyaan ini? Tindakan ini tidak bisa dibatalkan.")) return;
    const res = await apiMutate(`faqs/${item.id}`, "DELETE", {});
    if (res) {
      setNotice({
        type: "success",
        text: "Pertanyaan FAQ berhasil dihapus.",
      });
      await loadWorkspaceData();
    }
  }

  // --- TESTIMONIAL HANDLERS ---
  function resetTestimonialForm() {
    setEditingTestiId(null);
    setTestiUpdatedAt("");
    setTestiClientName("");
    setTestiClientRole("");
    setTestiCompany("");
    setTestiContent("");
    setTestiRating(5);
    setTestiPortfolioId("");
  }

  function selectTestimonialForEdit(item: CmsTestimonial) {
    setEditingTestiId(item.id);
    setTestiUpdatedAt(item.updatedAt);
    setTestiClientName(item.clientName);
    setTestiClientRole(item.clientRole || "");
    setTestiCompany(item.companyName || "");
    setTestiContent(item.content);
    setTestiRating(item.rating || 5);
    setTestiPortfolioId(item.portfolioId || "");
  }

  async function handleSaveTestimonial(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, any> = {
      clientName: testiClientName.trim(),
      clientRole: testiClientRole.trim() || null,
      companyName: testiCompany.trim() || null,
      content: testiContent.trim(),
      rating: Number(testiRating) || 5,
      portfolioId: testiPortfolioId || null,
      status: "PUBLISHED",
    };

    if (editingTestiId) {
      payload.updatedAt = testiUpdatedAt;
      const updated = await apiMutate(
        `testimonials/${editingTestiId}`,
        "PATCH",
        payload,
        testiUpdatedAt
      );
      if (updated) {
        setNotice({
          type: "success",
          text: `Testimoni "${updated.clientName}" berhasil diperbarui.`,
        });
        resetTestimonialForm();
        await loadWorkspaceData();
      }
    } else {
      const created = await apiMutate("testimonials", "POST", payload);
      if (created) {
        setNotice({
          type: "success",
          text: `Testimoni "${created.clientName}" berhasil ditambahkan.`,
        });
        resetTestimonialForm();
        await loadWorkspaceData();
      }
    }
  }

  async function handleArchiveTestimonial(item: CmsTestimonial) {
    if (!window.confirm(`Arsipkan testimoni dari "${item.clientName}"? Testimoni tidak akan tampil di situs publik.`)) return;
    const res = await apiMutate(
      `testimonials/${item.id}/archive`,
      "POST",
      { updatedAt: item.updatedAt },
      item.updatedAt
    );
    if (res) {
      setNotice({
        type: "success",
        text: `Testimoni dari "${item.clientName}" berhasil diarsipkan.`,
      });
      await loadWorkspaceData();
    }
  }

  // --- PAGE HANDLERS ---
  function resetPageForm() {
    setPageEditorOpen(false);
    setEditingPageId(null);
    setPageUpdatedAt("");
    setPageTitle("");
    setPageSlug("");
    setPageSeoTitle("");
    setPageSeoDesc("");
    setPageUpdatedLabel("Diperbarui Oktober 2026");
    setPageBodyText("");
  }

  function selectPageForEdit(item: CmsPageItem) {
    setPageEditorOpen(true);
    setEditingPageId(item.id);
    setPageUpdatedAt(item.updatedAt);
    setPageTitle(item.title);
    setPageSlug(item.slug);
    setPageSeoTitle(item.seoTitle || "");
    setPageSeoDesc(item.seoDescription || "");
    setPageUpdatedLabel(
      item.content?.updatedLabel || "Diperbarui Oktober 2026"
    );
    setPageBodyText(extractBodyTextFromBlocks(item.content));
  }

  async function handleSavePage(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, any> = {
      title: pageTitle.trim(),
      slug: (pageSlug.trim() || slugifyText(pageTitle)).slice(0, 255),
      seoTitle: pageSeoTitle.trim() || null,
      seoDescription: pageSeoDesc.trim() || null,
      content: buildBlocksFromBodyText(
        pageBodyText.trim(),
        pageUpdatedLabel.trim() || "Diperbarui Oktober 2026"
      ),
    };

    if (editingPageId) {
      payload.updatedAt = pageUpdatedAt;
      const updated = await apiMutate(
        `pages/${editingPageId}`,
        "PATCH",
        payload,
        pageUpdatedAt
      );
      if (updated) {
        setNotice({
          type: "success",
          text: `Halaman "${updated.title}" berhasil diperbarui.`,
        });
        resetPageForm();
        await loadWorkspaceData();
      }
    } else {
      const created = await apiMutate("pages", "POST", payload);
      if (created) {
        setNotice({
          type: "success",
          text: `Halaman "${created.title}" berhasil dibuat.`,
        });
        resetPageForm();
        await loadWorkspaceData();
      }
    }
  }

  async function handlePageLifecycle(
    item: CmsPageItem,
    action: "publish" | "archive"
  ) {
    if (action === "archive" && !window.confirm(`Arsipkan "${item.title}"? Konten akan hilang dari situs, tetapi bisa dikembalikan lewat Riwayat Versi.`)) return;
    const res = await apiMutate(
      `pages/${item.id}/${action}`,
      "POST",
      { updatedAt: item.updatedAt },
      item.updatedAt
    );
    if (res) {
      setNotice({
        type: "success",
        text:
          action === "publish"
            ? `Halaman "${item.title}" berhasil ditayangkan.`
            : `Halaman "${item.title}" berhasil diarsipkan.`,
      });
      await loadWorkspaceData();
    }
  }

  // --- REDIRECT HANDLERS ---
  async function handleCreateRedirect(e: React.FormEvent) {
    e.preventDefault();
    const created = await apiMutate("redirects", "POST", {
      sourcePath: redirSource.trim(),
      targetPath: redirTarget.trim(),
      statusCode: redirCode,
    });
    if (created) {
      setNotice({
        type: "success",
        text: `Redirect ${created.sourcePath} ke ${created.targetPath} berhasil disimpan.`,
      });
      setRedirSource("");
      setRedirTarget("");
      await loadWorkspaceData();
    }
  }

  async function handleDeleteRedirect(id: string) {
    if (!window.confirm("Hapus aturan pengalihan ini? Alamat lama akan kembali menampilkan halaman tidak ditemukan.")) return;
    const res = await apiMutate(`redirects/${id}`, "DELETE", {});
    if (res) {
      setNotice({
        type: "success",
        text: "Aturan redirect berhasil dihapus.",
      });
      await loadWorkspaceData();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header: Page Title and Subtitle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Konten Pendukung
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Kelola FAQ, testimoni klien, halaman statis, dan aturan pengalihan alamat web Anda.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-card text-card-foreground shadow-xs p-2">
        {(
          [
            { id: "faqs", label: `FAQ (${faqs.length})` },
            {
              id: "testimonials",
              label: `Testimoni Klien (${testimonials.length})`,
            },
            { id: "pages", label: `Halaman Statis (${pages.length})` },
            { id: "redirects", label: `Pengalihan 301/302 (${redirects.length})` },
          ] as { id: StructuredSubTab; label: string }[]
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setStructuredSubTab(item.id)}
            className={`min-h-11 rounded-md px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
              subTab === item.id
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: FAQS */}
      {subTab === "faqs" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-xl border border-border bg-card text-card-foreground shadow-xs p-5">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-extrabold text-foreground">
                {editingFaqId ? "Ubah Pertanyaan FAQ" : "Tambah FAQ Baru"}
              </h2>
              {editingFaqId && (
                <button
                  type="button"
                  onClick={resetFaqForm}
                  className={SECONDARY_BTN_CLASS}
                >
                  Batal Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSaveFaq} className="space-y-4">
              <p className="text-[11px] text-muted-foreground">
                Kolom bertanda <span className="text-destructive" aria-hidden="true">*</span> wajib diisi.
              </p>
              <div>
                <label htmlFor="faq-q" className={LABEL_CLASS}>
                  Pertanyaan<span className="text-destructive" aria-hidden="true"> *</span>
                </label>
                <input
                  id="faq-q"
                  type="text"
                  required
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="Berapa lama estimasi pengerjaan website?"
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="faq-a" className={LABEL_CLASS}>
                  Jawaban Lengkap<span className="text-destructive" aria-hidden="true"> *</span>
                </label>
                <textarea
                  id="faq-a"
                  rows={4}
                  required
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Tulis jawaban lengkap dan transparan..."
                  className={INPUT_CLASS + " h-auto"}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="faq-cat" className={LABEL_CLASS}>
                    Kategori FAQ
                  </label>
                  <input
                    id="faq-cat"
                    type="text"
                    value={faqCategory}
                    onChange={(e) => setFaqCategory(e.target.value)}
                    placeholder="Umum / Teknis"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="faq-order" className={LABEL_CLASS}>
                    Urutan Tampil
                  </label>
                  <input
                    id="faq-order"
                    type="number"
                    value={faqSortOrder}
                    onChange={(e) =>
                      setFaqSortOrder(parseInt(e.target.value, 10) || 1)
                    }
                    className={`${INPUT_CLASS} tabular-nums`}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="faq-active"
                  type="checkbox"
                  checked={faqIsActive}
                  onChange={(e) => setFaqIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-border bg-muted/40 cursor-pointer"
                />
                <label
                  htmlFor="faq-active"
                  className="text-xs font-semibold text-foreground cursor-pointer"
                >
                  Tampilkan FAQ ini di halaman publik (Aktif)
                </label>
              </div>
              <button
                type="submit"
                disabled={mutating}
                className={PRIMARY_BTN_CLASS}
              >
                {mutating
                  ? "Menyimpan..."
                  : editingFaqId
                  ? "Simpan Perubahan FAQ"
                  : "Tambah FAQ"}
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-border bg-card text-card-foreground shadow-xs p-5 space-y-3">
            <h2 className="border-b border-border pb-3 text-base font-extrabold text-foreground">
              Daftar FAQ ({faqs.length})
            </h2>
            {faqs.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                Belum ada daftar FAQ yang ditambahkan.
              </p>
            ) : (
              faqs.map((f) => (
                <article
                  key={f.id}
                  className="rounded-xl border border-border bg-muted/30 p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-foreground">
                      {f.question}
                    </h3>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${
                        f.isActive
                          ? "border-emerald-500/40 bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                          : "border-amber-500/40 bg-amber-950/60 text-[#FBBF24]"
                      }`}
                    >
                      {f.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{f.answer}</p>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => selectFaqForEdit(f)}
                      className={ICON_BTN_CLASS}
                      aria-label="Ubah"
                      title="Ubah"
                    >
                      <PencilIcon className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(f)}
                      className={DANGER_BTN_CLASS}
                    >
                      Hapus
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      )}

      {/* SUB-TAB 2: TESTIMONIALS */}
      {subTab === "testimonials" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-xl border border-border bg-card text-card-foreground shadow-xs p-5">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-extrabold text-foreground">
                {editingTestiId
                  ? "Ubah Testimoni Klien"
                  : "Tambah Testimoni Klien"}
              </h2>
              {editingTestiId && (
                <button
                  type="button"
                  onClick={resetTestimonialForm}
                  className={SECONDARY_BTN_CLASS}
                >
                  Batal Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <p className="text-[11px] text-muted-foreground">
                Kolom bertanda <span className="text-destructive" aria-hidden="true">*</span> wajib diisi.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="testi-name" className={LABEL_CLASS}>
                    Nama Klien<span className="text-destructive" aria-hidden="true"> *</span>
                  </label>
                  <input
                    id="testi-name"
                    type="text"
                    required
                    value={testiClientName}
                    onChange={(e) => setTestiClientName(e.target.value)}
                    placeholder="dr. Hendra Wijaya"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="testi-role" className={LABEL_CLASS}>
                    Jabatan Klien
                  </label>
                  <input
                    id="testi-role"
                    type="text"
                    value={testiClientRole}
                    onChange={(e) => setTestiClientRole(e.target.value)}
                    placeholder="Kepala Klinik"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="testi-company" className={LABEL_CLASS}>
                    Perusahaan / Instansi
                  </label>
                  <input
                    id="testi-company"
                    type="text"
                    value={testiCompany}
                    onChange={(e) => setTestiCompany(e.target.value)}
                    placeholder="Klinik Pratama Sehat"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="testi-port" className={LABEL_CLASS}>
                    Tautkan Portofolio (Opsional)
                  </label>
                  <select
                    id="testi-port"
                    value={testiPortfolioId}
                    onChange={(e) => setTestiPortfolioId(e.target.value)}
                    className={INPUT_CLASS}
                  >
                    <option value="">Tanpa tautan portofolio</option>
                    {portfolios.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="testi-content" className={LABEL_CLASS}>
                  Kutipan Testimoni<span className="text-destructive" aria-hidden="true"> *</span>
                </label>
                <textarea
                  id="testi-content"
                  rows={3}
                  required
                  value={testiContent}
                  onChange={(e) => setTestiContent(e.target.value)}
                  placeholder="Pengalaman nyata klien bekerja sama dengan tim Next Karya..."
                  className={INPUT_CLASS + " h-auto"}
                />
              </div>
              <button
                type="submit"
                disabled={mutating}
                className={PRIMARY_BTN_CLASS}
              >
                {mutating
                  ? "Menyimpan..."
                  : editingTestiId
                  ? "Simpan Perubahan Testimoni"
                  : "Simpan Testimoni"}
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-border bg-card text-card-foreground shadow-xs p-5 space-y-3">
            <h2 className="border-b border-border pb-3 text-base font-extrabold text-foreground">
              Daftar Testimoni ({testimonials.length})
            </h2>
            {testimonials.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                Belum ada testimoni klien.
              </p>
            ) : (
              testimonials.map((t) => (
                <article
                  key={t.id}
                  className="rounded-xl border border-border bg-muted/30 p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {t.clientName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {t.clientRole ? `${t.clientRole} • ` : ""}{t.companyName}
                      </p>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-xs text-muted-foreground italic">"{t.content}"</p>
                  <div className="flex justify-end items-center gap-1.5 pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => selectTestimonialForEdit(t)}
                      className={ICON_BTN_CLASS}
                      aria-label="Ubah"
                      title="Ubah"
                    >
                      <PencilIcon className="size-4" aria-hidden="true" />
                    </button>
                    {t.status !== "ARCHIVED" && (
                      <button
                        type="button"
                        onClick={() => handleArchiveTestimonial(t)}
                        disabled={mutating}
                        className={ICON_BTN_CLASS}
                        aria-label="Arsipkan"
                        title="Arsipkan"
                      >
                        <ArchiveIcon className="size-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      )}

      {/* SUB-TAB 3: STATIC PAGES */}
      {subTab === "pages" && (
        <div className="space-y-6">
          {!pageEditorOpen ? (
            <section className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-foreground">
                    Daftar Halaman Statis / Legal ({pages.length})
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Halaman seperti Kebijakan Privasi, Syarat &amp; Ketentuan, atau Profil Perusahaan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetPageForm();
                    setPageEditorOpen(true);
                  }}
                  className={PRIMARY_BTN_CLASS}
                >
                  + Buat Halaman Baru
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {pages.map((pg) => (
                  <article
                    key={pg.id}
                    className="flex flex-col justify-between rounded-xl border border-border bg-muted/30 p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">
                          {pg.title}
                        </h3>
                        <p className="font-mono text-xs text-muted-foreground">
                          nextkarya.web.id/{pg.slug}
                        </p>
                      </div>
                      <StatusBadge status={pg.status} />
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-1.5 border-t border-border pt-3">
                      <button
                        type="button"
                        onClick={() => selectPageForEdit(pg)}
                        className={ICON_BTN_CLASS}
                        aria-label="Ubah"
                        title="Ubah"
                      >
                        <PencilIcon className="size-4" aria-hidden="true" />
                      </button>
                      {pg.status !== "PUBLISHED" && (
                        <button
                          type="button"
                          onClick={() => handlePageLifecycle(pg, "publish")}
                          disabled={mutating}
                          className={PRIMARY_BTN_CLASS}
                        >
                          Tayangkan
                        </button>
                      )}
                      {pg.status !== "ARCHIVED" && (
                        <button
                          type="button"
                          onClick={() => handlePageLifecycle(pg, "archive")}
                          disabled={mutating}
                          className={ICON_BTN_CLASS}
                          aria-label="Arsipkan"
                          title="Arsipkan"
                        >
                          <ArchiveIcon className="size-4" aria-hidden="true" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => openSnapshotModal("PAGE", pg.id, pg.title)}
                        className={ICON_BTN_CLASS}
                        aria-label="Lihat riwayat versi"
                        title="Lihat riwayat versi"
                      >
                        <HistoryIcon className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            /* Page Dedicated Editor View */
            <form onSubmit={handleSavePage} className="space-y-6" aria-labelledby="page-editor-heading">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 id="page-editor-heading" className="text-lg font-extrabold text-foreground">
                    {editingPageId ? "Ubah Halaman Statis / Legal" : "Buat Halaman Statis Baru"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {editingPageId
                      ? "Perubahan langsung tersimpan ke halaman ini. Versi sebelumnya tersimpan otomatis."
                      : "Halaman disimpan sebagai draf. Tekan Tayangkan di daftar agar tampil di situs publik."}
                  </p>
                </div>
                <button type="button" onClick={resetPageForm} className={SECONDARY_BTN_CLASS}>
                  Kembali ke Daftar
                </button>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Kolom bertanda <span className="text-destructive" aria-hidden="true">*</span> wajib diisi.
              </p>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-6">
                  <section
                    aria-labelledby="page-content-heading"
                    className="space-y-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs sm:p-6"
                  >
                    <h3 id="page-content-heading" className="text-sm font-bold text-foreground">
                      Konten Halaman
                    </h3>

                    <div>
                      <label htmlFor="pg-title" className={LABEL_CLASS}>
                        Judul Halaman<span className="text-destructive" aria-hidden="true"> *</span>
                      </label>
                      <input
                        id="pg-title"
                        type="text"
                        required
                        value={pageTitle}
                        onChange={(e) => {
                          setPageTitle(e.target.value);
                          if (!editingPageId) {
                            setPageSlug(slugifyText(e.target.value));
                          }
                        }}
                        placeholder="Contoh: Kebijakan Privasi"
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div>
                      <label htmlFor="pg-body" className={LABEL_CLASS}>
                        Isi Halaman (Gunakan ## untuk Subjudul H2)<span className="text-destructive" aria-hidden="true"> *</span>
                      </label>
                      <textarea
                        id="pg-body"
                        rows={14}
                        required
                        value={pageBodyText}
                        onChange={(e) => setPageBodyText(e.target.value)}
                        placeholder={"Paragraf pembuka...\n\n## 1. Pengumpulan Informasi\n\nDetail penjelasan..."}
                        className={INPUT_CLASS + " h-auto leading-relaxed"}
                      />
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Gunakan ## untuk subjudul. Beri satu baris kosong di antara paragraf.
                      </p>
                    </div>
                  </section>

                  <SeoSection
                    idPrefix="page"
                    title={pageSeoTitle}
                    setTitle={setPageSeoTitle}
                    desc={pageSeoDesc}
                    setDesc={setPageSeoDesc}
                  />
                </div>

                <aside
                  aria-labelledby="page-settings-heading"
                  className="h-fit space-y-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs"
                >
                  <h3 id="page-settings-heading" className="text-sm font-bold text-foreground">
                    Pengaturan Alamat &amp; Tanggal
                  </h3>

                  <UrlField
                    id="pg-slug"
                    prefix="nextkarya.web.id/"
                    value={pageSlug}
                    onChange={setPageSlug}
                    placeholder="kebijakan-privasi"
                  />

                  <div>
                    <label htmlFor="pg-updated-label" className={LABEL_CLASS}>
                      Label Tanggal Pembaruan
                    </label>
                    <input
                      id="pg-updated-label"
                      type="text"
                      value={pageUpdatedLabel}
                      onChange={(e) => setPageUpdatedLabel(e.target.value)}
                      placeholder="Diperbarui Oktober 2026"
                      className={INPUT_CLASS}
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Tampil di bagian atas halaman sebagai informasi ke pengunjung situs.
                    </p>
                  </div>
                </aside>
              </div>

              <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-xs backdrop-blur">
                <button type="button" onClick={resetPageForm} className={SECONDARY_BTN_CLASS}>
                  Batal
                </button>
                <button type="submit" disabled={mutating} className={PRIMARY_BTN_CLASS}>
                  {mutating
                    ? "Menyimpan..."
                    : editingPageId
                    ? "Simpan Perubahan Halaman"
                    : "Simpan sebagai Draf"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SUB-TAB 4: REDIRECTS */}
      {subTab === "redirects" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-xl border border-border bg-card text-card-foreground shadow-xs p-5">
            <h2 className="border-b border-border pb-3 text-base font-extrabold text-foreground">
              Tambah Aturan 301/302 Redirect
            </h2>
            <form onSubmit={handleCreateRedirect} className="mt-4 space-y-4">
              <p className="text-[11px] text-muted-foreground">
                Kolom bertanda <span className="text-destructive" aria-hidden="true">*</span> wajib diisi.
              </p>
              <div>
                <label htmlFor="redir-source" className={LABEL_CLASS}>
                  Path Asal (Source Path)<span className="text-destructive" aria-hidden="true"> *</span>
                </label>
                <input
                  id="redir-source"
                  type="text"
                  required
                  value={redirSource}
                  onChange={(e) => setRedirSource(e.target.value)}
                  placeholder="/artikel-lama"
                  className={`${INPUT_CLASS} font-mono`}
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Contoh: /artikel-lama (alamat lama yang ingin dialihkan)
                </p>
              </div>
              <div>
                <label htmlFor="redir-target" className={LABEL_CLASS}>
                  Path Tujuan (Target Path)<span className="text-destructive" aria-hidden="true"> *</span>
                </label>
                <input
                  id="redir-target"
                  type="text"
                  required
                  value={redirTarget}
                  onChange={(e) => setRedirTarget(e.target.value)}
                  placeholder="/blog/tips-memilih-tech-stack-website-2026"
                  className={`${INPUT_CLASS} font-mono`}
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Contoh: /blog/tips-baru (alamat tujuan baru di Next Karya)
                </p>
              </div>
              <div>
                <label htmlFor="redir-code" className={LABEL_CLASS}>
                  Kode Status HTTP
                </label>
                <select
                  id="redir-code"
                  value={redirCode}
                  onChange={(e) =>
                    setRedirCode(Number(e.target.value) as 301 | 302)
                  }
                  className={INPUT_CLASS}
                >
                  <option value={301}>301 (Pengalihan Permanen / Direkomendasikan untuk SEO)</option>
                  <option value={302}>302 (Pengalihan Sementara)</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={mutating}
                className={PRIMARY_BTN_CLASS}
              >
                {mutating ? "Menyimpan..." : "Simpan Pengalihan Alamat"}
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-border bg-card text-card-foreground shadow-xs p-5 space-y-3">
            <h2 className="border-b border-border pb-3 text-base font-extrabold text-foreground">
              Daftar Pengalihan Aktif ({redirects.length})
            </h2>
            {redirects.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                Belum ada aturan redirect kustom yang terdaftar.
              </p>
            ) : (
              redirects.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-muted/30 p-3.5 text-xs"
                >
                  <div className="font-mono">
                    <span className="font-bold text-foreground">
                      {r.sourcePath}
                    </span>{" "}
                    <span className="text-primary font-semibold">({r.statusCode})</span>{" "}
                    → <span className="text-emerald-600 dark:text-emerald-400">{r.targetPath}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteRedirect(r.id)}
                    className={DANGER_BTN_CLASS}
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
          </section>
        </div>
      )}
    </div>
  );
}
