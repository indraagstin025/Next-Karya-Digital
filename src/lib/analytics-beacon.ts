"use client";

import {
  detectBrowser,
  detectOs,
  resolveAnalyticsSession,
  type AnalyticsSession,
} from "./analytics-core";
import { isWorkspacePath } from "./workspace-paths";

const SESSION_KEY = "nk_analytics_sid";
let memorySession: AnalyticsSession | null = null;

function generateSessionId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "nk_";
  for (let i = 0; i < 24; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function readStoredSession(): AnalyticsSession | null {
  if (typeof window === "undefined") return memorySession;

  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return memorySession;

    try {
      const parsed = JSON.parse(raw) as Partial<AnalyticsSession>;
      if (
        typeof parsed.id === "string" &&
        parsed.id.length >= 10 &&
        parsed.id.length <= 64 &&
        typeof parsed.lastActiveAt === "number"
      ) {
        return { id: parsed.id, lastActiveAt: parsed.lastActiveAt };
      }
      return memorySession;
    } catch {
      // Legacy storage held only the session ID; rotate it once.
      if (raw.length >= 10 && raw.length <= 64) {
        return { id: raw, lastActiveAt: 0 };
      }
      return memorySession;
    }
  } catch {
    return memorySession;
  }
}

function writeStoredSession(session: AnalyticsSession): void {
  memorySession = session;

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Storage can be blocked in private webviews; memory keeps the session stable.
  }
}

export function getOrCreateSessionId(now = Date.now()): string {
  if (typeof window === "undefined") return "server_session_placeholder";

  const next = resolveAnalyticsSession(
    readStoredSession(),
    now,
    generateSessionId
  );
  writeStoredSession(next);

  return next.id;
}

export function detectDevice(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function detectTrafficSource(): string {
  if (typeof document === "undefined" || !document.referrer) return "direct";

  const ref = document.referrer.toLowerCase();
  if (ref.includes("google.") || ref.includes("bing.") || ref.includes("yahoo.")) {
    return "google";
  }
  if (
    ref.includes("instagram.") ||
    ref.includes("tiktok.") ||
    ref.includes("facebook.") ||
    ref.includes("linkedin.") ||
    ref.includes("twitter.") ||
    ref.includes("x.com")
  ) {
    return "instagram";
  }
  if (ref.includes("nextkarya.web.id") || ref.includes("localhost")) {
    return "direct";
  }
  return "referral";
}

export interface AnalyticsBeaconPayload {
  site_id?: string;
  eventName:
    | "pageview"
    | "whatsapp_click"
    | "form_submit"
    | "heartbeat"
    | "service_click"
    | "portfolio_click";
  path?: string;
  targetPath?: string | null;
  referrer?: string | null;
  durationSec?: number;
}

export function sendAnalyticsBeacon(payload: AnalyticsBeaconPayload): boolean {
  if (typeof window === "undefined") return false;

  const path = payload.path || window.location.pathname;
  if (isWorkspacePath(path)) return false; // Ignore internal staff workspace

  const userAgent =
    typeof navigator !== "undefined" ? navigator.userAgent : "";

  const body = JSON.stringify({
    site_id: payload.site_id || "nextkarya-main",
    sessionId: getOrCreateSessionId(),
    eventName: payload.eventName,
    path: path.startsWith("/") ? path : `/${path}`,
    targetPath: payload.targetPath ?? null,
    referrer: payload.referrer !== undefined ? payload.referrer : document.referrer || null,
    source: detectTrafficSource(),
    device: detectDevice(),
    browser: detectBrowser(userAgent),
    os: detectOs(userAgent),
    durationSec: payload.durationSec || 0,
  });

  const targetUrl = "/api/analytics/event";

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    try {
      const blob = new Blob([body], { type: "application/json" });
      const sent = navigator.sendBeacon(targetUrl, blob);
      if (sent) return true;
    } catch {
      // Fallback to fetch
    }
  }

  // Fallback to asynchronous keepalive fetch
  try {
    fetch(targetUrl, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}
