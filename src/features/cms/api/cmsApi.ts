import type {
  CmsCategory,
  CmsEmergencyOverview,
  CmsFaq,
  CmsMediaItem,
  CmsPageItem,
  CmsPortfolio,
  CmsPost,
  CmsRedirectItem,
  CmsServiceItem,
  CmsStaffMember,
  CmsTestimonial,
} from "../types";

/**
 * Service API untuk modul CMS Konten & Media.
 * Berkomunikasi dengan Next.js Proxy BFF (/api/cms).
 */
export const cmsApi = {
  /**
   * Mengambil seluruh data koleksi konten CMS secara paralel.
   */
  fetchAllContent: async () => {
    try {
      const endpoints = [
        "/api/cms/posts",
        "/api/cms/categories",
        "/api/cms/portfolios",
        "/api/cms/services",
        "/api/cms/faqs",
        "/api/cms/testimonials",
        "/api/cms/pages",
        "/api/cms/redirects",
        "/api/cms/media",
        "/api/cms/users",
        "/api/cms/emergency/overview",
      ];

      const responses = await Promise.all(
        endpoints.map((ep) =>
          fetch(ep, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
            .then((r) => (r.ok ? r.json() : { success: false, data: [] }))
            .catch(() => ({ success: false, data: [] }))
        )
      );

      const [
        postsRes,
        catRes,
        portRes,
        servRes,
        faqsRes,
        testiRes,
        pagesRes,
        redirRes,
        mediaRes,
        usersRes,
        emRes,
      ] = responses;

      return {
        posts: (postsRes?.success && Array.isArray(postsRes.data) ? postsRes.data : []) as CmsPost[],
        categories: (catRes?.success && Array.isArray(catRes.data) ? catRes.data : []) as CmsCategory[],
        portfolios: (portRes?.success && Array.isArray(portRes.data) ? portRes.data : []) as CmsPortfolio[],
        services: (servRes?.success && Array.isArray(servRes.data) ? servRes.data : []) as CmsServiceItem[],
        faqs: (faqsRes?.success && Array.isArray(faqsRes.data) ? faqsRes.data : []) as CmsFaq[],
        testimonials: (testiRes?.success && Array.isArray(testiRes.data) ? testiRes.data : []) as CmsTestimonial[],
        pages: (pagesRes?.success && Array.isArray(pagesRes.data) ? pagesRes.data : []) as CmsPageItem[],
        redirects: (redirRes?.success && Array.isArray(redirRes.data) ? redirRes.data : []) as CmsRedirectItem[],
        mediaItems: (mediaRes?.success && Array.isArray(mediaRes.data) ? mediaRes.data : []) as CmsMediaItem[],
        staffUsers: (usersRes?.success && Array.isArray(usersRes.data) ? usersRes.data : []) as CmsStaffMember[],
        emergencyOverview: (emRes?.success ? emRes.data : null) as CmsEmergencyOverview | null,
      };
    } catch (error) {
      console.error("[cmsApi] fetchAllContent error:", error);
      throw error;
    }
  },

  /**
   * Mengembalikan konten ke snapshot versi sebelumnya.
   */
  restoreSnapshot: async (snapshotId: string) => {
    try {
      const res = await fetch(`/api/cms/content-snapshots/${snapshotId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      return await res.json();
    } catch (error) {
      console.error("[cmsApi] restoreSnapshot error:", error);
      return null;
    }
  },
};
