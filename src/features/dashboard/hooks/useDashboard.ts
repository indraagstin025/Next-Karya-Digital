"use client";

import { useCallback, useEffect, useState } from "react";
import type { CmsAnalyticsOverview } from "../types";
import { dashboardApi } from "../api/dashboardApi";

export function useDashboard(initialAnalytics?: CmsAnalyticsOverview | null) {
  const [analytics, setAnalytics] = useState<CmsAnalyticsOverview | null>(
    initialAnalytics || null
  );
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("30d");

  const refreshAnalytics = useCallback(async (selectedPeriod?: string) => {
    setLoading(true);
    try {
      const data = await dashboardApi.getAnalyticsOverview(selectedPeriod || period);
      if (data) {
        setAnalytics(data);
      }
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    if (!initialAnalytics) {
      refreshAnalytics();
    }
  }, [initialAnalytics, refreshAnalytics]);

  return {
    analytics,
    loading,
    period,
    setPeriod,
    refreshAnalytics,
  };
}
