import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { PortfolioDetailPage } from "@/features/portfolio/pages/PortfolioDetailPage";
import { findSafeRedirect, getPublicPortfolioBySlug } from "@/lib/public-content";
import { parsePublicSlug } from "@/lib/public-validators";

type Props = { params: Promise<{ slug: string }> };

const SITE_NAME = "Next Karya Digital Solutions";

function toShareImage(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("/") || url.startsWith("https://")) return url;
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = parsePublicSlug((await params).slug);
  if (!slug) {
    return { title: `Portofolio tidak ditemukan - ${SITE_NAME}`, robots: { index: false } };
  }

  const portfolio = await getPublicPortfolioBySlug(slug);
  if (!portfolio || portfolio === "missing") {
    return { title: `Portofolio tidak ditemukan - ${SITE_NAME}`, robots: { index: false } };
  }

  const title = `${portfolio.title} - ${SITE_NAME}`;
  const description = portfolio.description;
  const canonical = `/portofolio/${portfolio.slug}`;
  const shareImage = toShareImage(portfolio.image);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      ...(shareImage
        ? { images: [{ url: shareImage, alt: portfolio.imageAlt || portfolio.title }] }
        : {}),
    },
    twitter: {
      card: shareImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(shareImage ? { images: [shareImage] } : {}),
    },
  };
}

export default async function Page({ params }: Props) {
  const rawSlug = (await params).slug;
  const slug = parsePublicSlug(rawSlug);
  if (!slug) notFound();

  const portfolio = await getPublicPortfolioBySlug(slug);

  // A failed read must surface as an error, never as a 404 that could be cached or indexed.
  if (portfolio === null) {
    throw new Error("Public portfolio lookup failed.");
  }

  if (portfolio === "missing") {
    const target = await findSafeRedirect(`/portofolio/${slug}`);
    if (target) {
      if (target.status === 301 || target.status === 308) {
        permanentRedirect(target.to);
      }
      redirect(target.to);
    }
    notFound();
  }

  if (rawSlug !== portfolio.slug) {
    permanentRedirect(`/portofolio/${portfolio.slug}`);
  }

  return <PortfolioDetailPage portfolio={portfolio} />;
}
