import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { sendError, ErrorDetail } from "../utils/response";

export function validateBody(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details: ErrorDetail[] = err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return sendError(
          res,
          400,
          "VALIDATION_ERROR",
          "Validasi data input gagal diproses.",
          details
        );
      }
      return sendError(res, 400, "BAD_REQUEST", "Format data tidak valid.");
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = await schema.parseAsync(req.query) as any;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details: ErrorDetail[] = err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return sendError(
          res,
          400,
          "QUERY_VALIDATION_ERROR",
          "Validasi parameter query gagal diproses.",
          details
        );
      }
      return sendError(res, 400, "BAD_REQUEST", "Parameter query tidak valid.");
    }
  };
}
