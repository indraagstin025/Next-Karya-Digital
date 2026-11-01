import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:5000/api/v1";

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    if (!bodyText || bodyText.length > 2048) {
      return NextResponse.json(
        { success: false, error: { message: "Ukuran payload tidak valid" } },
        { status: 400 }
      );
    }

    const forwardHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward client IP and User-Agent if available
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
      { success: false, message: "Telemetry buffer accepted" },
      { status: 202 }
    );
  }
}
