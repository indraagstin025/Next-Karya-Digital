"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { submitContactMessage } from "../actions";
import {
  contactMessageSchema,
  extractContactFieldErrors,
  type ContactFieldErrors,
} from "../schema";

export interface ContactFormData {
  name: string;
  email: string;
  service: string;
  message: string;
  websiteUrl: string;
}

export interface ContactFormStatus {
  type: "idle" | "sending" | "success" | "error";
  message: string;
}

const INITIAL_STATE: ContactFormData = {
  name: "",
  email: "",
  service: "website",
  message: "",
  websiteUrl: "",
};

const CLIENT_TIMEOUT_MS = 15_000;

function subscribeOnline(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

const getOnlineSnapshot = () => navigator.onLine;
const getServerOnlineSnapshot = () => true;

class ClientSubmitAbort extends Error {
  constructor(readonly reason: "offline" | "timeout") {
    super(reason);
  }
}

// Races the server action against a timer and the browser going offline, so a
// dropped connection ends in a clear message instead of an endless spinner.
function raceNetwork<T>(operation: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let onOffline: (() => void) | undefined;

  const guard = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new ClientSubmitAbort("timeout")), CLIENT_TIMEOUT_MS);
    onOffline = () => reject(new ClientSubmitAbort("offline"));
    window.addEventListener("offline", onOffline);
  });

  return Promise.race([operation, guard]).finally(() => {
    if (timer) clearTimeout(timer);
    if (onOffline) window.removeEventListener("offline", onOffline);
  });
}

export function useContactForm(sourcePage: string = "/kontak") {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [formStatus, setFormStatus] = useState<ContactFormStatus>({
    type: "idle",
    message: "",
  });
  const inFlightRef = useRef(false);
  const isOnline = useSyncExternalStore(
    subscribeOnline,
    getOnlineSnapshot,
    getServerOnlineSnapshot
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name in fieldErrors) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const resetForm = () => setFormData(INITIAL_STATE);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (inFlightRef.current) return;

      const parsed = contactMessageSchema.safeParse(formData);
      if (!parsed.success) {
        setFieldErrors(extractContactFieldErrors(parsed.error.issues));
        setFormStatus({
          type: "error",
          message: "Periksa kembali isian formulir yang ditandai.",
        });
        return;
      }

      if (!navigator.onLine) {
        setFormStatus({
          type: "error",
          message:
            "Perangkat sedang tidak terhubung ke internet. Isian Anda tetap tersimpan, kirim ulang setelah koneksi pulih.",
        });
        return;
      }

      inFlightRef.current = true;
      setFieldErrors({});
      setFormStatus({ type: "sending", message: "Sedang mengirim pesan..." });

      try {
        const result = await raceNetwork(
          submitContactMessage({ ...formData, sourcePage })
        );

        if (result.success) {
          setFormStatus({ type: "success", message: result.message });
          resetForm();
        } else {
          setFieldErrors(result.fieldErrors ?? {});
          setFormStatus({ type: "error", message: result.message });
        }
      } catch (error) {
        let message =
          "Terjadi kendala jaringan saat menghubungi server. Isian Anda tetap tersimpan, silakan coba lagi.";
        if (error instanceof ClientSubmitAbort && error.reason === "offline") {
          message =
            "Koneksi internet terputus saat mengirim. Pesan mungkin belum terkirim, kirim ulang setelah koneksi pulih.";
        } else if (error instanceof ClientSubmitAbort && error.reason === "timeout") {
          message =
            "Server tidak merespons dalam 15 detik. Isian Anda tetap tersimpan, silakan coba lagi.";
        }
        setFormStatus({ type: "error", message });
      } finally {
        inFlightRef.current = false;
      }
    },
    [formData, sourcePage]
  );

  return {
    formData,
    fieldErrors,
    formStatus,
    isOnline,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
