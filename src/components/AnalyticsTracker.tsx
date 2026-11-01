"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { sendAnalyticsBeacon } from "@/lib/analytics-beacon";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());

  // Track pageview on route change
  useEffect(() => {
    if (!pathname || pathname.startsWith("/cms")) return;

    startTimeRef.current = Date.now();
    sendAnalyticsBeacon({
      eventName: "pageview",
      path: pathname,
    });
  }, [pathname]);

  // Track WhatsApp clicks and time spent on page
  useEffect(() => {
    if (typeof window === "undefined") return;

    function handleLinkClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href") || "";
      const isWhatsApp =
        href.includes("wa.me") ||
        href.includes("whatsapp.com") ||
        target.hasAttribute("data-analytics-wa");

      if (isWhatsApp) {
        sendAnalyticsBeacon({
          eventName: "whatsapp_click",
          path: window.location.pathname,
        });
      }
    }

    function handleBeforeUnload() {
      if (window.location.pathname.startsWith("/cms")) return;

      const durationSec = Math.max(
        0,
        Math.min(86400, Math.round((Date.now() - startTimeRef.current) / 1000))
      );

      if (durationSec >= 3) {
        sendAnalyticsBeacon({
          eventName: "heartbeat",
          path: window.location.pathname,
          durationSec,
        });
      }
    }

    document.addEventListener("click", handleLinkClick, { passive: true });
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("click", handleLinkClick);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
}

export default AnalyticsTracker;
