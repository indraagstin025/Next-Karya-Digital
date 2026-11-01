"use client";

import { useState } from "react";
import type { CmsLeadItem } from "../types";

export function useCrm() {
  const [activeSubView, setActiveSubView] = useState<"leads" | "schedules">("leads");
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [selectedLeadForNotes, setSelectedLeadForNotes] = useState<CmsLeadItem | null>(null);
  const [newScheduleModalOpen, setNewScheduleModalOpen] = useState(false);

  return {
    activeSubView,
    setActiveSubView,
    newLeadModalOpen,
    setNewLeadModalOpen,
    selectedLeadForNotes,
    setSelectedLeadForNotes,
    newScheduleModalOpen,
    setNewScheduleModalOpen,
  };
}
