import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { fetchApi } from "@/lib/api-client";
import { withServerTimeout } from "@/lib/request-security";
import {
  cleanText,
  parseContentBlocks,
  resolvePortfolioImage,
  sanitizeInternalHref,
  type ContentBlock,
  type RedirectStatus,
} from "@/lib/public-validators";

const QUERY_TIMEOUT_MS = 8_000;
const REVALIDATE_SECONDS = 300;

export interface PublicServiceDTO {
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface PublicPortfolioDTO {
  id: string;
  category: string;
  categorySlug: "webapp" | "website" | "mobile";
  clientSector: string;
  title: string;
  description: string;
  tech: string[];
  impact: string;
  metric: string;
  image: string | null;
  imageAlt: string;
}

export interface PublicPricingPlanDTO {
  id: string;
  name: string;
  badge: string | null;
  isRecommended: boolean;
  priceNote: string;
  price: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface PublicFaqDTO {
  id: string;
  question: string;
  answer: string;
}

export interface PublicArticleSummaryDTO {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  readingTime: number;
  publishedAt: string | null;
  categoryName: string;
  categorySlug: string;
}

export interface PublicArticleDetailDTO extends PublicArticleSummaryDTO {
  seoTitle: string | null;
  seoDescription: string | null;
  categoryId: string;
  authorName: string;
  tags: { name: string; slug: string }[];
  blocks: ContentBlock[];
}

export interface PublicPageDTO {
  slug: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedLabel: string | null;
  blocks: ContentBlock[];
}

// Runs a cached read and degrades to null when API is slow or
// unreachable, so public pages can fall back to mock data instead of returning a 500.
async function safeRead<T>(label: string, run: () => Promise<T>): Promise<T | null> {
  try {
    return await withServerTimeout(run(), QUERY_TIMEOUT_MS, label);
  } catch (error) {
    console.error(
      `Public content read failed (${label}):`,
      error instanceof Error ? error.message : "unknown"
    );
    return null;
  }
}

function toPortfolioCategory(category: string): PublicPortfolioDTO["categorySlug"] {
  const lower = category.toLowerCase();
  if (lower.includes("mobile")) return "mobile";
  if (lower.includes("web internal") || lower.includes("sistem web")) return "webapp";
  return "website";
}

const readServices = unstable_cache(
  async (): Promise<PublicServiceDTO[]> => {
    const data = await fetchApi<any[]>("/services?site_id=nextkarya-main");
    if (!data || data.length === 0) return [];

    return data.map((item) => ({
      slug: item.slug,
      title: item.title,
      category: item.title,
      shortDesc: item.shortDesc,
      features: Array.isArray(item.features) ? item.features : [],
      ctaLabel: item.ctaLabel || "Konsultasi Gratis",
      ctaHref: sanitizeInternalHref(item.ctaHref || "#konsultasi"),
    }));
  },
  ["public-services"],
  { tags: ["public:services"], revalidate: REVALIDATE_SECONDS }
);

const readPortfolios = unstable_cache(
  async (): Promise<PublicPortfolioDTO[]> => {
    const data = await fetchApi<any[]>("/portfolios?site_id=nextkarya-main&limit=60");
    if (!data || data.length === 0) return [];

    return data.map((row) => ({
      id: row.id,
      category: row.serviceCategory || "Website",
      categorySlug: toPortfolioCategory(row.serviceCategory || "Website"),
      clientSector: row.clientName,
      title: row.title,
      description: row.summary,
      tech: Array.isArray(row.technologies) ? row.technologies : [],
      impact: row.impactSummary || "",
      metric: row.metricResult || "",
      image: resolvePortfolioImage(row.slug),
      imageAlt: row.title,
    }));
  },
  ["public-portfolios"],
  { tags: ["public:portfolios"], revalidate: REVALIDATE_SECONDS }
);

const readPricing = unstable_cache(
  async (): Promise<PublicPricingPlanDTO[]> => {
    const data = await fetchApi<any[]>("/services?site_id=nextkarya-main");
    if (!data || data.length === 0) return [];

    return data.map((item) => ({
      id: item.id,
      name: item.title,
      badge: item.badge || null,
      isRecommended: item.badge === "Paling Populer",
      priceNote: item.priceNote || "",
      price: item.priceLabel,
      description: item.shortDesc,
      features: Array.isArray(item.features) ? item.features : [],
      ctaLabel: item.ctaLabel || "Pilih Paket",
      ctaHref: sanitizeInternalHref(item.ctaHref || "#konsultasi"),
    }));
  },
  ["public-pricing"],
  { tags: ["public:pricing"], revalidate: REVALIDATE_SECONDS }
);

const readFaqs = unstable_cache(
  async (): Promise<PublicFaqDTO[]> => {
    const data = await fetchApi<any[]>("/faqs?site_id=nextkarya-main");
    if (!data || data.length === 0) return [];

    return data.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    }));
  },
  ["public-faqs"],
  { tags: ["public:faqs"], revalidate: REVALIDATE_SECONDS }
);

