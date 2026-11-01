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
  bounceRate: number;
  conversions: number;
  conversionRate: number;
}

export interface AnalyticsTrafficSource {
  source: string;
  label: string;
  pageviews: number;
  visitors: number;
  conversions: number;
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
  generatedAt?: string;
}

export interface DashboardEmergencyNotice {
  isFormLocked: boolean;
  isAlertActive: boolean;
  alertBanner?: string | null;
}
