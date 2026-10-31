import { z } from "zod";

// --- POSTS ---
export const createPostSchema = z.object({
  site_id: z.string().min(1).default("nextkarya-main"),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus lowercase dan hyphen"),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.any(),
  coverUrl: z.string().url().optional().nullable(),
  coverAlt: z.string().max(255).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().max(255).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
});

export const updatePostSchema = createPostSchema.partial().extend({
  updatedAt: z.string().min(1, "updatedAt wajib untuk optimistic locking"),
});

// --- PORTFOLIOS ---
export const createPortfolioSchema = z.object({
  site_id: z.string().min(1).default("nextkarya-main"),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus lowercase dan hyphen"),
  clientName: z.string().min(2).max(255),
  serviceCategory: z.string().min(2).max(100),
  summary: z.string().max(500),
  impactSummary: z.string().optional().nullable(),
  metricResult: z.string().optional().nullable(),
  technologies: z.array(z.string()).default([]),
  thumbnailUrl: z.string().url().optional().nullable(),
  projectUrl: z.string().url().optional().nullable(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const updatePortfolioSchema = createPortfolioSchema.partial().extend({
  updatedAt: z.string().min(1, "updatedAt wajib untuk optimistic locking"),
});

// --- SERVICES ---
export const createServiceSchema = z.object({
  site_id: z.string().min(1).default("nextkarya-main"),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  icon: z.string().min(1),
  shortDesc: z.string().max(500),
  features: z.array(z.string()).default([]),
  priceLabel: z.string().min(1),
  priceNote: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  ctaLabel: z.string().default("Konsultasi Gratis"),
  ctaHref: z.string().default("#konsultasi"),
  sortOrder: z.number().int().default(0),
});

export const updateServiceSchema = createServiceSchema.partial().extend({
  updatedAt: z.string().min(1, "updatedAt wajib untuk optimistic locking"),
});

// --- PAGES ---
export const createPageSchema = z.object({
  site_id: z.string().min(1).default("nextkarya-main"),
  title: z.string().min(3).max(255),
  slug: z.string().min(2).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  content: z.any(),
  seoTitle: z.string().max(255).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
});

export const updatePageSchema = createPageSchema.partial().extend({
  updatedAt: z.string().min(1, "updatedAt wajib untuk optimistic locking"),
});

// --- FAQS ---
export const createFaqSchema = z.object({
  site_id: z.string().min(1).default("nextkarya-main"),
  question: z.string().min(5).max(500),
  answer: z.string().min(5).max(5000),
  category: z.string().default("Umum"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateFaqSchema = createFaqSchema.partial().extend({
  updatedAt: z.string().min(1, "updatedAt wajib untuk optimistic locking"),
});

// --- TESTIMONIALS ---
export const createTestimonialSchema = z.object({
  site_id: z.string().min(1).default("nextkarya-main"),
  clientName: z.string().min(2).max(255),
  clientRole: z.string().min(2).max(255),
  companyName: z.string().optional().nullable(),
  content: z.string().min(5).max(2000),
  rating: z.number().int().min(1).max(5).default(5),
  avatarUrl: z.string().url().optional().nullable(),
  portfolioId: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  sortOrder: z.number().int().default(0),
});

export const updateTestimonialSchema = createTestimonialSchema.partial().extend({
  updatedAt: z.string().min(1, "updatedAt wajib untuk optimistic locking"),
});
