"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isWorkspacePath } from "@/lib/workspace-paths";

export function StaffShortcutLauncher() {
  const pathname = usePathname();
  const [Modal, setModal] = useState<React.ComponentType<{
    defaultOpen?: boolean;
  }> | null>(null);

  useEffect(() => {
    if (Modal) return;
    if (isWorkspacePath(pathname)) return;

    let loading: Promise<void> | null = null;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrMeta = event.ctrlKey || event.metaKey;
      const isSKey = event.key.toLowerCase() === "s" || event.code === "KeyS";
      if (!(isCtrlOrMeta && event.shiftKey && isSKey)) return;

      event.preventDefault();
      event.stopPropagation();

      if (!loading) {
        loading = import("@/components/StaffShortcutModal").then((mod) => {
          setModal(() => mod.StaffShortcutModal);
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [pathname, Modal]);

  if (!Modal) return null;
  return <Modal defaultOpen />;
}
