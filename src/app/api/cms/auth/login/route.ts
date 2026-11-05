import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  CMS_COOKIE_NAME,
  forwardToCmsBackend,
  type CmsStaffUser,
} from "@/lib/cms-server";
import { verifySameOriginMutation } from "@/lib/request-security";

const STAFF_SESSION_SECONDS = 7 * 24 * 60 * 60;

const loginBodySchema = z
  .object({
    email: z.string().trim().email("Alamat email belum benar. Contoh: nama@email.com").max(255, "Alamat email maksimal 255 karakter"),
    password: z.string().min(6, "Kata sandi minimal 6 karakter").max(128, "Kata sandi maksimal 128 karakter"),
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
          message: "Permintaan ditolak karena halaman asal tidak dikenali. Muat ulang halaman lalu coba lagi.",
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
          message: "Data login belum lengkap atau tidak sesuai.",
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
          message: parsed.error.issues[0]?.message || "Email atau kata sandi belum sesuai.",
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
    maxAge: body.data.expiresIn || STAFF_SESSION_SECONDS,
  });

  return NextResponse.json({
    success: true,
    data: {
      expiresIn: body.data.expiresIn || STAFF_SESSION_SECONDS,
      user: body.data.user,
    },
    meta: null,
    error: null,
  });
}
