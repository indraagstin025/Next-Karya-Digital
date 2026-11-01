"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { dashboardApi, type PeriodFilter } from "@/features/dashboard";
import type {
  ActiveTab,
  CmsAnalyticsOverview,
  CmsCategory,
  CmsEmergencyOverview,
  CmsFaq,
  CmsLeadItem,
  CmsMediaItem,
  CmsPageItem,
  CmsPortfolio,
  CmsPost,
  CmsRedirectItem,
  CmsScheduleItem,
  CmsServiceItem,
  CmsStaffMember,
  CmsTestimonial,
  StructuredSubTab,
} from "../types";

export function useCmsData() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTabState] = useState<ActiveTab>("dashboard");
  const [subTab, setSubTabState] = useState<StructuredSubTab>("faqs");

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CmsCategory[]>([]);
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [portfolios, setPortfolios] = useState<CmsPortfolio[]>([]);
  const [services, setServices] = useState<CmsServiceItem[]>([]);
  const [faqs, setFaqs] = useState<CmsFaq[]>([]);
  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>([]);
  const [pages, setPages] = useState<CmsPageItem[]>([]);
  const [redirects, setRedirects] = useState<CmsRedirectItem[]>([]);
  const [mediaItems, setMediaItems] = useState<CmsMediaItem[]>([]);
  const [staffUsers, setStaffUsers] = useState<CmsStaffMember[]>([]);
  const [leads, setLeads] = useState<CmsLeadItem[]>([]);
  const [schedules, setSchedules] = useState<CmsScheduleItem[]>([]);
  const [analyticsOverview, setAnalyticsOverview] = useState<CmsAnalyticsOverview | null>(null);
  const [emergencyOverview, setEmergencyOverview] = useState<CmsEmergencyOverview | null>(null);

  // Sync tab with URL query parameter
  useEffect(() => {
    const rawTab = searchParams.get("tab");
    const validTabs: ActiveTab[] = [
      "dashboard",
      "posts",
      "portfolios",
      "services",
      "structured",
      "media",
      "crm",
      "emergency",
      "profile",
    ];

    if (rawTab && validTabs.includes(rawTab as ActiveTab)) {
      setActiveTabState(rawTab as ActiveTab);
    }

    const rawSub = searchParams.get("sub");
    const validSubs: StructuredSubTab[] = ["faqs", "testimonials", "pages", "redirects"];
    if (rawSub && validSubs.includes(rawSub as StructuredSubTab)) {
      setSubTabState(rawSub as StructuredSubTab);
    }
  }, [searchParams]);

  const setActiveTab = useCallback(
    (tab: ActiveTab) => {
      setActiveTabState(tab);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      if (tab !== "structured") {
        params.delete("sub");
      }
      router.replace(`/cms?${params.toString()}`);
    },
    [router, searchParams]
  );

  const setStructuredSubTab = useCallback(
    (sub: StructuredSubTab) => {
      setSubTabState(sub);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", "structured");
      params.set("sub", sub);
      router.replace(`/cms?${params.toString()}`);
    },
    [router, searchParams]
  );

  const loadWorkspaceData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        catRes,
        postRes,
        portRes,
        svcRes,
        faqRes,
        testiRes,
        pageRes,
        redirRes,
        mediaRes,
        usersRes,
        emRes,
        leadsRes,
        schedulesRes,
        analyticsRes,
        pagesRes,
        sourcesRes,
      ] = await Promise.all([
        fetch("/api/cms/categories"),
        fetch("/api/cms/posts?limit=50"),
        fetch("/api/cms/portfolios?limit=50"),
        fetch("/api/cms/services"),
        fetch("/api/cms/faqs"),
        fetch("/api/cms/testimonials"),
        fetch("/api/cms/pages"),
        fetch("/api/cms/redirects"),
        fetch("/api/cms/media?limit=50"),
        fetch("/api/cms/users"),
        fetch("/api/cms/emergency/overview?limit=25"),
        fetch("/api/cms/crm/leads?limit=50"),
        fetch("/api/cms/crm/schedules"),
        fetch("/api/cms/analytics/overview"),
        fetch("/api/cms/analytics/pages?limit=10"),
        fetch("/api/cms/analytics/sources"),
      ]);

      if (catRes.status === 401 || postRes.status === 401) {
        router.push("/");
        return;
      }

      const [
        catJson,
        postJson,
        portJson,
        svcJson,
        faqJson,
        testiJson,
        pageJson,
        redirJson,
        mediaJson,
        usersJson,
        emJson,
        leadsJson,
        schedJson,
        analyticsJson,
        pagesJson,
        sourcesJson,
      ] = await Promise.all([
        catRes.json().catch(() => null),
        postRes.json().catch(() => null),
        portRes.json().catch(() => null),
        svcRes.json().catch(() => null),
        faqRes.json().catch(() => null),
        testiRes.json().catch(() => null),
        pageRes.json().catch(() => null),
        redirRes.json().catch(() => null),
        mediaRes.json().catch(() => null),
        usersRes.json().catch(() => null),
        emRes.json().catch(() => null),
        leadsRes.json().catch(() => null),
        schedulesRes.json().catch(() => null),
        analyticsRes.json().catch(() => null),
        pagesRes.json().catch(() => null),
        sourcesRes.json().catch(() => null),
      ]);

      if (catJson?.success && Array.isArray(catJson.data)) setCategories(catJson.data);
      if (postJson?.success && Array.isArray(postJson.data)) setPosts(postJson.data);
      if (portJson?.success && Array.isArray(portJson.data)) setPortfolios(portJson.data);
      if (svcJson?.success && Array.isArray(svcJson.data)) setServices(svcJson.data);
      if (faqJson?.success && Array.isArray(faqJson.data)) setFaqs(faqJson.data);
      if (testiJson?.success && Array.isArray(testiJson.data)) setTestimonials(testiJson.data);
      if (pageJson?.success && Array.isArray(pageJson.data)) setPages(pageJson.data);
      if (redirJson?.success && Array.isArray(redirJson.data)) setRedirects(redirJson.data);
      if (mediaJson?.success && Array.isArray(mediaJson.data)) setMediaItems(mediaJson.data);
      if (usersJson?.success && Array.isArray(usersJson.data)) setStaffUsers(usersJson.data);
      if (leadsJson?.success && Array.isArray(leadsJson.data)) setLeads(leadsJson.data);
      if (schedJson?.success && Array.isArray(schedJson.data)) setSchedules(schedJson.data);
      if (analyticsJson?.success && analyticsJson.data) {
        setAnalyticsOverview({
          ...analyticsJson.data,
          pages: pagesJson?.success && Array.isArray(pagesJson.data) ? pagesJson.data : [],
          sources: sourcesJson?.success && Array.isArray(sourcesJson.data) ? sourcesJson.data : [],
        });
      }
      if (emJson?.success && emJson.data) setEmergencyOverview(emJson.data);
    } catch {
      // Error is caught gracefully
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadWorkspaceData();
  }, [loadWorkspaceData]);

  const refreshAnalyticsByPeriod = useCallback(async (period: PeriodFilter) => {
    try {
      const data = await dashboardApi.getFullAnalytics(period);
      if (data) {
        setAnalyticsOverview(data as unknown as CmsAnalyticsOverview);
      }
    } catch {
      // Graceful fallback
    }
  }, []);

  const counts = {
    posts: posts.length,
    portfolios: portfolios.length,
    services: services.length,
    structured: faqs.length + testimonials.length + pages.length + redirects.length,
    media: mediaItems.length,
    leads: leads.length,
    emergency: emergencyOverview?.emergencyLogs?.length || 0,
  };

  return {
    activeTab,
    setActiveTab,
    subTab,
    setStructuredSubTab,
    loading,
    refreshAll: loadWorkspaceData,
    loadWorkspaceData,
    counts,
    categories,
    setCategories,
    posts,
    setPosts,
    portfolios,
    setPortfolios,
    services,
    setServices,
    faqs,
    setFaqs,
    testimonials,
    setTestimonials,
    pages,
    setPages,
    redirects,
    setRedirects,
    mediaItems,
    setMediaItems,
    staffUsers,
    setStaffUsers,
    leads,
    setLeads,
    schedules,
    setSchedules,
    analyticsOverview,
    refreshAnalyticsByPeriod,
    emergencyOverview,
    setEmergencyOverview,
  };
}
