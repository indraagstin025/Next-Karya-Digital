import type { MetadataRoute } from "next";
import { getPublicArticles, getPublicPortfolios } from "@/lib/public-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nextkarya.web.id";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/layanan`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portofolio`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tentang-kami`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kebijakan-privasi`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/syarat-ketentuan`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const [articles, portfolios] = await Promise.all([
      getPublicArticles(50),
      getPublicPortfolios(),
    ]);

    const articleRoutes: MetadataRoute.Sitemap = (articles ?? []).map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const portfolioRoutes: MetadataRoute.Sitemap = (portfolios ?? []).map((portfolio) => ({
      url: `${baseUrl}/portofolio/${portfolio.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...articleRoutes, ...portfolioRoutes];
  } catch {
    return staticRoutes;
  }
}
