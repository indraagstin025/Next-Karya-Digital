import "server-only";
import { headers } from "next/headers";

export class DatabaseTimeoutError extends Error {
  constructor(operationName: string) {
    super(`Operation "${operationName}" exceeded server timeout.`);
    this.name = "DatabaseTimeoutError";
  }
}

export async function withServerTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  operationName: string
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new DatabaseTimeoutError(operationName));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// Defense-in-depth check on top of Next.js Server Action Origin validation.
export async function verifySameOriginMutation(): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const reqHeaders = await headers();
  const secFetchSite = reqHeaders.get("sec-fetch-site")?.toLowerCase();

  if (
    secFetchSite &&
    secFetchSite !== "same-origin" &&
    secFetchSite !== "none"
  ) {
    return { allowed: false, reason: "cross_site_fetch_metadata" };
  }

  const originHeader = reqHeaders.get("origin");
  const rawHost =
    reqHeaders.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    reqHeaders.get("host")?.trim();

  if (originHeader && rawHost) {
    try {
      const originHost = new URL(originHeader).host.toLowerCase();
      if (originHost !== rawHost.toLowerCase()) {
        return { allowed: false, reason: "origin_host_mismatch" };
      }
    } catch {
      return { allowed: false, reason: "malformed_origin_header" };
    }
  }

  return { allowed: true };
}
