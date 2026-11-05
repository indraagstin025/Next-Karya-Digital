import type {
  AnalyticsDeviceItem,
  AnalyticsPageRank,
  AnalyticsTrafficSource,
  CmsAnalyticsOverview,
} from "../types";

export type PeriodFilter = "today" | "7d" | "30d";

const JAKARTA_TIME_ZONE = "Asia/Jakarta";
const DAY_MS = 24 * 60 * 60 * 1000;
const jakartaDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: JAKARTA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatDateInJakarta(date: Date): string {
  const parts = jakartaDateFormatter.formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return date.toISOString().slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}

function resolveDateRange(period: PeriodFilter): { from: string; to: string } {
  const now = new Date();
  const daysBack = period === "today" ? 0 : period === "7d" ? 6 : 29;

  return {
    from: formatDateInJakarta(new Date(now.getTime() - daysBack * DAY_MS)),
    to: formatDateInJakarta(now),
  };
}

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
   * Mengambil paket lengkap analitik (Overview, Pages, Sources, Devices) sekaligus.
   */
  getFullAnalytics: async (
    period: PeriodFilter = "30d"
  ): Promise<CmsAnalyticsOverview | null> => {
    const range = resolveDateRange(period);

    try {
      const [overviewData, pagesData, sourcesData, devicesData] = await Promise.all([
        dashboardApi.getAnalyticsOverview(range),
        dashboardApi.getAnalyticsPages(10, range),
        dashboardApi.getAnalyticsSources(range),
        dashboardApi.getAnalyticsDevices(range),
      ]);

      if (!overviewData) return null;

      return {
        ...overviewData,
        pages: pagesData,
        sources: sourcesData,
        devices: devicesData.length > 0 ? devicesData : overviewData.devices,
      };
    } catch (error) {
      console.error("[dashboardApi] getFullAnalytics error:", error);
      return null;
    }
  },
};
