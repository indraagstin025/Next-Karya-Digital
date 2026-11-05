"use client";

import React, { useState } from "react";
import {
  KeyRoundIcon,
  PencilIcon,
  PlusIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  UserXIcon,
} from "lucide-react";
import type { CmsStaffMember } from "../types";
import { useWorkspace } from "../WorkspaceContext";
import {
  DANGER_BTN_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BTN_CLASS,
  SECONDARY_BTN_CLASS,
} from "../constants";

const MIN_PASSWORD_LENGTH = 12;

interface CreateFormState {
  fullName: string;
  email: string;
  jobTitle: string;
  password: string;
}

const EMPTY_CREATE_FORM: CreateFormState = {
  fullName: "",
  email: "",
  jobTitle: "",
  password: "",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function TeamModule() {
  const {
    currentUser,
    data,
    mutation,
    refreshWorkspaceSilently,
  } = useWorkspace();

  const [createForm, setCreateForm] = useState<CreateFormState>(EMPTY_CREATE_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ fullName: "", jobTitle: "" });
  const [resetTargetId, setResetTargetId] = useState<string | null>(null);
  const [resetForm, setResetForm] = useState({ password: "", confirm: "" });

  const isAdmin = Boolean(currentUser.isAdmin);
  const { apiMutate, setBannerNotice, mutating } = mutation;

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Anggota Tim
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Pengelolaan akun staf dan kata sandi.
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-700 dark:text-amber-300">
          <ShieldAlertIcon className="mt-0.5 size-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-bold">Bagian ini khusus admin.</p>
            <p className="text-xs leading-relaxed">
              Hubungi akun admin untuk menambah anggota, mengubah status akun, atau
              mengatur ulang kata sandi. Kata sandi staf dikelola terpusat oleh admin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();

    if (
      !createForm.fullName.trim() ||
      !createForm.email.trim() ||
      !createForm.jobTitle.trim()
    ) {
      setBannerNotice({
        type: "error",
        text: "Nama lengkap, email, dan jabatan wajib diisi.",
      });
      return;
    }

    if (createForm.password.length < MIN_PASSWORD_LENGTH) {
      setBannerNotice({
        type: "error",
        text: `Kata sandi awal minimal ${MIN_PASSWORD_LENGTH} karakter.`,
      });
      return;
    }

    const result = await apiMutate("users", "POST", {
      fullName: createForm.fullName.trim(),
      email: createForm.email.trim(),
      jobTitle: createForm.jobTitle.trim(),
      password: createForm.password,
    });

    if (result) {
      setBannerNotice({
        type: "success",
        text:
          result.message ||
          "Akun staf berhasil dibuat. Sampaikan kata sandinya secara langsung.",
      });
      setCreateForm(EMPTY_CREATE_FORM);
      await refreshWorkspaceSilently();
    }
  }

  function startEditing(member: CmsStaffMember) {
    setResetTargetId(null);
    setEditingId(member.id);
    setEditForm({ fullName: member.fullName, jobTitle: member.jobTitle });
  }

  async function handleSaveEdit(member: CmsStaffMember) {
    if (!editForm.fullName.trim() || !editForm.jobTitle.trim()) {
      setBannerNotice({
        type: "error",
        text: "Nama lengkap dan jabatan tidak boleh kosong.",
      });
      return;
    }

    const result = await apiMutate(`users/${member.id}`, "PATCH", {
      fullName: editForm.fullName.trim(),
      jobTitle: editForm.jobTitle.trim(),
    });

    if (result) {
      setBannerNotice({
        type: "success",
        text: result.message || `Data ${member.fullName} berhasil diperbarui.`,
      });
      setEditingId(null);
      await refreshWorkspaceSilently();
    }
  }

  async function handleToggleActive(member: CmsStaffMember) {
    const nextActive = member.isActive === false;

    if (
      !nextActive &&
      !window.confirm(
        `Nonaktifkan akun ${member.fullName}? Yang bersangkutan tidak bisa masuk sampai diaktifkan kembali.`
      )
    ) {
      return;
    }

    const result = await apiMutate(`users/${member.id}`, "PATCH", {
      isActive: nextActive,
    });

    if (result) {
      setBannerNotice({
        type: "success",
        text:
          result.message ||
          `Akun ${member.fullName} berhasil ${
            nextActive ? "diaktifkan" : "dinonaktifkan"
          }.`,
      });
      await refreshWorkspaceSilently();
    }
  }

  async function handleResetPassword(member: CmsStaffMember) {
    if (resetForm.password.length < MIN_PASSWORD_LENGTH) {
      setBannerNotice({
        type: "error",
        text: `Kata sandi baru minimal ${MIN_PASSWORD_LENGTH} karakter.`,
      });
      return;
    }

    if (resetForm.password !== resetForm.confirm) {
      setBannerNotice({
        type: "error",
        text: "Ulangi kata sandi baru dengan isian yang sama.",
      });
      return;
    }

    const result = await apiMutate(`users/${member.id}/reset-password`, "POST", {
      password: resetForm.password,
    });

    if (result) {
      setBannerNotice({
        type: "success",
        text: result.message || `Kata sandi ${member.fullName} berhasil diatur ulang.`,
      });
      setResetTargetId(null);
      setResetForm({ password: "", confirm: "" });
      await refreshWorkspaceSilently();
    }
  }

  async function handleRevokeSessions(member: CmsStaffMember) {
    if (
      !window.confirm(
        `Keluarkan ${member.fullName} dari semua perangkat? Yang bersangkutan harus masuk ulang.`
      )
    ) {
      return;
    }

    const result = await apiMutate(`users/${member.id}/revoke-sessions`, "POST", {
      reason: "Rotasi sesi oleh admin melalui halaman Anggota Tim",
    });

    if (result) {
      setBannerNotice({
        type: "success",
        text: result.message || `Sesi ${member.fullName} berhasil dikeluarkan.`,
      });
      await refreshWorkspaceSilently();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          Anggota Tim
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Tambah akun staf, atur status akses, dan rotasi kata sandi. Hanya akun
          admin yang bisa membuka halaman ini.
        </p>
      </div>

      <section
        aria-labelledby="team-create-heading"
        className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2">
          <PlusIcon className="size-5 text-primary" />
          <h2 id="team-create-heading" className="text-base font-extrabold text-foreground">
            Tambah Anggota
          </h2>
        </div>

        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="team-new-name" className={LABEL_CLASS}>
              Nama lengkap
            </label>
            <input
              id="team-new-name"
              type="text"
              value={createForm.fullName}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, fullName: event.target.value }))
              }
              placeholder="Contoh: Staf D (Marketing)"
              className={INPUT_CLASS}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="team-new-email" className={LABEL_CLASS}>
              Email
            </label>
            <input
              id="team-new-email"
              type="email"
              value={createForm.email}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="nama@nextkarya.web.id"
              className={INPUT_CLASS}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="team-new-job" className={LABEL_CLASS}>
              Jabatan
            </label>
            <input
              id="team-new-job"
              type="text"
              value={createForm.jobTitle}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, jobTitle: event.target.value }))
              }
              placeholder="Contoh: Social Media Specialist"
              className={INPUT_CLASS}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="team-new-password" className={LABEL_CLASS}>
              Kata sandi awal
            </label>
            <input
              id="team-new-password"
              type="password"
              value={createForm.password}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder={`Minimal ${MIN_PASSWORD_LENGTH} karakter`}
              className={INPUT_CLASS}
              autoComplete="new-password"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Sampaikan kata sandi awal secara langsung. Kata sandi hanya bisa diatur
              ulang oleh admin.
            </p>
            <button
              type="submit"
              disabled={mutating}
              className={`${PRIMARY_BTN_CLASS} shrink-0`}
            >
              <PlusIcon className="mr-1.5 size-4" />
              Buat Akun
            </button>
          </div>
        </form>
      </section>

      <section aria-labelledby="team-list-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 id="team-list-heading" className="text-base font-extrabold text-foreground">
            Daftar Anggota
          </h2>
          <span className="text-xs text-muted-foreground">
            {data.staffUsers.length} akun
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {data.staffUsers.map((member) => {
            const isSelf = member.id === currentUser.id;
            const isActive = member.isActive !== false;
            const isEditing = editingId === member.id;
            const isResetting = resetTargetId === member.id;

            return (
              <article
                key={member.id}
                className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {initials(member.fullName)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-bold text-foreground">
                        {member.fullName}
                      </h3>
                      {member.isAdmin && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-700 dark:text-sky-300">
                          <ShieldCheckIcon className="size-3" />
                          ADMIN
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                        }`}
                      >
                        {isActive ? "AKTIF" : "NONAKTIF"}
                      </span>
                      {isSelf && (
                        <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          ANDA
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {member.email}
                    </p>
                    <p className="mt-1 text-xs font-medium text-foreground">
                      {member.jobTitle || "Internal Staff"}
                    </p>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                    <div>
                      <label
                        htmlFor={`team-edit-name-${member.id}`}
                        className={LABEL_CLASS}
                      >
                        Nama lengkap
                      </label>
                      <input
                        id={`team-edit-name-${member.id}`}
                        type="text"
                        value={editForm.fullName}
                        onChange={(event) =>
                          setEditForm((prev) => ({
                            ...prev,
                            fullName: event.target.value,
                          }))
                        }
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`team-edit-job-${member.id}`}
                        className={LABEL_CLASS}
                      >
                        Jabatan
                      </label>
                      <input
                        id={`team-edit-job-${member.id}`}
                        type="text"
                        value={editForm.jobTitle}
                        onChange={(event) =>
                          setEditForm((prev) => ({
                            ...prev,
                            jobTitle: event.target.value,
                          }))
                        }
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(member)}
                        disabled={mutating}
                        className={PRIMARY_BTN_CLASS}
                      >
                        Simpan Perubahan
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className={SECONDARY_BTN_CLASS}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : null}

                {isResetting ? (
                  <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                    <div>
                      <label
                        htmlFor={`team-reset-password-${member.id}`}
                        className={LABEL_CLASS}
                      >
                        Kata sandi baru
                      </label>
                      <input
                        id={`team-reset-password-${member.id}`}
                        type="password"
                        value={resetForm.password}
                        onChange={(event) =>
                          setResetForm((prev) => ({
                            ...prev,
                            password: event.target.value,
                          }))
                        }
                        placeholder={`Minimal ${MIN_PASSWORD_LENGTH} karakter`}
                        className={INPUT_CLASS}
                        autoComplete="new-password"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`team-reset-confirm-${member.id}`}
                        className={LABEL_CLASS}
                      >
                        Ulangi kata sandi baru
                      </label>
                      <input
                        id={`team-reset-confirm-${member.id}`}
                        type="password"
                        value={resetForm.confirm}
                        onChange={(event) =>
                          setResetForm((prev) => ({
                            ...prev,
                            confirm: event.target.value,
                          }))
                        }
                        placeholder="Ketik ulang kata sandi baru"
                        className={INPUT_CLASS}
                        autoComplete="new-password"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Semua sesi lama akun ini akan langsung berakhir setelah kata
                      sandi diubah.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleResetPassword(member)}
                        disabled={mutating}
                        className={PRIMARY_BTN_CLASS}
                      >
                        Simpan Kata Sandi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setResetTargetId(null);
                          setResetForm({ password: "", confirm: "" });
                        }}
                        className={SECONDARY_BTN_CLASS}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => startEditing(member)}
                    className={SECONDARY_BTN_CLASS}
                  >
                    <PencilIcon className="mr-1.5 size-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setResetTargetId(isResetting ? null : member.id);
                      setResetForm({ password: "", confirm: "" });
                    }}
                    disabled={isSelf}
                    title={
                      isSelf
                        ? "Ganti kata sandi sendiri lewat halaman Profil Saya."
                        : undefined
                    }
                    className={SECONDARY_BTN_CLASS}
                  >
                    <KeyRoundIcon className="mr-1.5 size-3.5" />
                    {isResetting ? "Tutup Kata Sandi" : "Atur Kata Sandi"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(member)}
                    disabled={mutating || isSelf}
                    title={
                      isSelf
                        ? "Anda tidak bisa menonaktifkan akun yang sedang dipakai."
                        : undefined
                    }
                    className={SECONDARY_BTN_CLASS}
                  >
                    {isActive ? (
                      <UserXIcon className="mr-1.5 size-3.5" />
                    ) : (
                      <UserCheckIcon className="mr-1.5 size-3.5" />
                    )}
                    {isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRevokeSessions(member)}
                    disabled={mutating}
                    className={`${DANGER_BTN_CLASS} sm:ml-auto`}
                  >
                    Keluarkan Sesi
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {data.staffUsers.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Belum ada akun staf yang bisa ditampilkan.
          </p>
        )}
      </section>
    </div>
  );
}
