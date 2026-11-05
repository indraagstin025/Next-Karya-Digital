"use client";

import dynamic from "next/dynamic";
import React from "react";
import type { CmsStaffUser } from "@/lib/cms-server";

const AdminWorkspace = dynamic(
  () => import("./AdminWorkspace").then((mod) => mod.AdminWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Memuat studio...</p>
      </div>
    ),
  }
);

export function WorkspaceShellLoader({
  currentUser,
  children,
}: {
  currentUser: CmsStaffUser;
  children: React.ReactNode;
}) {
  return <AdminWorkspace currentUser={currentUser}>{children}</AdminWorkspace>;
}
