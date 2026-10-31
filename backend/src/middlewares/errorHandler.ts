import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[Error] Unhandled Exception:`, {
    path: req.path,
    method: req.method,
    message: err?.message || err,
    stack: process.env.NODE_ENV !== "production" ? err?.stack : undefined,
  });

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = typeof err?.statusCode === "number" ? err.statusCode : 500;
  const errorCode = err?.code || "INTERNAL_SERVER_ERROR";
  const errorMessage =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Terjadi kesalahan sistem internal tak terduga."
      : err?.message || "Terjadi kesalahan sistem internal.";

  return sendError(res, statusCode, errorCode, errorMessage);
}
