import "server-only";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { withServerTimeout } from "@/lib/request-security";
import {
  cleanText,
  parseContentBlocks,
  resolvePortfolioImage,
  sanitizeInternalHref,
  validateRedirectTarget,
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

// Runs a cached read and degrades to null when PostgreSQL is slow or
// unreachable, so public pages can fall back instead of returning a 500.
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

const livePublishedWhere = () => ({
  status: "PUBLISHED" as const,
  deletedAt: null,
  OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
});

function toPortfolioCategory(category: string): PublicPortfolioDTO["categorySlug"] {
  const lower = category.toLowerCase();
  if (lower.includes("mobile")) return "mobile";
  if (lower.includes("web internal") || lower.includes("sistem web")) return "webapp";
  return "website";
}

const readServices = unstable_cache(
  async (): Promise<PublicServiceDTO[]> => {
    const rows = await prisma.service.findMany({
      where: livePublishedWhere(),
      orderBy: { sortOrder: "asc" },
      take: 24,
      select: {
        slug: true,
        title: true,
        category: true,
        shortDesc: true,
        features: true,
        ctaLabel: true,
        ctaHref: true,
      },
    });
    return rows.map((row) => ({
      ...row,
      ctaHref: sanitizeInternalHref(row.ctaHref),
    }));
  },
  ["public-services"],
  { tags: ["public:services"], revalidate: REVALIDATE_SECONDS }
);

const readPortfolios = unstable_cache(
  async (): Promise<PublicPortfolioDTO[]> => {
    const rows = await prisma.portfolio.findMany({
      where: livePublishedWhere(),
      orderBy: { sortOrder: "asc" },
      take: 60,
      select: {
        id: true,
        slug: true,
        category: true,
        clientSector: true,
        title: true,
        summary: true,
        tech: true,
        impact: true,
        metric: true,
        imageAlt: true,
      },
    });
    return rows.map((row) => ({
      id: row.id,
      category: row.category,
      categorySlug: toPortfolioCategory(row.category),
      clientSector: row.clientSector,
      title: row.title,
      description: row.summary,
      tech: row.tech,
      impact: row.impact,
      metric: row.metric ?? "",
      image: resolvePortfolioImage(row.slug),
      imageAlt: row.imageAlt ?? row.title,
    }));
  },
  ["public-portfolios"],
  { tags: ["public:portfolios"], revalidate: REVALIDATE_SECONDS }
);

const readPricing = unstable_cache(
  async (): Promise<PublicPricingPlanDTO[]> => {
    const rows = await prisma.pricingPlan.findMany({
      where: livePublishedWhere(),
      orderBy: { sortOrder: "asc" },
      take: 24,
      select: {
        id: true,
        name: true,
        priceLabel: true,
        priceNote: true,
        description: true,
        features: true,
        badge: true,
        ctaLabel: true,
        ctaHref: true,
      },
    });
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      badge: row.badge,
      isRecommended: row.badge === "Paling Populer",
      priceNote: row.priceNote ?? "",
      price: row.priceLabel,
      description: row.description,
      features: row.features,
      ctaLabel: row.ctaLabel,
      ctaHref: sanitizeInternalHref(row.ctaHref),
    }));
  },
  ["public-pricing"],
  { tags: ["public:pricing"], revalidate: REVALIDATE_SECONDS }
);

const readFaqs = unstable_cache(
  async (): Promise<PublicFaqDTO[]> => {
    return prisma.faq.findMany({
      where: livePublishedWhere(),
      orderBy: { sortOrder: "asc" },
      take: 50,
      select: { id: true, question: true, answer: true },
    });
  },
  ["public-faqs"],
  { tags: ["public:faqs"], revalidate: REVALIDATE_SECONDS }
);

// Publication is checked against the PostgreSQL clock in UTC. Prisma stores
// DateTime as timestamp without time zone, so the app server's clock and the
// session time zone cannot shift the scheduled-publish boundary.
const PUBLISHED_GUARD = Prisma.sql`
  a.status = 'PUBLISHED'::"ContentStatus"
  AND a."deletedAt" IS NULL
  AND (a."publishedAt" IS NULL OR a."publishedAt" <= (NOW() AT TIME ZONE 'UTC'))
`;

interface ArticleSummaryRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  readingTime: number;
  publishedAt: Date | null;
  categoryName: string;
  categorySlug: string;
}

function toSummary(row: ArticleSummaryRow): PublicArticleSummaryDTO {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    readingTime: row.readingTime,
    publishedAt: row.publishedAt ? new Date(row.publishedAt).toISOString() : null,
    categoryName: row.categoryName,
    categorySlug: row.categorySlug,
  };
}

