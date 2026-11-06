"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { sendAnalyticsBeacon } from "@/lib/analytics-beacon";
import { classifyContentClick } from "@/lib/analytics-core";
import { isWorkspacePath } from "@/lib/workspace-paths";

const HEARTBEAT_INTERVAL_MS = 15_000;
const HEARTBEAT_FLUSH_MS = 30_000;
const MIN_DURATION_SEC = 3;

export function AnalyticsTracker() {
  const pathname = usePathname();
  const pathRef = useRef<string>(pathname || "/");
  const activeMsRef = useRef(0);
  const flushRef = useRef<(() => void) | null>(null);

  // Track pageview on route change, tanpa menahan tugas penting saat load.
  useEffect(() => {
    if (!pathname || isWorkspacePath(pathname)) return;

    pathRef.current = pathname;

    const sendPageview = () => {
      sendAnalyticsBeacon({
        eventName: "pageview",
        path: pathname,
      });
    };

    const handle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(sendPageview, { timeout: 5000 })
        : window.setTimeout(sendPageview, 5000);

    return () => {
      // Flush the previous page's active time before the path changes.
      flushRef.current?.();

      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle);
      }
    };
  }, [pathname]);

  // Count only visible-tab time, flush in chunks, and capture content clicks.
  useEffect(() => {
    if (typeof window === "undefined") return;

    let wasVisible = document.visibilityState === "visible";
    let lastTick = Date.now();

    const flush = () => {
      const path = pathRef.current;
      const durationSec = Math.round(activeMsRef.current / 1000);
      activeMsRef.current = 0;

      if (isWorkspacePath(path) || durationSec < MIN_DURATION_SEC) return;

      sendAnalyticsBeacon({
        eventName: "heartbeat",
        path,
        durationSec,
      });
    };

    const tick = () => {
      const now = Date.now();
      const visible = document.visibilityState === "visible";
      const elapsed = now - lastTick;

      if (wasVisible && elapsed > 0 && elapsed <= 60_000) {
        activeMsRef.current += elapsed;
      }

      wasVisible = visible;
      lastTick = now;

      if (activeMsRef.current >= HEARTBEAT_FLUSH_MS) {
        flush();
      }
    };

    flushRef.current = () => {
      tick();
      flush();
    };

    const interval = window.setInterval(tick, HEARTBEAT_INTERVAL_MS);

    function handleVisibilityChange() {
      tick();
      if (document.visibilityState === "hidden") {
        flush();
      }
    }

    function handlePageHide() {
      flushRef.current?.();
    }

    function handleLinkClick(e: MouseEvent) {
      const link = (e.target as HTMLElement)?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const contentClick = classifyContentClick(href, window.location.origin);

      if (contentClick) {
        sendAnalyticsBeacon({
          eventName: contentClick.eventName,
          path: window.location.pathname,
          targetPath: contentClick.targetPath,
        });
      }

      const isWhatsApp =
        href.includes("wa.me") ||
        href.includes("whatsapp.com") ||
        link.hasAttribute("data-analytics-wa");

      if (isWhatsApp) {
        sendAnalyticsBeacon({
          eventName: "whatsapp_click",
          path: window.location.pathname,
        });
      }
    }

    document.addEventListener("click", handleLinkClick, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      flushRef.current?.();
      flushRef.current = null;
      window.clearInterval(interval);
      document.removeEventListener("click", handleLinkClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return null;
}

export default AnalyticsTracker;
