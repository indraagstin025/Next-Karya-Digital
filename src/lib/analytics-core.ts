export const ANALYTICS_SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export interface AnalyticsSession {
  id: string;
  lastActiveAt: number;
}

export type ContentClickEventName = "service_click" | "portfolio_click";

export interface ContentClick {
  eventName: ContentClickEventName;
  targetPath: string;
}

export interface OriginCheckInput {
  origin?: string | null;
  referer?: string | null;
  host?: string | null;
  allowedOrigins?: string[];
}

export function isSessionExpired(
  lastActiveAt: number,
  now: number,
  timeoutMs = ANALYTICS_SESSION_TIMEOUT_MS
): boolean {
  return !Number.isFinite(lastActiveAt) || now - lastActiveAt > timeoutMs;
}

export function resolveAnalyticsSession(
  previous: AnalyticsSession | null,
  now: number,
  generateId: () => string
): AnalyticsSession {
  if (!previous || isSessionExpired(previous.lastActiveAt, now)) {
    return { id: generateId(), lastActiveAt: now };
  }

  return { id: previous.id, lastActiveAt: now };
}

export function detectBrowser(userAgent: string | null | undefined): string {
  const ua = userAgent || "";

  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/SamsungBrowser/.test(ua)) return "Samsung Internet";
  if (/Firefox\/|FxiOS/.test(ua)) return "Firefox";
  if (/CriOS|Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";

  return "Lainnya";
}

export function detectOs(userAgent: string | null | undefined): string {
  const ua = userAgent || "";

  if (/Windows NT/.test(ua)) return "Windows";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Macintosh|Mac OS X/.test(ua)) return "macOS";
  if (/CrOS/.test(ua)) return "ChromeOS";
  if (/Linux/.test(ua)) return "Linux";

  return "Lainnya";
}

/**
 * Classifies internal links to the service or portfolio sections so the
 * dashboard can separate content interest from general pageviews.
 */
export function classifyContentClick(
  href: string | null | undefined,
  baseOrigin: string
): ContentClick | null {
  if (!href) return null;

  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("javascript:")) return null;

  let base: URL;
  let target: URL;
  try {
    base = new URL(baseOrigin);
    target = new URL(trimmed, base);
  } catch {
    return null;
  }

  if (target.origin !== base.origin) return null;

  const path = target.pathname;
  const targetPath = `${path}${target.hash}`;

  if (path === "/layanan" || path.startsWith("/layanan/")) {
    return { eventName: "service_click", targetPath };
  }

  if (path === "/portofolio" || path.startsWith("/portofolio/")) {
    return { eventName: "portfolio_click", targetPath };
  }

  return null;
}

export function isAllowedAnalyticsOrigin(input: OriginCheckInput): boolean {
  const provided = input.origin?.trim() || input.referer?.trim();
  if (!provided) return true;

  let parsed: URL;
  try {
    parsed = new URL(provided);
  } catch {
    return false;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false;
  }

  const allowedHosts = new Set<string>();
  const requestHost = input.host?.trim().toLowerCase();
  if (requestHost) allowedHosts.add(requestHost);

  for (const origin of input.allowedOrigins ?? []) {
    try {
      allowedHosts.add(new URL(origin).host.toLowerCase());
    } catch {
      // Ignore malformed configuration rather than opening the allowlist.
    }
  }

  return allowedHosts.has(parsed.host.toLowerCase());
}
