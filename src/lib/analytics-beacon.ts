"use client";

const SESSION_KEY = "nk_analytics_sid";

function generateSessionId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "nk_";
  for (let i = 0; i < 24; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server_session_placeholder";

  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing && existing.length >= 10 && existing.length <= 64) {
      return existing;
    }
    const newId = generateSessionId();
    window.sessionStorage.setItem(SESSION_KEY, newId);
    return newId;
  } catch {
    return generateSessionId();
  }
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
  eventName: "pageview" | "whatsapp_click" | "form_submit" | "heartbeat";
  path?: string;
  referrer?: string | null;
  durationSec?: number;
}

export function sendAnalyticsBeacon(payload: AnalyticsBeaconPayload): boolean {
  if (typeof window === "undefined") return false;

  const path = payload.path || window.location.pathname;
  if (path.startsWith("/cms")) return false; // Ignore internal staff workspace

  const body = JSON.stringify({
    site_id: payload.site_id || "nextkarya-main",
    sessionId: getOrCreateSessionId(),
    eventName: payload.eventName,
    path: path.startsWith("/") ? path : `/${path}`,
    referrer: payload.referrer !== undefined ? payload.referrer : document.referrer || null,
    source: detectTrafficSource(),
    device: detectDevice(),
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
