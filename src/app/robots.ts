import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard",
          "/dashboard/",
          "/cms",
          "/cms/",
          "/crm",
          "/crm/",
          "/pengaturan",
          "/pengaturan/",
        ],
      },
    ],
    sitemap: "https://nextkarya.web.id/sitemap.xml",
  };
}