const readArticles = unstable_cache(
  async (limit: number): Promise<PublicArticleSummaryDTO[]> => {
    const data = await fetchApi<any[]>(`/articles?site_id=nextkarya-main&limit=${limit}`);
    if (!data || data.length === 0) return [];

    return data.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      readingTime: a.readingTimeMinutes || 3,
      publishedAt: a.publishedAt ? new Date(a.publishedAt).toISOString() : null,
      categoryName: a.category?.name || "Teknologi",
      categorySlug: a.category?.slug || "teknologi",
    }));
  },
  ["public-articles"],
  { tags: ["public:articles"], revalidate: REVALIDATE_SECONDS }
);

const readArticleBySlug = unstable_cache(
  async (slug: string): Promise<PublicArticleDetailDTO | "missing"> => {
    const data = await fetchApi<any>(`/articles/${slug}?site_id=nextkarya-main`);
    if (!data) return "missing";

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      readingTime: data.readingTimeMinutes || 3,
      publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : null,
      categoryName: data.category?.name || "Teknologi",
      categorySlug: data.category?.slug || "teknologi",
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.excerpt,
      categoryId: data.category?.id || "cat1",
      authorName: data.author?.fullName || "Tim Next Karya",
      tags: Array.isArray(data.tags)
        ? data.tags.map((t: string) => ({ name: cleanText(t, 60), slug: cleanText(t, 80) }))
        : [],
      blocks: parseContentBlocks(data.content),
    };
  },
  ["public-article-by-slug"],
  { tags: ["public:articles"], revalidate: REVALIDATE_SECONDS }
);

const readRelatedArticles = unstable_cache(
  async (_articleId: string, _categoryId: string): Promise<PublicArticleSummaryDTO[]> => {
    const data = await fetchApi<any[]>("/articles?site_id=nextkarya-main&limit=3");
    if (!data || data.length === 0) return [];

    return data.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      readingTime: a.readingTimeMinutes || 3,
      publishedAt: a.publishedAt ? new Date(a.publishedAt).toISOString() : null,
      categoryName: a.category?.name || "Teknologi",
      categorySlug: a.category?.slug || "teknologi",
    }));
  },
  ["public-related-articles"],
  { tags: ["public:articles"], revalidate: REVALIDATE_SECONDS }
);

const readPageBySlug = unstable_cache(
  async (slug: string): Promise<PublicPageDTO | null> => {
    const page = await fetchApi<any>(`/pages/${slug}?site_id=nextkarya-main`);
    if (!page) return null;

    const updatedLabel =
      typeof page.content === "object" &&
      page.content !== null &&
      "updatedLabel" in page.content
        ? cleanText((page.content as { updatedLabel?: unknown }).updatedLabel, 60)
        : "";

    return {
      slug: page.slug,
      title: page.title,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      updatedLabel: updatedLabel || null,
      blocks: parseContentBlocks(page.content),
    };
  },
  ["public-page-by-slug"],
  { tags: ["public:pages"], revalidate: REVALIDATE_SECONDS }
);

export const getPublicServices = cache(() => safeRead("services", () => readServices()));
export const getPublicPortfolios = cache(() => safeRead("portfolios", () => readPortfolios()));
export const getPublicPricing = cache(() => safeRead("pricing", () => readPricing()));
export const getPublicFaqs = cache(() => safeRead("faqs", () => readFaqs()));
export const getPublicArticles = cache((limit = 24) =>
  safeRead("articles", () => readArticles(Math.min(Math.max(limit, 1), 60)))
);
export const getPublicArticleBySlug = cache((slug: string) =>
  safeRead("article", () => readArticleBySlug(slug))
);
export const getRelatedArticles = cache((articleId: string, categoryId: string) =>
  safeRead("relatedArticles", () => readRelatedArticles(articleId, categoryId))
);
export const getPublicPage = cache((slug: string) =>
  safeRead("page", () => readPageBySlug(slug))
);

export async function findSafeRedirect(
  _fromPath: string
): Promise<{ to: string; status: RedirectStatus } | null> {
  return null;
}
