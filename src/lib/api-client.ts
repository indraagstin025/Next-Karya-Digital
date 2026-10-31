const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://nextkarya.web.id/api/v1"
    : "http://localhost:5000/api/v1");

export interface ApiResponse<T> {
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
  } | null;
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return null;
    }

    const payload = (await res.json()) as ApiResponse<T>;
    return payload.success ? payload.data : null;
  } catch {
    // Graceful fallback when backend API is offline during build
    return null;
  }
}

export async function postApi<T>(
  endpoint: string,
  body: any
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      data: null,
      meta: null,
      error: {
        code: "NETWORK_ERROR",
        message: err?.message || "Gagal menghubungi server API.",
      },
    };
  }
}
