"use server";

import { unstable_rethrow } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  DatabaseTimeoutError,
  verifySameOriginMutation,
  withServerTimeout,
} from "@/lib/request-security";
import { getRequestIpHash, isRateLimited, recordRateLimitHit } from "@/lib/rate-limit";
import { recordAuditLog } from "@/lib/audit";
import {
  contactMessageSchema,
  extractContactFieldErrors,
  type ContactMessageInput,
  type SubmitContactResult,
} from "./schema";

const WINDOW_SECONDS = 15 * 60;
const MAX_PER_IP = 5;
const MAX_PER_EMAIL = 3;
const CONTACT_DB_TIMEOUT_MS = 10_000;

const GENERIC_SUCCESS =
  "Terima kasih! Pesan Anda telah kami terima. Tim Next Karya akan menghubungi Anda dalam waktu 1x24 jam kerja.";

function isTransientDatabaseError(error: unknown): boolean {
  if (error instanceof DatabaseTimeoutError) return true;
  if (!(error instanceof Error)) return false;
  const code = (error as { code?: string }).code;
  if (code && ["P1001", "P1002", "P1008", "P1017"].includes(code)) return true;
  return /can't reach database|connection.*closed|timed? out|econnreset|etimedout|enotfound/i.test(
    error.message
  );
}

export async function submitContactMessage(
  input: ContactMessageInput
): Promise<SubmitContactResult> {
  if (typeof input !== "object" || input === null) {
    return {
      success: false,
      errorKind: "validation",
      message: "Format pengiriman formulir tidak valid.",
    };
  }

  try {
    const originCheck = await verifySameOriginMutation();
    if (!originCheck.allowed) {
      return {
        success: false,
        errorKind: "csrf",
        message:
          "Permintaan ditolak karena asal halaman tidak terverifikasi. Muat ulang halaman lalu coba kembali.",
      };
    }

    const ipHash = await getRequestIpHash();
    const ipKey = `contact:ip:${ipHash}`;

    const ipCheck = await withServerTimeout(
      isRateLimited(ipKey, MAX_PER_IP),
      CONTACT_DB_TIMEOUT_MS,
      "contactIpRateCheck"
    );
    if (ipCheck.limited) {
      const waitMinutes = Math.max(1, Math.ceil(ipCheck.retryAfterSeconds / 60));
      return {
        success: false,
        errorKind: "locked",
        retryAfterSeconds: ipCheck.retryAfterSeconds,
        message: `Terlalu banyak pesan dari jaringan ini. Coba kembali dalam ${waitMinutes} menit.`,
      };
    }

    // Bots fill hidden fields. Report success so they learn nothing, count the
    // hit against the IP, and store nothing.
    if (typeof input.websiteUrl === "string" && input.websiteUrl.trim().length > 0) {
      await recordRateLimitHit(ipKey, WINDOW_SECONDS);
      await recordAuditLog({
        action: "contact.bot_blocked",
        entityType: "ContactMessage",
        summary: { reason: "honeypot_triggered" },
        ipHash,
      });
      return { success: true, message: GENERIC_SUCCESS };
    }

    const parsed = contactMessageSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        errorKind: "validation",
        message: "Periksa kembali isian formulir Anda.",
        fieldErrors: extractContactFieldErrors(parsed.error.issues),
      };
    }

    const { name, email, service, message, sourcePage } = parsed.data;
    const emailKey = `contact:email:${email}`;

    const emailCheck = await withServerTimeout(
      isRateLimited(emailKey, MAX_PER_EMAIL),
      CONTACT_DB_TIMEOUT_MS,
      "contactEmailRateCheck"
    );
    if (emailCheck.limited) {
      const waitMinutes = Math.max(1, Math.ceil(emailCheck.retryAfterSeconds / 60));
      return {
        success: false,
        errorKind: "locked",
        retryAfterSeconds: emailCheck.retryAfterSeconds,
        message: `Email ini sudah mengirim beberapa pesan. Coba kembali dalam ${waitMinutes} menit.`,
      };
    }

    await withServerTimeout(
      Promise.all([
        prisma.contactMessage.create({
          data: { name, email, service, message, sourcePage, ipHash, status: "NEW" },
          select: { id: true },
        }),
        recordRateLimitHit(ipKey, WINDOW_SECONDS),
        recordRateLimitHit(emailKey, WINDOW_SECONDS),
      ]),
      CONTACT_DB_TIMEOUT_MS,
      "saveContactMessage"
    );

    return { success: true, message: GENERIC_SUCCESS };
  } catch (error) {
    unstable_rethrow(error);

    if (isTransientDatabaseError(error)) {
      console.error(
        "Transient database failure while saving contact message:",
        error instanceof Error ? error.message : "unknown"
      );
      return {
        success: false,
        errorKind: "timeout",
        message:
          "Koneksi ke server sedang melambat. Isian Anda tetap tersimpan di formulir, silakan kirim ulang beberapa detik lagi.",
      };
    }

    console.error(
      "Failed to save contact message:",
      error instanceof Error ? error.message : "unknown"
    );
    return {
      success: false,
      errorKind: "server",
      message:
        "Mohon maaf, pesan belum dapat disimpan. Silakan coba lagi sesaat lagi atau hubungi kami lewat email resmi.",
    };
  }
}
