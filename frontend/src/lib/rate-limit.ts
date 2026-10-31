import "server-only";
import { createHmac, hkdfSync } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { getValidatedAuthSecret } from "@/lib/session-crypto";

const HKDF_SALT = "naykon-auth-hkdf-salt-v1";
const HKDF_IP_INFO = "naykon:ratelimit:ip-hmac:v1";
const PRUNE_INTERVAL_MS = 5 * 60 * 1000;

let lastPruneTimestamp = 0;

function deriveIpHmacKey(): Buffer {
  const secret = getValidatedAuthSecret();
  return Buffer.from(hkdfSync("sha256", secret, HKDF_SALT, HKDF_IP_INFO, 32));
}

export function sanitizeClientIp(rawCandidate: string | null | undefined): string {
  if (!rawCandidate) return "unknown";
  const firstHop = rawCandidate.split(",")[0]?.trim() ?? "";
  if (!firstHop || firstHop.length > 64) return "unknown";

  // Strip optional port on bracketed IPv6 ([::1]:1234) or IPv4 (1.2.3.4:1234).
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

// Prioritizes platform-enforced edge headers before generic X-Forwarded-For
// so clients cannot rotate spoofed headers on Vercel or Cloudflare deployments.
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

function maybePruneExpiredRateLimits(now: Date): void {
  const nowMs = now.getTime();
  if (nowMs - lastPruneTimestamp < PRUNE_INTERVAL_MS) return;
  lastPruneTimestamp = nowMs;

  void prisma.rateLimit
    .deleteMany({
      where: { expiresAt: { lt: now } },
    })
    .catch(() => {
      // Non-blocking background maintenance; never fail active requests on prune error.
    });
}

export async function isRateLimited(
  key: string,
  maxAttempts: number
): Promise<{ limited: boolean; retryAfterSeconds: number }> {
  const now = new Date();
  maybePruneExpiredRateLimits(now);

  const entry = await prisma.rateLimit.findUnique({
    where: { key },
    select: { count: true, expiresAt: true },
  });

  if (!entry || entry.expiresAt <= now || entry.count < maxAttempts) {
    return { limited: false, retryAfterSeconds: 0 };
  }

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((entry.expiresAt.getTime() - now.getTime()) / 1000)
  );
  return { limited: true, retryAfterSeconds };
}

// Records a hit inside a transaction so expired windows reset atomically instead of stacking.
export async function recordRateLimitHit(
  key: string,
  windowSeconds: number
): Promise<{ count: number; retryAfterSeconds: number }> {
  const now = new Date();
  const nextExpiry = new Date(now.getTime() + windowSeconds * 1000);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.rateLimit.findUnique({
      where: { key },
      select: { count: true, expiresAt: true },
    });

    if (!existing || existing.expiresAt <= now) {
      const fresh = await tx.rateLimit.upsert({
        where: { key },
        update: { count: 1, expiresAt: nextExpiry },
        create: { key, count: 1, expiresAt: nextExpiry },
      });
      return { count: fresh.count, retryAfterSeconds: windowSeconds };
    }

    const updated = await tx.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((updated.expiresAt.getTime() - now.getTime()) / 1000)
    );
    return { count: updated.count, retryAfterSeconds };
  });
}

export async function clearRateLimit(key: string): Promise<void> {
  await prisma.rateLimit.deleteMany({ where: { key } });
}
