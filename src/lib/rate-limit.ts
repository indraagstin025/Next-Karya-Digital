import "server-only";
import { createHmac, hkdfSync } from "node:crypto";
import { headers } from "next/headers";
import { getValidatedAuthSecret } from "@/lib/session-crypto";

const HKDF_SALT = "naykon-auth-hkdf-salt-v1";
const HKDF_IP_INFO = "naykon:ratelimit:ip-hmac:v1";

interface MemoryLimitEntry {
  count: number;
  expiresAt: number;
}

const memoryRateLimitStore = new Map<string, MemoryLimitEntry>();

function deriveIpHmacKey(): Buffer {
  const secret = getValidatedAuthSecret();
  return Buffer.from(hkdfSync("sha256", secret, HKDF_SALT, HKDF_IP_INFO, 32));
}

export function sanitizeClientIp(rawCandidate: string | null | undefined): string {
  if (!rawCandidate) return "unknown";
  const firstHop = rawCandidate.split(",")[0]?.trim() ?? "";
  if (!firstHop || firstHop.length > 64) return "unknown";

  let cleaned = firstHop;
  if (cleaned.startsWith("[") && cleaned.includes("]")) {
    cleaned = cleaned.slice(1, cleaned.indexOf("]"));
  } else if (/^\d{1,3}(?:\.\d{1,3}){3}:\d{1,5}$/.test(cleaned)) {
    cleaned = cleaned.slice(0, cleaned.lastIndexOf(":"));
  }

  if (!/^[0-9a-fA-F:.]+$/.test(cleaned)) {
    return "unknown";
  }

  return cleaned.toLowerCase();
}

export function hashIpAddress(rawIp: string): string {
  const normalizedIp = sanitizeClientIp(rawIp);
  const key = deriveIpHmacKey();
  return createHmac("sha256", key).update(normalizedIp).digest("hex").slice(0, 32);
}

export async function getRequestIpHash(): Promise<string> {
  const requestHeaders = await headers();
  const candidate =
    requestHeaders.get("x-vercel-forwarded-for") ||
    requestHeaders.get("cf-connecting-ip") ||
    requestHeaders.get("x-real-ip") ||
    requestHeaders.get("x-forwarded-for") ||
    "unknown";

  return hashIpAddress(candidate);
}

export async function isRateLimited(
  key: string,
  maxAttempts: number
): Promise<{ limited: boolean; retryAfterSeconds: number }> {
  const now = Date.now();
  const entry = memoryRateLimitStore.get(key);

  if (!entry || entry.expiresAt <= now || entry.count < maxAttempts) {
    return { limited: false, retryAfterSeconds: 0 };
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((entry.expiresAt - now) / 1000));
  return { limited: true, retryAfterSeconds };
}

export async function recordRateLimitHit(
  key: string,
  windowSeconds: number
): Promise<{ count: number; retryAfterSeconds: number }> {
  const now = Date.now();
  const nextExpiry = now + windowSeconds * 1000;
  const existing = memoryRateLimitStore.get(key);

  if (!existing || existing.expiresAt <= now) {
    memoryRateLimitStore.set(key, { count: 1, expiresAt: nextExpiry });
    return { count: 1, retryAfterSeconds: windowSeconds };
  }

  existing.count += 1;
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.expiresAt - now) / 1000));
  return { count: existing.count, retryAfterSeconds };
}

export async function clearRateLimit(key: string): Promise<void> {
  memoryRateLimitStore.delete(key);
}
