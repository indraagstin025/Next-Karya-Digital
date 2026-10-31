import { Router } from "express";
import { PublicController } from "../../controllers/public.controller";
import { rateLimiter } from "../../middlewares/rateLimiter";
import { validateBody } from "../../middlewares/validate";
import { createLeadPublicSchema, analyticsEventSchema } from "../../validators/public";

const router = Router();
const publicController = new PublicController();

// Rate limiter: 120 req/min for public GET reads
const readRateLimiter = rateLimiter({ windowSec: 60, maxRequests: 120, prefix: "rl_read" });

// Public Articles
router.get("/articles", readRateLimiter, publicController.getArticles);
router.get("/articles/:slug", readRateLimiter, publicController.getArticleBySlug);

// Public Portfolios
router.get("/portfolios", readRateLimiter, publicController.getPortfolios);
router.get("/portfolios/:slug", readRateLimiter, publicController.getPortfolioBySlug);

// Public Services & FAQs & Testimonials
router.get("/services", readRateLimiter, publicController.getServices);
router.get("/faqs", readRateLimiter, publicController.getFaqs);
router.get("/testimonials", readRateLimiter, publicController.getTestimonials);

// Public Pages
router.get("/pages/:slug", readRateLimiter, publicController.getPageBySlug);

// Intake: Public Form Leads (5 req/15 min)
router.post(
  "/leads",
  rateLimiter({ windowSec: 900, maxRequests: 5, prefix: "rl_lead" }),
  validateBody(createLeadPublicSchema),
  publicController.submitLead
);

// Intake: Analytics Beacon (60 req/min)
router.post(
  "/analytics/event",
  rateLimiter({ windowSec: 60, maxRequests: 60, prefix: "rl_analytics" }),
  validateBody(analyticsEventSchema),
  publicController.recordAnalyticsEvent
);

export default router;
