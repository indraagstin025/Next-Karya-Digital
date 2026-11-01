export interface AnalyticsMetrics {
  visitors: number;
  pageviews: number;
  whatsappClicks: number;
  formSubmits: number;
  conversions: number;
  conversionRate: number;
  bounceRate?: number;
  visitorsChange?: number;
  pageviewsChange?: number;
  conversionsChange?: number;
  conversionRateChange?: number;
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
  period:
    | string
    | {
        from: string;
        to: string;
      };
  metrics: AnalyticsMetrics;
  sources?: AnalyticsTrafficSource[];
  generatedAt?: string;
}

export interface DashboardEmergencyNotice {
  isFormLocked: boolean;
  isAlertActive: boolean;
  alertBanner?: string | null;
}
