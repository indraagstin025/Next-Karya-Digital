import "server-only";

export interface RecordAuditParams {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary?: Record<string, unknown>;
  ipHash?: string | null;
}

export async function recordAuditLog(params: RecordAuditParams): Promise<void> {
  console.log(`[Frontend Audit] ${params.action} on ${params.entityType}:${params.entityId || "none"}`);
}
