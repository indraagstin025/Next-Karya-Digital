import { NextRequest, NextResponse } from "next/server";
import { isAllowedAnalyticsOrigin } from "@/lib/analytics-core";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL?.replace(/\/+$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:5000/api/v1";

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  "https://nextkarya.web.id",
  "https://www.nextkarya.web.id",
  "http://localhost:3000",
].filter((origin): origin is string => Boolean(origin));

function firstHeaderEntry(value: string | null): string | null {
  if (!value) return null;
  return value.split(",")[0]?.trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const host = request.headers.get("host") || request.nextUrl.host;

    if (
      !isAllowedAnalyticsOrigin({
        origin,
        referer,
        host,
        allowedOrigins: ALLOWED_ORIGINS,
      })
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ANALYTICS_ORIGIN_REJECTED",
            message: "Asal permintaan analitik tidak dikenali.",
          },
        },
        { status: 403 }
      );
    }

    const bodyText = await request.text();
    if (!bodyText || bodyText.length > 2048) {
      return NextResponse.json(
        { success: false, error: { message: "Data kunjungan tidak bisa diproses." } },
        { status: 400 }
      );
    }

    const forwardHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward the visitor IP so the backend can build a daily visitor identity.
    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      firstHeaderEntry(request.headers.get("x-forwarded-for")) ||
      request.headers.get("x-real-ip");
    if (clientIp) forwardHeaders["x-analytics-client-ip"] = clientIp;

    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) forwardHeaders["x-forwarded-for"] = forwardedFor;

    const userAgent = request.headers.get("user-agent");
    if (userAgent) forwardHeaders["user-agent"] = userAgent;

    const res = await fetch(`${BACKEND_API_URL}/analytics/event`, {
      method: "POST",
      headers: forwardHeaders,
      body: bodyText,
    });

    const data = await res.json().catch(() => ({ success: res.ok }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    // Non-blocking fallback for analytics telemetry
    return NextResponse.json(
      { success: false, message: "Data kunjungan belum bisa dicatat." },
      { status: 202 }
    );
  }
}
