import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  CMS_COOKIE_NAME,
  forwardToCmsBackend,
  type CmsStaffUser,
} from "@/lib/cms-server";
import { verifySameOriginMutation } from "@/lib/request-security";

const loginBodySchema = z
  .object({
    email: z.string().trim().email("Format email tidak valid").max(255),
    password: z.string().min(6, "Kata sandi minimal 6 karakter").max(128),
  })
  .strict();

export async function POST(request: NextRequest) {
  const originCheck = await verifySameOriginMutation();
  if (!originCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        meta: null,
        error: {
          code: "CSRF_REJECTED",
          message: "Permintaan ditolak karena asal halaman tidak sah.",
        },
      },
      { status: 403 }
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
          message: "Format permintaan login tidak valid.",
        },
      },
      { status: 400 }
    );
  }

  const parsed = loginBodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        meta: null,
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message || "Input login tidak valid.",
        },
      },
      { status: 400 }
    );
  }

  const { status, body } = await forwardToCmsBackend<{
    accessToken: string;
    expiresIn: number;
    user: CmsStaffUser;
  }>("/auth/login", {
    method: "POST",
    token: null,
    body: JSON.stringify(parsed.data),
  });

  if (status !== 200 || !body.success || !body.data?.accessToken) {
    return NextResponse.json(body, { status });
  }

  const cookieStore = await cookies();
  cookieStore.set(CMS_COOKIE_NAME, body.data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: body.data.expiresIn || 28800,
  });

  return NextResponse.json({
    success: true,
    data: {
      expiresIn: body.data.expiresIn || 28800,
      user: body.data.user,
    },
    meta: null,
    error: null,
  });
}
