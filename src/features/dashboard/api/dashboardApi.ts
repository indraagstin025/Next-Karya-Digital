import type {
  AnalyticsAudience,
  AnalyticsContentClicks,
  AnalyticsDeviceItem,
  AnalyticsPageRank,
  AnalyticsTrafficSource,
  CmsAnalyticsOverview,
} from "../types";
import {
  resolveDateRange,
  type AnalyticsDateRange,
  type PeriodFilter,
} from "../date-range";

export { formatDateInJakarta } from "../date-range";
export type { AnalyticsDateRange, PeriodFilter } from "../date-range";

/**
 * Service API untuk modul Dashboard Analitik.
 * Berkomunikasi dengan Next.js Proxy BFF (/api/cms/analytics/*).
 */
export const dashboardApi = {
  /**
   * Mengambil ringkasan metrik analitik pengunjung dan konversi.
   */
  getAnalyticsOverview: async (
    params?: { from?: string; to?: string; period?: string }
  ): Promise<CmsAnalyticsOverview | null> => {
    try {
      const q = new URLSearchParams();
      if (params?.from) q.set("from", params.from);
      if (params?.to) q.set("to", params.to);
      if (params?.period) q.set("period", params.period);

      const qs = q.toString() ? `?${q.toString()}` : "";
      const res = await fetch(`/api/cms/analytics/overview${qs}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();
      return json?.success && json?.data ? json.data : null;
    } catch (error) {
      console.error("[dashboardApi] getAnalyticsOverview error:", error);
      return null;
    }
  },

  /**
   * Mengambil peringkat halaman terpopuler berdasarkan jumlah tayangan.
   */
  getAnalyticsPages: async (
    limit = 10,
    params?: { from?: string; to?: string }
  ): Promise<AnalyticsPageRank[]> => {
    try {
      const q = new URLSearchParams({ limit: String(limit) });
      if (params?.from) q.set("from", params.from);
      if (params?.to) q.set("to", params.to);

      const res = await fetch(`/api/cms/analytics/pages?${q.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();
      return json?.success && Array.isArray(json?.data) ? json.data : [];
    } catch (error) {
      console.error("[dashboardApi] getAnalyticsPages error:", error);
      return [];
    }
  },

  /**
   * Mengambil saluran rujukan trafik (Google, Langsung, Instagram, Mitra).
   */
  getAnalyticsSources: async (
    params?: { from?: string; to?: string }
  ): Promise<AnalyticsTrafficSource[]> => {
    try {
      const q = new URLSearchParams();
      if (params?.from) q.set("from", params.from);
      if (params?.to) q.set("to", params.to);

      const qs = q.toString() ? `?${q.toString()}` : "";
      const res = await fetch(`/api/cms/analytics/sources${qs}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();
      return json?.success && Array.isArray(json?.data) ? json.data : [];
    } catch (error) {
      console.error("[dashboardApi] getAnalyticsSources error:", error);
      return [];
    }
  },

  /**
   * Mengambil rincian proporsi perangkat (Smartphone, Komputer, Tablet).
   */
  getAnalyticsDevices: async (
    params?: { from?: string; to?: string }
  ): Promise<AnalyticsDeviceItem[]> => {
    try {
      const q = new URLSearchParams();
      if (params?.from) q.set("from", params.from);
      if (params?.to) q.set("to", params.to);

      const qs = q.toString() ? `?${q.toString()}` : "";
      const res = await fetch(`/api/cms/analytics/devices${qs}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();
      return json?.success && Array.isArray(json?.data) ? json.data : [];
    } catch (error) {
      console.error("[dashboardApi] getAnalyticsDevices error:", error);
      return [];
    }
  },

  /**
   * Mengambil rincian browser dan sistem operasi pengunjung.
   */
  getAnalyticsAudience: async (
    params?: { from?: string; to?: string }
  ): Promise<AnalyticsAudience | null> => {
    try {
      const q = new URLSearchParams();
      if (params?.from) q.set("from", params.from);
      if (params?.to) q.set("to", params.to);

      const qs = q.toString() ? `?${q.toString()}` : "";
      const res = await fetch(`/api/cms/analytics/audience${qs}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();
      const data = json?.success ? json.data : null;
      if (!data) return null;

      return {
        browsers: Array.isArray(data.browsers) ? data.browsers : [],
        os: Array.isArray(data.os) ? data.os : [],
      };
    } catch (error) {
      console.error("[dashboardApi] getAnalyticsAudience error:", error);
      return null;
    }
  },

  /**
   * Mengambil peringkat klik tautan layanan dan portofolio.
   */
  getAnalyticsContentClicks: async (
    limit = 10,
    params?: { from?: string; to?: string }
  ): Promise<AnalyticsContentClicks | null> => {
    try {
      const q = new URLSearchParams({ limit: String(limit) });
      if (params?.from) q.set("from", params.from);
      if (params?.to) q.set("to", params.to);

      const res = await fetch(`/api/cms/analytics/content-clicks?${q.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const json = await res.json();
      const data = json?.success ? json.data : null;
      if (!data) return null;

      return {
        items: Array.isArray(data.items) ? data.items : [],
        totalServiceClicks: Number(data.totalServiceClicks) || 0,
        totalPortfolioClicks: Number(data.totalPortfolioClicks) || 0,
      };
    } catch (error) {
      console.error("[dashboardApi] getAnalyticsContentClicks error:", error);
      return null;
    }
  },

  /**
   * Mengambil paket lengkap analitik (Overview, Pages, Sources, Devices, Audience, Content Clicks).
   */
  getFullAnalytics: async (
    period: PeriodFilter = "30d",
    customRange?: AnalyticsDateRange | null
  ): Promise<CmsAnalyticsOverview | null> => {
    const range = resolveDateRange(period, customRange);

    try {
      const [
        overviewData,
        pagesData,
        sourcesData,
        devicesData,
        audienceData,
        contentClicksData,
      ] = await Promise.all([
        dashboardApi.getAnalyticsOverview(range),
        dashboardApi.getAnalyticsPages(10, range),
        dashboardApi.getAnalyticsSources(range),
        dashboardApi.getAnalyticsDevices(range),
        dashboardApi.getAnalyticsAudience(range),
        dashboardApi.getAnalyticsContentClicks(10, range),
      ]);

      if (!overviewData) return null;

      return {
        ...overviewData,
        pages: pagesData,
        sources: sourcesData,
        devices: devicesData.length > 0 ? devicesData : overviewData.devices,
        audience: audienceData ?? overviewData.audience,
        contentClicks: contentClicksData ?? overviewData.contentClicks,
      };
    } catch (error) {
      console.error("[dashboardApi] getFullAnalytics error:", error);
      return null;
    }
  },
};
