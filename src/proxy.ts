import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CMS_COOKIE_NAME = "nk_cms_token";

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function verifyStaffJwtToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [headerB64, payloadB64, signatureB64] = parts;
    const headerJson = JSON.parse(
      new TextDecoder().decode(base64UrlToUint8Array(headerB64))
    );
    if (headerJson?.alg !== "HS256") return false;

    const secret =
      process.env.JWT_SECRET ||
      process.env.AUTH_SECRET ||
      "643953b4eed1ecddbf0d36da9c7f6a6b7ba9877464cff315ff435802aa82465b";

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlToUint8Array(signatureB64);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature as BufferSource,
      data
    );
    if (!isValid) return false;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlToUint8Array(payloadB64))
    );

    if (!payload || typeof payload.userId !== "string" || payload.role !== "STAFF") {
      return false;
    }

    const nowSec = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && payload.exp <= nowSec) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lowerPath = pathname.toLowerCase();

  // Direct login URLs (/admin/login, /cms/login) are strictly disabled.
  // Staff authentication is only accessible via the Ctrl + Shift + S modal on public pages.
  if (
    lowerPath === "/admin/login" ||
    lowerPath.startsWith("/admin/login/") ||
    lowerPath === "/cms/login" ||
    lowerPath.startsWith("/cms/login/")
  ) {
    const res = NextResponse.redirect(new URL("/", request.url));
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // Protect /admin and /cms routes at the Proxy (Middleware) boundary
  const isAdminPath = lowerPath === "/admin" || lowerPath.startsWith("/admin/");
  const isCmsPath = lowerPath === "/cms" || lowerPath.startsWith("/cms/");

  if (isAdminPath || isCmsPath) {
    const token = request.cookies.get(CMS_COOKIE_NAME)?.value;
    if (!token) {
      const res = NextResponse.redirect(new URL("/", request.url));
      res.headers.set("Cache-Control", "no-store");
      return res;
    }

    const isAuthorized = await verifyStaffJwtToken(token);
    if (!isAuthorized) {
      const res = NextResponse.redirect(new URL("/", request.url));
      res.cookies.delete(CMS_COOKIE_NAME);
      res.headers.set("Cache-Control", "no-store");
      return res;
    }

    if (isAdminPath) {
      const targetPath = pathname.replace(/^\/admin/i, "/cms") || "/cms";
      const res = NextResponse.rewrite(new URL(targetPath, request.url));
      res.headers.set("Cache-Control", "no-store");
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }

    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store");
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/cms", "/cms/:path*"],
};
