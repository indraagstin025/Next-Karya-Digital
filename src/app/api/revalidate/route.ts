import crypto from "crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const revalidatePayloadSchema = z
  .object({
    tag: z.enum([
      "articles",
      "portfolios",
      "services",
      "pricing",
      "faqs",
      "testimonials",
      "pages",
      "site",
      "all",
    ]),
    action: z.enum(["update"]).default("update"),
  })
  .strict();

function verifyWebhookSecret(providedSecret: string | null): boolean {
  const configuredSecret =
    process.env.WEBHOOK_SECRET ||
    process.env.REVALIDATION_SECRET ||
    "nextkarya-webhook-secret-key-32-chars-live";

  if (!providedSecret || !configuredSecret) {
    return false;
  }

  const providedBuf = Buffer.from(providedSecret, "utf8");
  const expectedBuf = Buffer.from(configuredSecret, "utf8");

  if (providedBuf.length !== expectedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuf, expectedBuf);
}

export async function POST(request: NextRequest) {
  const secretHeader = request.headers.get("x-webhook-secret");
  if (!verifyWebhookSecret(secretHeader)) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        meta: null,
        error: {
          code: "UNAUTHORIZED_WEBHOOK",
          message: "Tanda tangan webhook revalidasi tidak sah.",
        },
      },
      { status: 401 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        meta: null,
        error: {
          code: "INVALID_JSON",
          message: "Format JSON webhook tidak valid.",
        },
      },
      { status: 400 }
    );
  }

  const parsed = revalidatePayloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        meta: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "Tag revalidasi tidak dikenali.",
          details: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      },
      { status: 400 }
    );
  }

  const { tag } = parsed.data;
  const revalidatedTags: string[] = [];

  const expireTag = (targetTag: string) => {
    revalidateTag(targetTag, { expire: 0 });
    revalidatedTags.push(targetTag);
  };

  if (tag === "all") {
    for (const item of [
      "public:services",
      "public:pricing",
      "public:portfolios",
      "public:faqs",
      "public:articles",
      "public:pages",
      "public:testimonials",
      "public:site",
    ]) {
      expireTag(item);
    }
    revalidatePath("/", "layout");
  } else {
    expireTag(`public:${tag}`);
    expireTag(tag);

    if (tag === "services") {
      expireTag("public:pricing");
      revalidatePath("/");
      revalidatePath("/layanan");
    } else if (tag === "portfolios") {
      revalidatePath("/");
      revalidatePath("/portofolio");
    } else if (tag === "articles") {
      revalidatePath("/");
      revalidatePath("/blog");
    } else if (tag === "faqs") {
      revalidatePath("/");
      revalidatePath("/layanan");
    } else if (tag === "pages") {
      revalidatePath("/kebijakan-privasi");
      revalidatePath("/syarat-ketentuan");
    } else if (tag === "site") {
      revalidatePath("/", "layout");
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      revalidated: true,
      tags: revalidatedTags,
      timestamp: new Date().toISOString(),
    },
    meta: null,
    error: null,
  });
}
