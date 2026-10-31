import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

const SENSITIVE_KEY_PATTERN =
  /pass(word)?|hash|token|secret|cookie|auth(orization)?|session|credential|key/i;
const MAX_SUMMARY_KEYS = 20;
const MAX_STRING_VALUE_LENGTH = 240;

export function scrubAuditSummary(
  input: Record<string, unknown> | undefined
): Prisma.InputJsonObject | undefined {
  if (!input) return undefined;

  const cleaned: Record<string, Prisma.InputJsonValue | null> = {};
  let includedKeys = 0;

  for (const [key, value] of Object.entries(input)) {
    if (includedKeys >= MAX_SUMMARY_KEYS) break;
    if (SENSITIVE_KEY_PATTERN.test(key)) continue;

    if (typeof value === "string") {
      cleaned[key] = value
        .replace(/[\u0000-\u001F\u007F]/g, "")
        .slice(0, MAX_STRING_VALUE_LENGTH);
      includedKeys += 1;
    } else if (
      (typeof value === "number" && Number.isFinite(value)) ||
      typeof value === "boolean" ||
      value === null
    ) {
      cleaned[key] = value;
      includedKeys += 1;
    }
  }

  return cleaned;
}

export interface RecordAuditParams {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary?: Record<string, unknown>;
  ipHash?: string | null;
}

export async function recordAuditLog(params: RecordAuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action.slice(0, 80),
        entityType: params.entityType.slice(0, 60),
        entityId: params.entityId ? params.entityId.slice(0, 64) : null,
        summary: scrubAuditSummary(params.summary),
        ipHash: params.ipHash ? params.ipHash.slice(0, 64) : null,
      },
    });
  } catch (error) {
    console.error(
      "Audit log write failed:",
      error instanceof Error ? error.message : "unknown"
    );
  }
}
