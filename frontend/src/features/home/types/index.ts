import React from "react";

export interface ConsultationFormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

export interface FormStatus {
  type: "idle" | "sending" | "success" | "error";
  message: string;
}

export interface HighlightItem {
  icon: React.ReactNode;
  label: string;
}

export interface ServiceTeaserItem {
  id: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  linkText: string;
  linkHref: string;
  icon: React.ReactNode;
}

export interface WorkflowStepItem {
  stepNumber: string;
  badge: string;
  title: string;
  description: string;
  output: string;
  milestone?: string;
  icon: React.ReactNode;
  image: string;
  deliverables?: string[];
}

export interface PortfolioTeaserItem {
  id: string;
  category: string;
  categorySlug: "all" | "webapp" | "website" | "mobile";
  clientSector: string;
  title: string;
  description: string;
  tech: string[];
  businessImpact: string;
  metric: string;
  image: string;
  imageAlt: string;
  icon: React.ReactNode;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  isRecommended?: boolean;
  priceLabel: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ContactInfoItem {
  icon: React.ReactNode;
  title: string;
  content: string;
  isLink?: boolean;
  linkHref?: string;
}
