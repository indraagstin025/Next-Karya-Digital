import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { cache } from "../config/redis";
import { sendError } from "../utils/response";

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  jobTitle: string;
  role: "STAFF";
  tokenVersion: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(
      res,
      401,
      "UNAUTHORIZED",
      "Kredensial otentikasi tidak ditemukan. Header Authorization: Bearer <token> wajib disertakan."
    );
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      email: string;
      tokenVersion: number;
      role: string;
    };

    if (!decoded || !decoded.userId) {
      return sendError(res, 401, "INVALID_TOKEN", "Token otentikasi tidak sah.");
    }

    // Check tokenVersion in Redis cache first for sub-millisecond check
    const cacheKey = `user:${decoded.userId}:tokenVersion`;
    let activeVersionStr = await cache.get(cacheKey);
    let activeVersion: number;

    if (activeVersionStr !== null) {
      activeVersion = parseInt(activeVersionStr, 10);
    } else {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          fullName: true,
          jobTitle: true,
          role: true,
          tokenVersion: true,
        },
      });

      if (!user) {
        return sendError(res, 401, "USER_NOT_FOUND", "Pengguna tidak ditemukan dalam sistem.");
      }

      activeVersion = user.tokenVersion;
      // Cache tokenVersion for 1 hour
      await cache.set(cacheKey, activeVersion.toString(), 3600);

      if (decoded.tokenVersion !== activeVersion) {
        return sendError(
          res,
          403,
          "REVOKED_SESSION",
          "Sesi perangkat ini telah dicabut atau kadaluarsa. Silakan lakukan login ulang."
        );
      }

      req.user = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        jobTitle: user.jobTitle,
        role: user.role,
        tokenVersion: user.tokenVersion,
      };

      return next();
    }

    if (decoded.tokenVersion !== activeVersion) {
      return sendError(
        res,
        403,
        "REVOKED_SESSION",
        "Sesi perangkat ini telah dicabut atau kadaluarsa. Silakan lakukan login ulang."
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        jobTitle: true,
        role: true,
        tokenVersion: true,
      },
    });

    if (!user) {
      return sendError(res, 401, "USER_NOT_FOUND", "Pengguna tidak ditemukan dalam sistem.");
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      jobTitle: user.jobTitle,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return sendError(
        res,
        401,
        "TOKEN_EXPIRED",
        "Masa berlaku token telah habis. Silakan login kembali."
      );
    }
    return sendError(res, 401, "INVALID_TOKEN", "Tanda tangan token otentikasi tidak sah.");
  }
}
