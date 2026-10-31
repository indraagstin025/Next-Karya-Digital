import React from "react";
import {
  GlobeIcon,
  LayersIcon,
  MobileIcon,
} from "@radix-ui/react-icons";
import type {
  PublicFaqDTO,
  PublicPortfolioDTO,
  PublicPricingPlanDTO,
  PublicServiceDTO,
} from "@/lib/public-content";
import {
  FAQ_ITEMS,
  PORTFOLIO_TEASERS,
  PRICING_PLANS,
} from "@/features/home/data/homeData";
import type {
  FaqItem,
  PortfolioTeaserItem,
  PricingPlan,
} from "@/features/home/types";
import {
  PORTFOLIO_CASES,
  type PortfolioProject,
} from "@/features/portfolio/data/portfolioData";

// Each adapter returns the bundled static copy only when the database read
// failed (null). An empty array from PostgreSQL stays empty on purpose, so an
// editor who unpublishes everything does not see stale content reappear.

function portfolioIcon(slug: PublicPortfolioDTO["categorySlug"]) {
  if (slug === "mobile") return <MobileIcon className="h-5 w-5" />;
  if (slug === "webapp") return <LayersIcon className="h-5 w-5" />;
  return <GlobeIcon className="h-5 w-5" />;
}

export function toPortfolioTeasers(
  items: PublicPortfolioDTO[] | null | undefined
): PortfolioTeaserItem[] {
  if (!items) return PORTFOLIO_TEASERS;
  return items.map((item) => ({
    id: item.id,
    category: item.category,
    categorySlug: item.categorySlug,
    clientSector: item.clientSector,
    title: item.title,
    description: item.description,
    tech: item.tech,
    businessImpact: item.impact,
    metric: item.metric,
    image: item.image ?? "",
    imageAlt: item.imageAlt,
    icon: portfolioIcon(item.categorySlug),
  }));
}

export function toPortfolioCases(
  items: PublicPortfolioDTO[] | null | undefined
): PortfolioProject[] {
  if (!items) return PORTFOLIO_CASES;
  return items.map((item) => ({
    id: item.id,
    category: item.category,
    categorySlug: item.categorySlug,
    clientSector: item.clientSector,
    title: item.title,
    description: item.description,
    tech: item.tech,
    impact: item.impact,
    metric: item.metric,
    image: item.image ?? "",
    imageAlt: item.imageAlt,
    icon: portfolioIcon(item.categorySlug),
  }));
}

export function toPricingPlans(
  items: PublicPricingPlanDTO[] | null | undefined
): PricingPlan[] {
  if (!items) return PRICING_PLANS;
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    badge: item.badge ?? undefined,
    isRecommended: item.isRecommended,
    priceLabel: item.priceNote,
    price: item.price,
    description: item.description,
    features: item.features,
    ctaText: item.ctaLabel,
    ctaHref: item.ctaHref,
  }));
}

export function toFaqItems(items: PublicFaqDTO[] | null | undefined): FaqItem[] {
  if (!items) return FAQ_ITEMS;
  return items.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));
}

export interface ServiceCopy {
  title: string;
  description: string;
  tags: string[];
}

export function pickServiceCopy(
  services: PublicServiceDTO[] | null | undefined,
  slug: string,
  fallback: ServiceCopy
): ServiceCopy {
  const match = services?.find((service) => service.slug === slug);
  if (!match) return fallback;
  return {
    title: match.title,
    description: match.shortDesc,
    tags: match.features.length > 0 ? match.features : fallback.tags,
  };
}
