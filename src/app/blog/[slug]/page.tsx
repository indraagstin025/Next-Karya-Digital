import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { BlogDetailPage } from "@/features/blog/pages/BlogDetailPage";
import {
  findSafeRedirect,
  getPublicArticleBySlug,
  getRelatedArticles,
} from "@/lib/public-content";
import { parsePublicSlug } from "@/lib/public-validators";

type Props = { params: Promise<{ slug: string }> };

const SITE_NAME = "Next Karya Digital Solutions";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = parsePublicSlug((await params).slug);
  if (!slug) return { title: `Artikel tidak ditemukan - ${SITE_NAME}`, robots: { index: false } };

  const article = await getPublicArticleBySlug(slug);
  if (!article || article === "missing") {
    return { title: `Artikel tidak ditemukan - ${SITE_NAME}`, robots: { index: false } };
  }

  const title = article.seoTitle || `${article.title} - ${SITE_NAME}`;
  const description = article.seoDescription || article.excerpt;
  const canonical = `/blog/${article.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      publishedTime: article.publishedAt ?? undefined,
      section: article.categoryName,
      tags: article.tags.map((tag) => tag.name),
    },
  };
}

export default async function Page({ params }: Props) {
  const rawSlug = (await params).slug;
  const slug = parsePublicSlug(rawSlug);
  if (!slug) notFound();

  const article = await getPublicArticleBySlug(slug);

  // A failed read must surface as an error, never as a 404 that could be cached or indexed.
  if (article === null) {
    throw new Error("Public article lookup failed.");
  }

  if (article === "missing") {
    const target = await findSafeRedirect(`/blog/${slug}`);
    if (target) {
      if (target.status === 301 || target.status === 308) {
        permanentRedirect(target.to);
      }
      redirect(target.to);
    }
    notFound();
  }

  // The canonical slug is lowercase, so a differently cased URL redirects to it.
  if (rawSlug !== article.slug) {
    permanentRedirect(`/blog/${article.slug}`);
  }

  const related = await getRelatedArticles(article.id, article.categoryId);

  return <BlogDetailPage article={article} related={related} />;
}
