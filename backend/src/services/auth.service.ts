import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { cache } from "../config/redis";

export class AuthService {
  async login(email: string, passwordPlain: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw {
        statusCode: 401,
        code: "INVALID_CREDENTIALS",
        message: "Email atau kata sandi tidak sesuai.",
      };
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw {
        statusCode: 401,
        code: "INVALID_CREDENTIALS",
        message: "Email atau kata sandi tidak sesuai.",
      };
    }

    const payload = {
      userId: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });

    // Cache tokenVersion in Redis
    await cache.set(`user:${user.id}:tokenVersion`, user.tokenVersion.toString(), 86400);

    return {
      accessToken,
      expiresIn: 86400,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        jobTitle: user.jobTitle,
        role: user.role,
        tokenVersion: user.tokenVersion,
      },
    };
  }

  async revokeSessions(
    targetUserId: string,
    reason: string,
    executedById: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      throw {
        statusCode: 404,
        code: "USER_NOT_FOUND",
        message: "Pengguna tidak ditemukan.",
      };
    }

    // Increment tokenVersion in database and log emergency audit transactionally
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: targetUserId },
        data: {
          tokenVersion: { increment: 1 },
        },
      }),
      prisma.emergencyAuditLog.create({
        data: {
          site_id: "nextkarya-main",
          actionType: "REVOKE_SESSION",
          targetEntity: "USER",
          targetId: targetUserId,
          reason,
          actorId: executedById,
        },
      }),
    ]);

    // Update Redis cache immediately
    await cache.set(
      `user:${targetUserId}:tokenVersion`,
      updatedUser.tokenVersion.toString(),
      86400
    );

    return {
      message: "Seluruh sesi perangkat untuk staf ini berhasil dicabut.",
      newTokenVersion: updatedUser.tokenVersion,
      auditLogged: true,
    };
  }
}
