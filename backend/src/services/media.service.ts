import fs from "fs";
import path from "path";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { PaginationMeta } from "../utils/response";

export class MediaService {
  async getMedia(query: {
    site_id: string;
    search?: string;
    mimeType?: string;
    page: number;
    limit: number;
  }) {
    const { site_id, search, mimeType, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = { site_id };
    if (mimeType) where.mimeType = mimeType;
    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: "insensitive" } },
        { altText: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          uploadedBy: { select: { fullName: true } },
        },
      }),
    ]);

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };

    return { items, meta };
  }

  async saveUploadedFile(
    file: Express.Multer.File,
    site_id: string,
    uploaderId: string,
    altText?: string
  ) {
    const fileUrl = `${env.FRONTEND_URL}/uploads/${file.filename}`;

    const media = await prisma.media.create({
      data: {
        site_id,
        fileName: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        url: fileUrl,
        altText: altText || null,
        uploadedById: uploaderId,
      },
    });

    return media;
  }

  async deleteMedia(id: string) {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) throw { statusCode: 404, code: "NOT_FOUND", message: "Berkas tidak ditemukan." };

    // Delete file from disk
    const filePath = path.join(process.cwd(), env.UPLOAD_DIR, media.fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err: any) {
        console.warn("[Media Unlink Warning]", err.message);
      }
    }

    await prisma.media.delete({ where: { id } });
    return { message: "Berkas media berhasil dihapus." };
  }
}
