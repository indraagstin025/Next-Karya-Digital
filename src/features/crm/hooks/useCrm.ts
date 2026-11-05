"use client";

import { useState } from "react";
import type { CmsLeadItem } from "../types";

export function useCrm() {
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [selectedLeadForNotes, setSelectedLeadForNotes] = useState<CmsLeadItem | null>(null);
  const [newScheduleModalOpen, setNewScheduleModalOpen] = useState(false);

  return {
    newLeadModalOpen,
    setNewLeadModalOpen,
    selectedLeadForNotes,
    setSelectedLeadForNotes,
    newScheduleModalOpen,
    setNewScheduleModalOpen,
  };
}
