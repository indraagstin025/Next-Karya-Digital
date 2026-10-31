import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { MediaService } from "../services/media.service";
import { env } from "../config/env";
import { sendSuccess, sendPaginated, sendError } from "../utils/response";

const mediaService = new MediaService();

// Ensure upload directory exists
const uploadDirPath = path.join(process.cwd(), env.UPLOAD_DIR);
if (!fs.existsSync(uploadDirPath)) {
  fs.mkdirSync(uploadDirPath, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBaseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-");
    cb(null, `${cleanBaseName}-${uniqueSuffix}${ext}`);
  },
});

const allowedMimeTypes = [
  "image/webp",
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "application/pdf",
];

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // max 10MB overall limit, refined in controller
  },
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("UNSUPPORTED_MEDIA_TYPE"));
    }
  },
});

export class MediaController {
  async getMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const site_id = (req.query.site_id as string) || "nextkarya-main";
      const search = req.query.search as string | undefined;
      const mimeType = req.query.mimeType as string | undefined;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);

      const { items, meta } = await mediaService.getMedia({
        site_id,
        search,
        mimeType,
        page,
        limit,
      });

      return sendPaginated(res, items, meta);
    } catch (err) {
      next(err);
    }
  }

  async uploadMedia(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return sendError(res, 400, "MISSING_FILE", "Berkas unggahan wajib disertakan.");
      }

      const file = req.file;
      const isPdf = file.mimetype === "application/pdf";
      const maxAllowedSize = isPdf ? 10 * 1024 * 1024 : 5 * 1024 * 1024;

      if (file.size > maxAllowedSize) {
        // Remove uploaded file if it exceeded size
        fs.unlinkSync(file.path);
        return sendError(
          res,
          400,
          "FILE_TOO_LARGE",
          `Ukuran berkas melebihi batas maksimal (${isPdf ? "10 MB untuk PDF" : "5 MB untuk Gambar"}).`
        );
      }

      const site_id = (req.body.site_id as string) || "nextkarya-main";
      const altText = req.body.altText as string | undefined;

      const media = await mediaService.saveUploadedFile(
        file,
        site_id,
        req.user!.id,
        altText
      );

      return sendSuccess(res, media, 201);
    } catch (err) {
      next(err);
    }
  }

  async deleteMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await mediaService.deleteMedia(id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
