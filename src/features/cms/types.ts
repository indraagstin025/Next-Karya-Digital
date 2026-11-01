export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface CmsStaffMember {
  id: string;
  email: string;
  fullName: string;
  role: "STAFF";
  jobTitle: string;
  avatarUrl: string | null;
  isActive?: boolean;
  tokenVersion?: number;
  updatedAt?: string;
}

export interface CmsCategory {
  id: string;
  site_id: string;
  name: string;
  slug: string;
  _count?: {
    posts: number;
  };
}

export interface CmsPost {
  id: string;
  site_id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: any;
  coverUrl: string | null;
  coverAlt: string | null;
  tags: string[];
  readingTimeMinutes: number;
  seoTitle: string | null;
  seoDescription: string | null;
  status: ContentStatus;
  categoryId: string;
  publishedAt: string | null;
  updatedAt: string;
  category?: { id: string; name: string; slug: string };
  author?: { id: string; fullName: string; jobTitle: string };
  lastEditor?: { id: string; fullName: string };
}

export interface CmsPortfolio {
  id: string;
  site_id: string;
  slug: string;
  title: string;
  clientName: string;
  serviceCategory: string;
  summary: string;
  impactSummary: string | null;
  metricResult: string | null;
  technologies: string[];
  thumbnailUrl: string | null;
  thumbnailAlt: string | null;
  projectUrl: string | null;
  content: any;
  isFeatured: boolean;
  sortOrder: number;
  status: ContentStatus;
  publishedAt: string | null;
  updatedAt: string;
  lastEditor?: { id: string; fullName: string };
}

export interface CmsServiceItem {
  id: string;
  site_id: string;
  slug: string;
  title: string;
  icon: string;
  shortDesc: string;
  features: string[];
  priceLabel: string;
  priceNote: string | null;
  badge: string | null;
  ctaLabel: string;
  ctaHref: string;
  sortOrder: number;
  status: ContentStatus;
  updatedAt: string;
  lastEditor?: { id: string; fullName: string };
}

export interface CmsFaq {
  id: string;
  site_id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  updatedAt: string;
}

export interface CmsTestimonial {
  id: string;
  site_id: string;
  clientName: string;
  clientRole: string | null;
  companyName: string | null;
  content: string;
  rating: number;
  avatarUrl: string | null;
  portfolioId: string | null;
  sortOrder: number;
  status: ContentStatus;
  updatedAt: string;
  portfolio?: { id: string; title: string; slug: string } | null;
}

export interface CmsPageItem {
  id: string;
  site_id: string;
  slug: string;
  title: string;
  content: any;
  seoTitle: string | null;
  seoDescription: string | null;
  status: ContentStatus;
  updatedAt: string;
}

export interface CmsRedirectItem {
  id: string;
  site_id: string;
  sourcePath: string;
  targetPath: string;
  statusCode: number;
  createdAt: string;
}

export interface CmsSnapshotItem {
  id: string;
  site_id: string;
  entityType: "POST" | "PORTFOLIO" | "SERVICE" | "PAGE";
  entityId: string;
  version: number;
  title: string;
  snapshotPayload: any;
  createdAt: string;
  author?: { id: string; fullName: string };
}

export interface CmsMediaItem {
  id: string;
  site_id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  width?: number | null;
  height?: number | null;
  url: string;
  altText: string | null;
  createdAt: string;
  uploadedBy?: { fullName: string };
  isDuplicate?: boolean;
}

export interface CmsEmergencyOverview {
  site: {
    id: string;
    name: string;
    domain: string;
    isActive: boolean;
    isFormLocked: boolean;
    alertBanner: string | null;
    isAlertActive: boolean;
    updatedAt: string;
  } | null;
  emergencyLogs: {
    id: string;
    actionType: string;
    targetEntity: string;
    targetId: string;
    reason: string;
    createdAt: string;
    actor?: { id: string; fullName: string; email: string; jobTitle: string };
  }[];
  activityLogs: {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    summary: string;
    createdAt: string;
    actor?: { id: string; fullName: string; email: string; jobTitle: string };
  }[];
}

export type LeadStatus = "BARU" | "DIHUBUNGI" | "PROPOSAL" | "DEAL" | "BATAL";

export interface CmsLeadItem {
  id: string;
  site_id: string;
  clientName: string;
  companyName: string | null;
  whatsappNumber: string;
  email: string | null;
  serviceRequested: string;
  message: string | null;
  dealValue: number;
  status: LeadStatus;
  assignedToId: string | null;
  nextFollowUpDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    fullName: string;
    email?: string;
  } | null;
}

export interface CmsScheduleItem {
  id: string;
  site_id: string;
  leadId: string | null;
  taskName: string;
  assignedToId: string;
  startDate: string;
  endDate: string;
  status: "PERSIAPAN" | "BERJALAN" | "REVIEW" | "SELESAI";
  updatedAt: string;
  assignedTo?: {
    id: string;
    fullName: string;
  } | null;
  lead?: {
    id: string;
    clientName: string;
    companyName: string | null;
  } | null;
}

export interface CmsAnalyticsOverview {
  site_id: string;
  period: {
    from: string;
    to: string;
  };
  metrics: {
    visitors: number;
    visitorsChange: number;
    sessions: number;
    sessionsChange: number;
    pageviews: number;
    pageviewsChange: number;
    averageDurationSec: number;
    averageDurationChange: number;
    bounceRate: number;
    bounceRateChange: number;
    whatsappClicks: number;
    formSubmits: number;
    conversions: number;
    conversionsChange: number;
    conversionRate: number;
    conversionRateChange: number;
  };
}

export interface CmsAnalyticsPage {
  path: string;
  pageviews: number;
  visitors: number;
  bounceRate: number;
  conversions: number;
  conversionRate: number;
}

export type ActiveTab =
  | "dashboard"
  | "posts"
  | "portfolios"
  | "services"
  | "structured"
  | "media"
  | "crm"
  | "emergency"
  | "profile";

export type StructuredSubTab = "faqs" | "testimonials" | "pages" | "redirects";

export interface CmsAnalyticsSource {
  source: string;
  label: string;
  pageviews: number;
  visitors: number;
  conversions: number;
  sharePercentage: number;
}


