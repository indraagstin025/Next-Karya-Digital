"use client";

import React, { useEffect, useRef, useState } from "react";
import { KeyRoundIcon } from "lucide-react";
import { useWorkspace } from "../WorkspaceContext";
import { INPUT_CLASS, LABEL_CLASS, PRIMARY_BTN_CLASS } from "../constants";

const MIN_PASSWORD_LENGTH = 12;

export function PasswordCard() {
  const { mutation, handleLogout } = useWorkspace();
  const { apiMutate, setBannerNotice, mutating } = mutation;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const redirectTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimer.current !== null) {
        window.clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!currentPassword) {
      setBannerNotice({
        type: "error",
        text: "Masukkan kata sandi saat ini terlebih dahulu.",
      });
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setBannerNotice({
        type: "error",
        text: `Kata sandi baru minimal ${MIN_PASSWORD_LENGTH} karakter.`,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setBannerNotice({
        type: "error",
        text: "Ulangi kata sandi baru dengan isian yang sama.",
      });
      return;
    }

    if (newPassword === currentPassword) {
      setBannerNotice({
        type: "error",
        text: "Kata sandi baru harus berbeda dari kata sandi saat ini.",
      });
      return;
    }

    const result = await apiMutate("auth/change-password", "POST", {
      currentPassword,
      newPassword,
    });

    if (result) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage(
        "Kata sandi berhasil diubah. Sesi ini akan berakhir dan Anda diarahkan untuk masuk kembali."
      );

      redirectTimer.current = window.setTimeout(() => {
        void handleLogout();
      }, 2400);
    }
  }

  return (
    <section
      aria-labelledby="profile-password-heading"
      className="md:col-span-2 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xs space-y-4"
    >
      <div className="flex items-center gap-2">
        <KeyRoundIcon className="size-5 text-primary" />
        <h2 id="profile-password-heading" className="text-base font-bold text-foreground">
          Kata Sandi Saya
        </h2>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Gunakan kata sandi yang panjang dan tidak dipakai di layanan lain. Setelah
        disimpan, semua sesi lama berakhir dan Anda perlu masuk kembali.
      </p>

      {successMessage ? (
        <p
          role="status"
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
        >
          {successMessage}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="profile-current-password" className={LABEL_CLASS}>
              Kata sandi saat ini
            </label>
            <input
              id="profile-current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className={INPUT_CLASS}
              autoComplete="current-password"
            />
          </div>

          <div>
            <label htmlFor="profile-new-password" className={LABEL_CLASS}>
              Kata sandi baru
            </label>
            <input
              id="profile-new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder={`Minimal ${MIN_PASSWORD_LENGTH} karakter`}
              className={INPUT_CLASS}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="profile-confirm-password" className={LABEL_CLASS}>
              Ulangi kata sandi baru
            </label>
            <input
              id="profile-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Ketik ulang kata sandi baru"
              className={INPUT_CLASS}
              autoComplete="new-password"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={mutating}
              className={PRIMARY_BTN_CLASS}
            >
              Simpan Kata Sandi
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
