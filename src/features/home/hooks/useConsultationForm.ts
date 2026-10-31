"use client";

import { useContactForm } from "@/features/contact/hooks/useContactForm";

export function useConsultationForm() {
  return useContactForm("/");
}
