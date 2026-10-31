import { Request, Response, NextFunction } from "express";
import { CmsService } from "../services/cms.service";
import { sendSuccess, sendPaginated, sendError } from "../utils/response";
import { checkOptimisticLock } from "../utils/optimistic";

const cmsService = new CmsService();

export class CmsController {
  // --- POSTS ---
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const site_id = (req.query.site_id as string) || "nextkarya-main";
      const status = req.query.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);
      const search = req.query.search as string | undefined;

      const { items, meta } = await cmsService.getPosts({ site_id, status, page, limit, search });
      return sendPaginated(res, items, meta);
    } catch (err) {
      next(err);
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await cmsService.getPostById((req.params.id as string));
      if (!item) return sendError(res, 404, "NOT_FOUND", "Artikel tidak ditemukan.");
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.createPost(req.body, req.user!.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const current = await cmsService.getPostById((req.params.id as string));
      if (!current) return sendError(res, 404, "NOT_FOUND", "Artikel tidak ditemukan.");

      const isAllowed = checkOptimisticLock(res, req.body.updatedAt, current.updatedAt, current);
      if (!isAllowed) return;

      const result = await cmsService.updatePost((req.params.id as string), req.body, req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async publishPost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.publishPost((req.params.id as string), req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async archivePost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.archivePost((req.params.id as string), req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // --- PORTFOLIOS ---
  async getPortfolios(req: Request, res: Response, next: NextFunction) {
    try {
      const site_id = (req.query.site_id as string) || "nextkarya-main";
      const status = req.query.status as any;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);

      const { items, meta } = await cmsService.getPortfolios({ site_id, status, page, limit });
      return sendPaginated(res, items, meta);
    } catch (err) {
      next(err);
    }
  }

  async getPortfolioById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await cmsService.getPortfolioById((req.params.id as string));
      if (!item) return sendError(res, 404, "NOT_FOUND", "Portofolio tidak ditemukan.");
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async createPortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.createPortfolio(req.body, req.user!.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  async updatePortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const current = await cmsService.getPortfolioById((req.params.id as string));
      if (!current) return sendError(res, 404, "NOT_FOUND", "Portofolio tidak ditemukan.");

      const isAllowed = checkOptimisticLock(res, req.body.updatedAt, current.updatedAt, current);
      if (!isAllowed) return;

      const result = await cmsService.updatePortfolio((req.params.id as string), req.body, req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async publishPortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.publishPortfolio((req.params.id as string), req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async archivePortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.archivePortfolio((req.params.id as string), req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // --- SERVICES ---
  async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const site_id = (req.query.site_id as string) || "nextkarya-main";
      const status = req.query.status as any;
      const items = await cmsService.getServices(site_id, status);
      return sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }

  async getServiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await cmsService.getServiceById((req.params.id as string));
      if (!item) return sendError(res, 404, "NOT_FOUND", "Layanan tidak ditemukan.");
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.createService(req.body, req.user!.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const current = await cmsService.getServiceById((req.params.id as string));
      if (!current) return sendError(res, 404, "NOT_FOUND", "Layanan tidak ditemukan.");

      const isAllowed = checkOptimisticLock(res, req.body.updatedAt, current.updatedAt, current);
      if (!isAllowed) return;

      const result = await cmsService.updateService((req.params.id as string), req.body, req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async publishService(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.publishService((req.params.id as string), req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async archiveService(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.archiveService((req.params.id as string), req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // --- PAGES ---
  async getPages(req: Request, res: Response, next: NextFunction) {
    try {
      const site_id = (req.query.site_id as string) || "nextkarya-main";
      const items = await cmsService.getPages(site_id);
      return sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }

  async getPageById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await cmsService.getPageById((req.params.id as string));
      if (!item) return sendError(res, 404, "NOT_FOUND", "Halaman tidak ditemukan.");
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async createPage(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.createPage(req.body, req.user!.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  async updatePage(req: Request, res: Response, next: NextFunction) {
    try {
      const current = await cmsService.getPageById((req.params.id as string));
      if (!current) return sendError(res, 404, "NOT_FOUND", "Halaman tidak ditemukan.");

      const isAllowed = checkOptimisticLock(res, req.body.updatedAt, current.updatedAt, current);
      if (!isAllowed) return;

      const result = await cmsService.updatePage((req.params.id as string), req.body, req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async publishPage(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.publishPage((req.params.id as string), req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async archivePage(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.archivePage((req.params.id as string), req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // --- FAQS ---
  async getFaqs(req: Request, res: Response, next: NextFunction) {
    try {
      const site_id = (req.query.site_id as string) || "nextkarya-main";
      const items = await cmsService.getFaqs(site_id);
      return sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }

  async getFaqById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await cmsService.getFaqById((req.params.id as string));
      if (!item) return sendError(res, 404, "NOT_FOUND", "FAQ tidak ditemukan.");
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async createFaq(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.createFaq(req.body, req.user!.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  async updateFaq(req: Request, res: Response, next: NextFunction) {
    try {
      const current = await cmsService.getFaqById((req.params.id as string));
      if (!current) return sendError(res, 404, "NOT_FOUND", "FAQ tidak ditemukan.");

      const isAllowed = checkOptimisticLock(res, req.body.updatedAt, current.updatedAt, current);
      if (!isAllowed) return;

      const result = await cmsService.updateFaq((req.params.id as string), req.body, req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async deleteFaq(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.deleteFaq((req.params.id as string), req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // --- TESTIMONIALS ---
  async getTestimonials(req: Request, res: Response, next: NextFunction) {
    try {
      const site_id = (req.query.site_id as string) || "nextkarya-main";
      const items = await cmsService.getTestimonials(site_id);
      return sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }

  async getTestimonialById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await cmsService.getTestimonialById((req.params.id as string));
      if (!item) return sendError(res, 404, "NOT_FOUND", "Testimoni tidak ditemukan.");
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async createTestimonial(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.createTestimonial(req.body, req.user!.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  async updateTestimonial(req: Request, res: Response, next: NextFunction) {
    try {
      const current = await cmsService.getTestimonialById((req.params.id as string));
      if (!current) return sendError(res, 404, "NOT_FOUND", "Testimoni tidak ditemukan.");

      const isAllowed = checkOptimisticLock(res, req.body.updatedAt, current.updatedAt, current);
      if (!isAllowed) return;

      const result = await cmsService.updateTestimonial((req.params.id as string), req.body, req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async archiveTestimonial(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.archiveTestimonial((req.params.id as string), req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // --- SNAPSHOT RESTORE ---
  async restoreSnapshot(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cmsService.restoreSnapshot((req.params.id as string), req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
