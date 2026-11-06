"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CmsAnalyticsOverview } from "../types";
import {
  dashboardApi,
  type AnalyticsDateRange,
  type PeriodFilter,
} from "../api/dashboardApi";

export function useDashboard(initialAnalytics?: CmsAnalyticsOverview | null) {
  const [analytics, setAnalytics] = useState<CmsAnalyticsOverview | null>(
    initialAnalytics || null
  );
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<PeriodFilter>("30d");
  const [range, setRange] = useState<AnalyticsDateRange | null>(null);
  const didInitialFetch = useRef(false);

  const refreshAnalytics = useCallback(
    async (
      selectedPeriod: PeriodFilter = period,
      selectedRange: AnalyticsDateRange | null = range
    ) => {
      setLoading(true);
      try {
        const data = await dashboardApi.getFullAnalytics(
          selectedPeriod,
          selectedPeriod === "custom" ? selectedRange : null
        );
        if (data) {
          setAnalytics(data);
        }
      } finally {
        setLoading(false);
      }
    },
    [period, range]
  );

  const changePeriod = useCallback(
    (newPeriod: PeriodFilter, newRange: AnalyticsDateRange | null = null) => {
      setPeriod(newPeriod);
      setRange(newPeriod === "custom" ? newRange : null);
      void refreshAnalytics(
        newPeriod,
        newPeriod === "custom" ? newRange : null
      );
    },
    [refreshAnalytics]
  );

  useEffect(() => {
    if (didInitialFetch.current) return;
    didInitialFetch.current = true;

    if (!initialAnalytics) {
      // Initial fetch only; later period changes call changePeriod explicitly.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void refreshAnalytics("30d", null);
    }
  }, [initialAnalytics, refreshAnalytics]);

  return {
    analytics,
    loading,
    period,
    range,
    setPeriod: changePeriod,
    refreshAnalytics,
  };
}
