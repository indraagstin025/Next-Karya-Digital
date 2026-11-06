export interface AnalyticsMetrics {
  visitors: number;
  visitorsChange?: number;
  sessions: number;
  sessionsChange?: number;
  pageviews: number;
  pageviewsChange?: number;
  averageDurationSec: number;
  averageDurationChange?: number;
  bounceRate: number;
  bounceRateChange?: number;
  whatsappClicks: number;
  formSubmits: number;
  conversions: number;
  conversionsChange?: number;
  conversionRate: number;
  conversionRateChange?: number;
}

export interface AnalyticsPageRank {
  path: string;
  pageviews: number;
  visitors: number;
  averageDurationSec?: number;
  sharePercentage?: number;
  bounceRate: number;
  conversions: number;
  conversionRate: number;
}

export interface AnalyticsAudienceItem {
  name: string;
  pageviews: number;
  sharePercentage: number;
}

export interface AnalyticsAudience {
  browsers: AnalyticsAudienceItem[];
  os: AnalyticsAudienceItem[];
}

export interface AnalyticsContentClick {
  targetPath: string;
  type: "service" | "portfolio";
  clicks: number;
}

export interface AnalyticsContentClicks {
  items: AnalyticsContentClick[];
  totalServiceClicks: number;
  totalPortfolioClicks: number;
}

export interface AnalyticsTrafficSource {
  source: string;
  label: string;
  pageviews: number;
  visitors: number;
  conversions: number;
  sharePercentage: number;
}

export interface AnalyticsTimelineItem {
  date: string;
  visitors: number;
  pageviews: number;
  sessions: number;
  conversions: number;
}

export interface AnalyticsHourlyItem {
  hour: number;
  label: string;
  visitors: number;
  sessions: number;
  pageviews: number;
  conversions: number;
}

export interface AnalyticsDeviceItem {
  device: string;
  label: string;
  visitors: number;
  sharePercentage: number;
}

export interface CmsAnalyticsOverview {
  site_id?: string;
  period: {
    from: string;
    to: string;
  };
  metrics: AnalyticsMetrics;
  pages?: AnalyticsPageRank[];
  sources?: AnalyticsTrafficSource[];
  timeline?: AnalyticsTimelineItem[];
  hourly?: AnalyticsHourlyItem[];
  devices?: AnalyticsDeviceItem[];
  audience?: AnalyticsAudience;
  contentClicks?: AnalyticsContentClicks;
  generatedAt?: string;
}

export interface DashboardEmergencyNotice {
  isFormLocked: boolean;
  isAlertActive: boolean;
  alertBanner?: string | null;
}
