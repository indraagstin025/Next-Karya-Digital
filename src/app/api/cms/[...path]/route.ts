import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  CANONICAL_SITE_ID,
  forwardToCmsBackend,
  getCmsTokenFromCookies,
} from "@/lib/cms-server";
import { verifySameOriginMutation } from "@/lib/request-security";

const ALLOWED_TOP_SEGMENTS = new Set([
  "posts",
  "categories",
  "portfolios",
  "services",
  "pages",
  "faqs",
  "testimonials",
  "redirects",
  "content-snapshots",
  "media",
  "emergency",
  "users",
  "auth",
  "crm",
  "analytics",
]);

function isSafeSegment(segment: string): boolean {
  return /^[a-zA-Z0-9_-]{1,64}$/.test(segment);
}

function revalidateAfterCmsMutation(topSegment: string) {
  try {
    if (topSegment === "posts" || topSegment === "categories") {
      revalidateTag("public:articles", { expire: 0 });
      revalidatePath("/");
      revalidatePath("/blog");
    } else if (topSegment === "portfolios") {
      revalidateTag("public:portfolios", { expire: 0 });
      revalidatePath("/");
      revalidatePath("/portofolio");
    } else if (topSegment === "services") {
      revalidateTag("public:services", { expire: 0 });
      revalidateTag("public:pricing", { expire: 0 });
      revalidatePath("/");
      revalidatePath("/layanan");
    } else if (topSegment === "faqs") {
      revalidateTag("public:faqs", { expire: 0 });
      revalidatePath("/");
      revalidatePath("/layanan");
    } else if (topSegment === "testimonials") {
      revalidateTag("public:testimonials", { expire: 0 });
      revalidatePath("/");
    } else if (topSegment === "pages") {
      revalidateTag("public:pages", { expire: 0 });
      revalidatePath("/kebijakan-privasi");
      revalidatePath("/syarat-ketentuan");
    } else if (topSegment === "emergency" || topSegment === "content-snapshots") {
      for (const tag of [
        "public:site",
        "public:articles",
        "public:portfolios",
        "public:services",
        "public:pricing",
        "public:faqs",
        "public:pages",
      ]) {
        revalidateTag(tag, { expire: 0 });
      }
      revalidatePath("/", "layout");
    }
  } catch {
    // non-fatal cache invalidation
  }
}

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await context.params;
  if (
    !pathSegments ||
    pathSegments.length === 0 ||
    pathSegments.length > 4 ||
    !ALLOWED_TOP_SEGMENTS.has(pathSegments[0]) ||
    !pathSegments.every(isSafeSegment)
  ) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        meta: null,
        error: {
          code: "FORBIDDEN_ENDPOINT",
          message: "Endpoint CMS tidak diizinkan.",
        },
      },
      { status: 403 }
    );
  }

  const token = await getCmsTokenFromCookies();
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        meta: null,
        error: {
          code: "AUTHENTICATION_REQUIRED",
          message: "Sesi staf tidak ditemukan. Silakan masuk terlebih dahulu.",
        },
      },
      { status: 401 }
    );
  }

  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    const originCheck = await verifySameOriginMutation();
    if (!originCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          meta: null,
          error: {
            code: "CSRF_REJECTED",
            message: "Permintaan mutasi ditolak karena asal halaman tidak sah.",
          },
        },
        { status: 403 }
      );
    }
  }

  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  searchParams.set("site_id", CANONICAL_SITE_ID);
  searchParams.set("scope", "cms");

  const endpoint = `/${pathSegments.join("/")}?${searchParams.toString()}`;
  const contentType = request.headers.get("content-type") || "";

  let forwardBody: BodyInit | undefined;
  const forwardHeaders: Record<string, string> = {};

  const ifUnmodifiedSince = request.headers.get("if-unmodified-since");
  if (ifUnmodifiedSince) {
    forwardHeaders["if-unmodified-since"] = ifUnmodifiedSince;
  }

  if (method === "POST" || method === "PATCH" || method === "DELETE") {
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      formData.set("site_id", CANONICAL_SITE_ID);
      forwardBody = formData;
    } else {
      let jsonBody: Record<string, unknown> = {};
      try {
        const text = await request.text();
        if (text.trim().length > 0) {
          const parsed = JSON.parse(text);
          if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
            jsonBody = parsed as Record<string, unknown>;
          }
        }
      } catch {
        return NextResponse.json(
          {
            success: false,
            data: null,
            meta: null,
            error: {
              code: "INVALID_JSON",
              message: "Format body JSON tidak valid.",
            },
          },
          { status: 400 }
        );
      }

      if (
        typeof jsonBody.site_id === "string" &&
        jsonBody.site_id.trim() !== "" &&
        jsonBody.site_id.trim() !== CANONICAL_SITE_ID
      ) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            meta: null,
            error: {
              code: "TENANT_ACCESS_DENIED",
              message: "Akses ditolak: site_id tidak sesuai otorisasi.",
            },
          },
          { status: 403 }
        );
      }

      forwardBody = JSON.stringify(jsonBody);
    }
  }

  const { status, body } = await forwardToCmsBackend(endpoint, {
    method,
    token,
    headers: forwardHeaders,
    body: forwardBody,
    timeoutMs: 12_000,
  });

  if ((method === "POST" || method === "PATCH" || method === "DELETE") && body.success) {
    revalidateAfterCmsMutation(pathSegments[0]);
  }

  return NextResponse.json(body, { status });
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
