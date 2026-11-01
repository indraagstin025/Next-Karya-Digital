"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface ConflictState {
  message: string;
  currentData?: any;
}

export interface BannerNoticeState {
  type: "success" | "error" | "info";
  text: string;
}

export function useCmsMutation() {
  const router = useRouter();
  const [mutating, setMutating] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<BannerNoticeState | null>(null);
  const [conflictModal, setConflictModal] = useState<ConflictState | null>(null);

  async function apiMutate(
    endpoint: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: any,
    updatedAtHeader?: string
  ) {
    setMutating(true);
    setBannerNotice(null);

    try {
      const headers: Record<string, string> = {};

      if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      if (updatedAtHeader) {
        headers["x-updated-at"] = updatedAtHeader;
        headers["If-Unmodified-Since"] = updatedAtHeader;
      }

      const res = await fetch(`/api/cms/${endpoint.replace(/^\/+/, "")}`, {
        method,
        headers,
        body:
          body instanceof FormData
            ? body
            : body !== undefined
            ? JSON.stringify(body)
            : JSON.stringify({}),
      });

      const payload = await res.json();

      if (res.status === 401) {
        router.push("/");
        return null;
      }

      if (res.status === 409 && payload?.error?.code === "CONCURRENT_MODIFICATION_CONFLICT") {
        setConflictModal({
          message:
            payload.error.message ||
            "Data ini baru saja diperbarui oleh staf lain. Silakan muat ulang sebelum menyimpan kembali.",
          currentData: payload.error.currentData || null,
        });
        return null;
      }

      if (!res.ok || !payload.success) {
        const detailMsg = payload?.error?.details?.[0]?.message;
        setBannerNotice({
          type: "error",
          text: detailMsg
            ? `${payload?.error?.message || "Validasi gagal"} (${detailMsg})`
            : payload?.error?.message || "Perubahan gagal disimpan. Silakan periksa kembali.",
        });
        return null;
      }

      return payload.data;
    } catch {
      setBannerNotice({
        type: "error",
        text: "Terjadi gangguan jaringan saat menghubungi server. Silakan coba kembali.",
      });
      return null;
    } finally {
      setMutating(false);
    }
  }

  function clearNotice() {
    setBannerNotice(null);
  }

  function clearConflict() {
    setConflictModal(null);
  }

  return {
    mutating,
    bannerNotice,
    setBannerNotice,
    clearNotice,
    conflictModal,
    clearConflict,
    apiMutate,
  };
}
