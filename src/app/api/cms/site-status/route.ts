import { NextResponse } from "next/server";
import { getPublicSiteStatus } from "@/lib/public-content";

export async function GET() {
  const status = await getPublicSiteStatus();
  return NextResponse.json({
    success: true,
    data: status || {
      id: "nextkarya-main",
      name: "Next Karya Digital Solutions",
      domain: "nextkarya.web.id",
      isActive: true,
      isFormLocked: false,
      alertBanner: null,
      isAlertActive: false,
    },
    meta: null,
    error: null,
  });
}
