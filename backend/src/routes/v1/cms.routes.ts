import { Router } from "express";
import { CmsController } from "../../controllers/cms.controller";
import { requireAuth } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validate";
import {
  createPostSchema,
  updatePostSchema,
  createPortfolioSchema,
  updatePortfolioSchema,
  createServiceSchema,
  updateServiceSchema,
  createPageSchema,
  updatePageSchema,
  createFaqSchema,
  updateFaqSchema,
  createTestimonialSchema,
  updateTestimonialSchema,
} from "../../validators/cms";

const router = Router();
const cmsController = new CmsController();

router.use(requireAuth);

// --- POSTS ---
router.get("/posts", cmsController.getPosts);
router.get("/posts/:id", cmsController.getPostById);
router.post("/posts", validateBody(createPostSchema), cmsController.createPost);
router.patch("/posts/:id", validateBody(updatePostSchema), cmsController.updatePost);
router.post("/posts/:id/publish", cmsController.publishPost);
router.post("/posts/:id/archive", cmsController.archivePost);

// --- PORTFOLIOS ---
router.get("/portfolios", cmsController.getPortfolios);
router.get("/portfolios/:id", cmsController.getPortfolioById);
router.post("/portfolios", validateBody(createPortfolioSchema), cmsController.createPortfolio);
router.patch("/portfolios/:id", validateBody(updatePortfolioSchema), cmsController.updatePortfolio);
router.post("/portfolios/:id/publish", cmsController.publishPortfolio);
router.post("/portfolios/:id/archive", cmsController.archivePortfolio);

// --- SERVICES ---
router.get("/services", cmsController.getServices);
router.get("/services/:id", cmsController.getServiceById);
router.post("/services", validateBody(createServiceSchema), cmsController.createService);
router.patch("/services/:id", validateBody(updateServiceSchema), cmsController.updateService);
router.post("/services/:id/publish", cmsController.publishService);
router.post("/services/:id/archive", cmsController.archiveService);

// --- PAGES ---
router.get("/pages", cmsController.getPages);
router.get("/pages/:id", cmsController.getPageById);
router.post("/pages", validateBody(createPageSchema), cmsController.createPage);
router.patch("/pages/:id", validateBody(updatePageSchema), cmsController.updatePage);
router.post("/pages/:id/publish", cmsController.publishPage);
router.post("/pages/:id/archive", cmsController.archivePage);

// --- FAQS ---
router.get("/faqs", cmsController.getFaqs);
router.get("/faqs/:id", cmsController.getFaqById);
router.post("/faqs", validateBody(createFaqSchema), cmsController.createFaq);
router.patch("/faqs/:id", validateBody(updateFaqSchema), cmsController.updateFaq);
router.delete("/faqs/:id", cmsController.deleteFaq);

// --- TESTIMONIALS ---
router.get("/testimonials", cmsController.getTestimonials);
router.get("/testimonials/:id", cmsController.getTestimonialById);
router.post("/testimonials", validateBody(createTestimonialSchema), cmsController.createTestimonial);
router.patch("/testimonials/:id", validateBody(updateTestimonialSchema), cmsController.updateTestimonial);
router.post("/testimonials/:id/archive", cmsController.archiveTestimonial);

// --- SNAPSHOTS ---
router.post("/content-snapshots/:id/restore", cmsController.restoreSnapshot);

export default router;
