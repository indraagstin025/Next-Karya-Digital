"use client";

import { createContext, useContext } from "react";
import type { CmsStaffUser } from "@/lib/cms-server";
import type { useCmsData } from "./hooks/useCmsData";
import type { useCmsMutation } from "./hooks/useCmsMutation";

export type SnapshotEntityType = "POST" | "PORTFOLIO" | "SERVICE" | "PAGE";

export interface WorkspaceContextValue {
  currentUser: CmsStaffUser;
  data: ReturnType<typeof useCmsData>;
  mutation: ReturnType<typeof useCmsMutation>;
  refreshWorkspaceSilently: () => Promise<void>;
  openSnapshotModal: (
    entityType: SnapshotEntityType,
    entityId: string,
    title: string
  ) => Promise<void>;
  handleLogout: () => Promise<void>;
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspace harus dipakai di dalam AdminWorkspace.");
  }

  return context;
}
