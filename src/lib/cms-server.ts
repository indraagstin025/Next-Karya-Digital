import "server-only";
import { cookies } from "next/headers";

export const CMS_COOKIE_NAME = "nk_cms_token";
export const CANONICAL_SITE_ID = "nextkarya-main";

export interface CmsStaffUser {
  id: string;
  email: string;
  fullName: string;
  role: "STAFF";
  jobTitle: string;
  avatarUrl: string | null;
}

export interface BackendEnvelope<T = any> {
  success: boolean;
  data: T | null;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  error: {
    code: string;
    message: string;
    details?: { field?: string; message: string }[];
    currentData?: any;
  } | null;
}

export function getBackendApiBaseUrl(): string {
  return (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/v1"
  ).replace(/\/+$/, "");
}

export function getBackendOriginUrl(): string {
  const apiBase = getBackendApiBaseUrl();
  return apiBase.replace(/\/api\/v1$/, "");
}

export async function getCmsTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CMS_COOKIE_NAME)?.value || null;
}

export async function forwardToCmsBackend<T = any>(
  endpoint: string,
  init?: RequestInit & { token?: string | null; timeoutMs?: number }
): Promise<{ status: number; body: BackendEnvelope<T> }> {
  const token =
    init?.token !== undefined ? init.token : await getCmsTokenFromCookies();
  const baseUrl = getBackendApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(url, {
      ...init,
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(init?.timeoutMs ?? 10_000),
    });

    const body = (await response.json()) as BackendEnvelope<T>;
    return { status: response.status, body };
  } catch (err: any) {
    return {
      status: 503,
      body: {
        success: false,
        data: null,
        meta: null,
        error: {
          code: "BACKEND_UNREACHABLE",
          message:
            err?.name === "TimeoutError"
              ? "Server API tidak merespons dalam batas waktu 10 detik."
              : "Tidak dapat terhubung ke server API backend.",
        },
      },
    };
  }
}

export async function getAuthenticatedCmsUser(): Promise<CmsStaffUser | null> {
  const token = await getCmsTokenFromCookies();
  if (!token) return null;

  const { status, body } = await forwardToCmsBackend<
    CmsStaffUser | { user: CmsStaffUser }
  >("/auth/me", {
    method: "GET",
    token,
    timeoutMs: 6_000,
  });

  if (status !== 200 || !body.success || !body.data) {
    return null;
  }

  const rawData = body.data as any;
  const user: CmsStaffUser | null = rawData?.user ?? rawData;
  if (!user || typeof user.id !== "string") {
    return null;
  }

  return user;
}
