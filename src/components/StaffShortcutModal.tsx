"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, KeyRoundIcon, ShieldCheckIcon, XIcon } from "lucide-react";

const STAFF_QUICK_ACCOUNTS = [
  {
    label: "Login Programmer",
    email: "programmer@nextkarya.web.id",
    role: "Full-Stack Developer",
  },
  {
    label: "Login Desainer",
    email: "designer@nextkarya.web.id",
    role: "UI/UX & Visual Designer",
  },
  {
    label: "Login Project Lead",
    email: "lead@nextkarya.web.id",
    role: "Project Lead & Client Relations",
  },
];

export function StaffShortcutModal() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("programmer@nextkarya.web.id");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrMeta = event.ctrlKey || event.metaKey;
      const isSKey = event.key.toLowerCase() === "s" || event.code === "KeyS";

      if (isCtrlOrMeta && event.shiftKey && isSKey) {
        event.preventDefault();
        event.stopPropagation();

        if (pathname?.startsWith("/cms") || pathname?.startsWith("/admin")) {
          return;
        }

        setErrorMsg(null);
        setIsOpen((prev) => !prev);
        return;
      }

      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [isOpen, pathname]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        emailInputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMsg("Email staf dan kata sandi wajib diisi sebelum melanjutkan.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/cms/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const payload = await res.json();
      if (!res.ok || !payload.success) {
        setErrorMsg(
          payload?.error?.message ||
            "Kredensial tidak valid. Periksa kembali email staf dan kata sandi Anda."
        );
        return;
      }

      setIsOpen(false);
      setPassword("");
      router.push("/cms");
      router.refresh();
    } catch {
      setErrorMsg(
        "Tidak dapat menghubungi server autentikasi. Pastikan server backend aktif di port 5000."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="staff-shortcut-login-title"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          setIsOpen(false);
        }
      }}
    >
      {/* Decorative Geometric Background Shape from admin-template */}
      <div className="pointer-events-none absolute flex items-center justify-center opacity-25">
        <svg
          width="520"
          height="520"
          viewBox="0 0 686 671"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M442.137 102.265C482.171 64.0112 545.636 65.454 583.89 105.488C622.145 145.522 620.702 208.987 580.668 247.242L242.62 570.26C202.586 608.514 139.121 607.071 100.867 567.037C62.6126 527.003 64.0555 463.538 104.09 425.283L442.137 102.265Z"
            fill="#38BDF8"
            fillOpacity="0.14"
          />
          <path
            d="M583.529 105.834C621.592 145.668 620.157 208.817 580.322 246.88L242.275 569.898C202.44 607.962 139.292 606.526 101.228 566.691C63.1649 526.857 64.6005 463.708 104.435 425.645L442.482 102.627C482.317 64.5634 545.465 65.9991 583.529 105.834Z"
            stroke="#38BDF8"
            strokeOpacity="0.35"
            strokeDasharray="8 8"
          />
        </svg>
      </div>

      {/* Admin Template Auth Card */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#2A436E] bg-[#0B1730] p-6 sm:p-7 text-[#F1F5FB] shadow-2xl">
        {/* CardHeader */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/single-logo.png" alt="Next Karya" className="size-9 shrink-0 object-contain" />
            <div>
              <span className="text-lg font-extrabold tracking-tight text-[#F1F5FB]">
                Next Karya Studio
              </span>
              <span className="ml-2 inline-flex items-center gap-1 rounded-md border border-sky-400/40 bg-sky-950/60 px-2 py-0.5 font-mono text-[11px] font-bold text-[#38BDF8]">
                <KeyRoundIcon className="size-3" />
                Ctrl+Shift+S
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={loading}
            aria-label="Tutup modal login"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#2A436E] bg-[#12213F] hover:bg-[#1E3358] text-[#F1F5FB] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8] cursor-pointer"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="mt-5">
          <h2
            id="staff-shortcut-login-title"
            className="text-xl sm:text-2xl font-extrabold text-[#F1F5FB]"
          >
            Masuk ke Next Karya Studio
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#94A7C4]">
            Kelola konten CMS, prospek CRM, analitik trafik, dan toolkit keamanan
            tanpa mengekspos URL login publik.
          </p>
        </div>

        {/* Quick Login Buttons (Admin Template style) */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold text-[#94A7C4]">
            Pilih Cepat Akun Staf Internal:
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {STAFF_QUICK_ACCOUNTS.map((acc) => {
              const isSelected = email === acc.email;
              return (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword("NextKarya2026!");
                    setErrorMsg(null);
                  }}
                  className={`flex min-h-11 flex-col items-start justify-center rounded-lg border px-3 py-2 text-left text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8] cursor-pointer ${
                    isSelected
                      ? "border-[#38BDF8] bg-[#1E3358] text-[#F1F5FB]"
                      : "border-[#2A436E] bg-[#12213F]/80 text-[#94A7C4] hover:border-[#4E6E9E] hover:text-[#F1F5FB]"
                  }`}
                >
                  <span className="font-bold text-[#F1F5FB]">{acc.label}</span>
                  <span className="truncate w-full text-[11px] text-[#94A7C4]">
                    {acc.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {errorMsg && (
          <div
            id="modal-cms-login-error"
            role="alert"
            className="mt-4 rounded-xl border border-rose-500/50 bg-rose-950/70 p-3.5 text-xs leading-relaxed text-[#F87171]"
          >
            <p className="font-bold text-rose-200">Otorisasi Ditolak</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="modal-cms-email"
              className="mb-1.5 block text-xs font-bold text-[#F1F5FB]"
            >
              Alamat Email Staf*
            </label>
            <input
              ref={emailInputRef}
              id="modal-cms-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errorMsg)}
              aria-describedby={errorMsg ? "modal-cms-login-error" : undefined}
              placeholder="programmer@nextkarya.web.id"
              className="min-h-11 w-full rounded-lg border border-[#4E6E9E] bg-[#12213F] px-3.5 py-2.5 text-sm text-[#F1F5FB] placeholder:text-[#94A7C4]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
            />
          </div>

          <div>
            <label
              htmlFor="modal-cms-password"
              className="mb-1.5 block text-xs font-bold text-[#F1F5FB]"
            >
              Kata Sandi*
            </label>
            <div className="relative flex items-center">
              <input
                id="modal-cms-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errorMsg)}
                aria-describedby={errorMsg ? "modal-cms-login-error" : undefined}
                placeholder="Masukkan kata sandi staf"
                className="min-h-11 w-full rounded-lg border border-[#4E6E9E] bg-[#12213F] pl-3.5 pr-12 py-2.5 text-sm text-[#F1F5FB] placeholder:text-[#94A7C4]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                }
                className="absolute right-1 inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-[#94A7C4] hover:text-[#F1F5FB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#38BDF8] cursor-pointer"
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-11 w-full rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 px-4 py-2.5 text-sm font-bold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8] cursor-pointer"
          >
            {loading ? "Memverifikasi Sesi..." : "Masuk ke Next Karya Studio"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between border-t border-[#1E3358] pt-4 text-xs text-[#94A7C4]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheckIcon className="size-4 text-[#34D399]" />
            Dilindungi Middleware Proxy &amp; Cookie HttpOnly
          </span>
          <span className="font-mono text-[11px] text-[#38BDF8]">
            site: nextkarya-main
          </span>
        </div>
      </div>
    </div>
  );
}