const readArticles = unstable_cache(
  async (limit: number): Promise<PublicArticleSummaryDTO[]> => {
    const rows = await prisma.$queryRaw<ArticleSummaryRow[]>`
      SELECT a.id, a.slug, a.title, a.excerpt, a."readingTime", a."publishedAt",
             c.name AS "categoryName", c.slug AS "categorySlug"
      FROM "Article" a
      JOIN "Category" c ON c.id = a."categoryId"
      WHERE ${PUBLISHED_GUARD}
      ORDER BY a."publishedAt" DESC NULLS LAST, a.id
      LIMIT ${limit}
    `;
    return rows.map(toSummary);
  },
  ["public-articles"],
  { tags: ["public:articles"], revalidate: REVALIDATE_SECONDS }
);

interface ArticleDetailRow extends ArticleSummaryRow {
  seoTitle: string | null;
  seoDescription: string | null;
  categoryId: string;
  authorName: string;
  content: unknown;
  tags: unknown;
}

function parseTags(raw: unknown): { name: string; slug: string }[] {
  if (!Array.isArray(raw)) return [];
  const tags: { name: string; slug: string }[] = [];
  for (const item of raw.slice(0, 20)) {
    if (typeof item !== "object" || item === null) continue;
    const { name, slug } = item as { name?: unknown; slug?: unknown };
    if (typeof name === "string" && typeof slug === "string") {
      tags.push({ name: cleanText(name, 60), slug: cleanText(slug, 80) });
    }
  }
  return tags;
}

const readArticleBySlug = unstable_cache(
  async (slug: string): Promise<PublicArticleDetailDTO | "missing"> => {
    const rows = await prisma.$queryRaw<ArticleDetailRow[]>`
      SELECT a.id, a.slug, a.title, a.excerpt, a."readingTime", a."publishedAt",
             a."seoTitle", a."seoDescription", a.content, a."categoryId",
             c.name AS "categoryName", c.slug AS "categorySlug",
             u.name AS "authorName",
             COALESCE((
               SELECT json_agg(json_build_object('name', t.name, 'slug', t.slug) ORDER BY t.name)
               FROM "_ArticleTags" atg
               JOIN "Tag" t ON t.id = atg."B"
               WHERE atg."A" = a.id
             ), '[]'::json) AS tags
      FROM "Article" a
      JOIN "Category" c ON c.id = a."categoryId"
      JOIN "User" u ON u.id = a."authorId"
      WHERE a.slug = ${slug} AND ${PUBLISHED_GUARD}
      LIMIT 1
    `;
    const row = rows[0];
    if (!row) return "missing";
    return {
      ...toSummary(row),
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      categoryId: row.categoryId,
      authorName: row.authorName,
      tags: parseTags(row.tags),
      blocks: parseContentBlocks(row.content),
    };
  },
  ["public-article-by-slug"],
  { tags: ["public:articles"], revalidate: REVALIDATE_SECONDS }
);

// Relevance score: manual pin (+100), shared tags (+10 each), same category (+3).
const readRelatedArticles = unstable_cache(
  async (articleId: string, categoryId: string): Promise<PublicArticleSummaryDTO[]> => {
    const rows = await prisma.$queryRaw<ArticleSummaryRow[]>`
      SELECT a.id, a.slug, a.title, a.excerpt, a."readingTime", a."publishedAt",
             c.name AS "categoryName", c.slug AS "categorySlug"
      FROM "Article" a
      JOIN "Category" c ON c.id = a."categoryId"
      LEFT JOIN "ArticleRelated" ar
        ON ar."articleId" = ${articleId} AND ar."relatedId" = a.id
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::int AS overlap
        FROM "_ArticleTags" x
        JOIN "_ArticleTags" y ON y."B" = x."B" AND y."A" = ${articleId}
        WHERE x."A" = a.id
      ) tg ON TRUE
      WHERE a.id <> ${articleId} AND ${PUBLISHED_GUARD}
      ORDER BY
        (CASE WHEN ar."relatedId" IS NOT NULL THEN 100 ELSE 0 END
          + COALESCE(tg.overlap, 0) * 10
          + CASE WHEN a."categoryId" = ${categoryId} THEN 3 ELSE 0 END) DESC,
        a."publishedAt" DESC NULLS LAST, a.id
      LIMIT 3
    `;
    return rows.map(toSummary);
  },
  ["public-related-articles"],
  { tags: ["public:articles"], revalidate: REVALIDATE_SECONDS }
);

const readPageBySlug = unstable_cache(
  async (slug: string): Promise<PublicPageDTO | null> => {
    const page = await prisma.page.findFirst({
      where: { slug, ...livePublishedWhere() },
      select: {
        slug: true,
        title: true,
        seoTitle: true,
        seoDescription: true,
        content: true,
      },
    });
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
  fromPath: string
): Promise<{ to: string; status: RedirectStatus } | null> {
  const row = await safeRead("redirect", () =>
    prisma.redirect.findUnique({
      where: { from: fromPath },
      select: { to: true, status: true },
    })
  );
  if (!row) return null;
  return validateRedirectTarget(row.to, row.status);
}
