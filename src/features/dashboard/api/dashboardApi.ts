import type { CmsAnalyticsOverview } from "../types";

/**
 * Service API untuk modul Dashboard Analitik.
 * Berkomunikasi dengan Next.js Proxy BFF (/api/cms/analytics).
 */
export const dashboardApi = {
  /**
   * Mengambil ringkasan metrik analitik pengunjung dan konversi.
   * @param period Periode ringkasan, misalnya '30d' atau '7d'.
   * @returns Ringkasan analitik agensi digital.
   */
  getAnalyticsOverview: async (period = "30d"): Promise<CmsAnalyticsOverview | null> => {
    try {
      const res = await fetch(`/api/cms/analytics/overview?period=${encodeURIComponent(period)}`, {
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
};
