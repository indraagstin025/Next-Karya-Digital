"use client";

import dynamic from "next/dynamic";
import React from "react";

const CmsShell = dynamic(
  () => import("./CmsShell").then((mod) => mod.CmsShell),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Memuat studio...</p>
      </div>
    ),
  }
);

export function CmsShellLoader({
  children,
  isAdmin = false,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
}) {
  return <CmsShell isAdmin={isAdmin}>{children}</CmsShell>;
}
