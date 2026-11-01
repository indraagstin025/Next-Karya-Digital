import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  CMS_COOKIE_NAME,
  forwardToCmsBackend,
  getCmsTokenFromCookies,
} from "@/lib/cms-server";
import { verifySameOriginMutation } from "@/lib/request-security";

export async function POST() {
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

  const token = await getCmsTokenFromCookies();
  if (token) {
    await forwardToCmsBackend("/auth/logout", {
      method: "POST",
      token,
      body: JSON.stringify({}),
    });
  }

  const cookieStore = await cookies();
  cookieStore.delete(CMS_COOKIE_NAME);

  return NextResponse.json({
    success: true,
    data: { message: "Berhasil keluar dari sistem." },
    meta: null,
    error: null,
  });
}
