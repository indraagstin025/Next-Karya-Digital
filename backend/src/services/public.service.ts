import crypto from "crypto";
import { prisma } from "../config/prisma";
import { PaginationMeta } from "../utils/response";

export class PublicService {
  async getArticles(query: {
    site_id: string;
    page: number;
    limit: number;
    category?: string;
    tag?: string;
    search?: string;
  }) {
    const { site_id, page, limit, category, tag, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      site_id,
      status: "PUBLISHED",
    };

    if (category) {
      where.category = { slug: category };
    }

    if (tag) {
      where.tags = { has: tag };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          site_id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverUrl: true,
          coverAlt: true,
          tags: true,
          readingTimeMinutes: true,
          publishedAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          author: {
            select: {
              fullName: true,
              jobTitle: true,
              avatarUrl: true,
            },
          },
        },
      }),
    ]);

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };

    return { items, meta };
  }

  async getArticleBySlug(site_id: string, slug: string) {
    const post = await prisma.post.findFirst({
      where: {
        site_id,
        slug,
        status: "PUBLISHED",
      },
      include: {
        category: {
          select: { name: true, slug: true },
        },
        author: {
          select: { fullName: true, jobTitle: true, avatarUrl: true },
        },
      },
    });

    if (!post) return null;

    // Fetch related posts if any
    let relatedPosts: { id: string; title: string; slug: string }[] = [];
    if (post.relatedPostIds && post.relatedPostIds.length > 0) {
      relatedPosts = await prisma.post.findMany({
        where: {
          id: { in: post.relatedPostIds },
          status: "PUBLISHED",
        },
        select: { id: true, title: true, slug: true },
      });
    }

    return {
      id: post.id,
      site_id: post.site_id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverUrl: post.coverUrl,
      coverAlt: post.coverAlt,
      tags: post.tags,
      readingTimeMinutes: post.readingTimeMinutes,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      category: post.category,
      author: post.author,
      publishedAt: post.publishedAt,
      relatedPosts,
    };
  }

  async getPortfolios(query: {
    site_id: string;
    isFeatured?: boolean;
    page: number;
    limit: number;
  }) {
    const { site_id, isFeatured, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      site_id,
      status: "PUBLISHED",
    };

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    const [total, items] = await Promise.all([
      prisma.portfolio.count({ where }),
      prisma.portfolio.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { publishedAt: "desc" }],
        select: {
          id: true,
          site_id: true,
          title: true,
          slug: true,
          clientName: true,
          serviceCategory: true,
          summary: true,
          impactSummary: true,
          metricResult: true,
          technologies: true,
          thumbnailUrl: true,
          projectUrl: true,
          isFeatured: true,
          publishedAt: true,
        },
      }),
    ]);

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };

    return { items, meta };
  }

  async getPortfolioBySlug(site_id: string, slug: string) {
    return prisma.portfolio.findFirst({
      where: {
        site_id,
        slug,
        status: "PUBLISHED",
      },
    });
  }

  async getServices(site_id: string) {
    return prisma.service.findMany({
      where: {
        site_id,
        status: "PUBLISHED",
      },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        site_id: true,
        title: true,
        slug: true,
        icon: true,
        shortDesc: true,
        features: true,
        priceLabel: true,
        priceNote: true,
        badge: true,
        ctaLabel: true,
        ctaHref: true,
        sortOrder: true,
      },
    });
  }

  async getFaqs(site_id: string, category?: string) {
    const where: any = {
      site_id,
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    return prisma.faq.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        sortOrder: true,
      },
    });
  }

  async getTestimonials(site_id: string) {
    return prisma.testimonial.findMany({
      where: {
        site_id,
        status: "PUBLISHED",
      },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        clientName: true,
        clientRole: true,
        companyName: true,
        content: true,
        rating: true,
        avatarUrl: true,
        portfolio: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  async getPageBySlug(site_id: string, slug: string) {
    return prisma.page.findFirst({
      where: {
        site_id,
        slug,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        site_id: true,
        title: true,
        slug: true,
        content: true,
        seoTitle: true,
        seoDescription: true,
      },
    });
  }

  async submitLead(payload: {
    site_id: string;
    clientName: string;
    companyName?: string | null;
    whatsappNumber: string;
    email?: string | null;
    serviceRequested: string;
    message: string;
    website_url?: string;
  }) {
    // 1. Honeypot trap: if website_url is filled, silently discard without saving
    if (payload.website_url && payload.website_url.trim().length > 0) {
      return { trapped: true };
    }

    // 2. Verify site exists and is not locked
    const site = await prisma.site.findUnique({
      where: { id: payload.site_id },
      select: { id: true, isFormLocked: true },
    });

    if (!site) {
      throw { statusCode: 404, code: "SITE_NOT_FOUND", message: "Situs tidak ditemukan." };
    }

    if (site.isFormLocked) {
      throw {
        statusCode: 403,
        code: "FORM_LOCKED",
        message: "Formulir konsultasi saat ini sedang ditutup sementara. Silakan hubungi kami via WhatsApp resmi.",
      };
    }

    // 3. Save lead to PostgreSQL
    const lead = await prisma.lead.create({
      data: {
        site_id: payload.site_id,
        clientName: payload.clientName,
        companyName: payload.companyName,
        whatsappNumber: payload.whatsappNumber,
        email: payload.email,
        serviceRequested: payload.serviceRequested,
        message: payload.message,
        status: "BARU",
      },
    });

    // 4. Log activity using default site staff
    const siteStaff = await prisma.user.findFirst({
      select: { id: true },
    });

    if (siteStaff) {
      await prisma.activityLog.create({
        data: {
          site_id: payload.site_id,
          actorId: siteStaff.id,
          action: "LEAD_STATUS_CHANGED",
          entityType: "LEAD",
          entityId: lead.id,
          summary: `Prospek baru masuk via formulir website dari ${payload.clientName} (${payload.serviceRequested}).`,
        },
      });
    }

    return { trapped: false, leadId: lead.id };
  }

  async recordAnalyticsEvent(payload: {
    site_id: string;
    sessionId: string;
    eventName: "pageview" | "whatsapp_click" | "form_submit" | "heartbeat";
    path: string;
    referrer?: string | null;
    source: string;
    device: "mobile" | "desktop" | "tablet" | "unknown";
    browser?: string | null;
    os?: string | null;
    durationSec: number;
  }) {
    const visitorIdHash = crypto
      .createHash("sha256")
      .update(payload.sessionId + (payload.browser || ""))
      .digest("hex")
      .slice(0, 32);

    // Non-blocking fire and forget into database
    prisma.analyticsEvent
      .create({
        data: {
          site_id: payload.site_id,
          sessionId: payload.sessionId,
          eventName: payload.eventName,
          path: payload.path,
          referrer: payload.referrer,
          source: payload.source,
          device: payload.device,
          browser: payload.browser,
          os: payload.os,
          durationSec: payload.durationSec,
          visitorIdHash,
        },
      })
      .catch((err) => {
        console.error("[Analytics Event Error]", err.message);
      });

    return { status: "recorded" };
  }
}
