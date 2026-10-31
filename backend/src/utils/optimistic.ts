import { Response } from "express";
import { sendError } from "./response";

export function checkOptimisticLock(
  res: Response,
  requestUpdatedAt: string | Date | undefined,
  dbUpdatedAt: Date,
  currentEntityData: any
): boolean {
  if (!requestUpdatedAt) {
    sendError(
      res,
      400,
      "MISSING_UPDATED_AT",
      "Field updatedAt wajib disertakan untuk validasi konkurensi (optimistic locking)."
    );
    return false;
  }

  const reqTime = new Date(requestUpdatedAt).getTime();
  const dbTime = new Date(dbUpdatedAt).getTime();

  // Allow 1000ms drift if rounding differences occurred, otherwise strict compare
  if (Math.abs(reqTime - dbTime) > 1000 && reqTime < dbTime) {
    sendError(
      res,
      409,
      "CONCURRENT_MODIFICATION_CONFLICT",
      "Data ini baru saja diperbarui oleh rekan kerja Anda. Silakan tinjau perubahan terkini.",
      undefined,
      currentEntityData
    );
    return false;
  }

  return true;
}
