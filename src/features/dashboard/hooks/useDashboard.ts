"use client";

import { useCallback, useEffect, useState } from "react";
import type { CmsAnalyticsOverview } from "../types";
import { dashboardApi, type PeriodFilter } from "../api/dashboardApi";

export function useDashboard(initialAnalytics?: CmsAnalyticsOverview | null) {
  const [analytics, setAnalytics] = useState<CmsAnalyticsOverview | null>(
    initialAnalytics || null
  );
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<PeriodFilter>("30d");

  const refreshAnalytics = useCallback(async (selectedPeriod?: PeriodFilter) => {
    const targetPeriod = selectedPeriod || period;
    setLoading(true);
    try {
      const data = await dashboardApi.getFullAnalytics(targetPeriod);
      if (data) {
        setAnalytics(data);
      }
    } finally {
      setLoading(false);
    }
  }, [period]);

  const changePeriod = useCallback((newPeriod: PeriodFilter) => {
    setPeriod(newPeriod);
    refreshAnalytics(newPeriod);
  }, [refreshAnalytics]);

  useEffect(() => {
    if (!initialAnalytics) {
      refreshAnalytics("30d");
    }
  }, [initialAnalytics, refreshAnalytics]);

  return {
    analytics,
    loading,
    period,
    setPeriod: changePeriod,
    refreshAnalytics,
  };
}
