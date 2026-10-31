import { prisma } from "../config/prisma";
import { triggerRevalidationWebhook } from "../utils/webhook";
import { PaginationMeta } from "../utils/response";

export class CmsService {
  // ==================== POSTS ====================
  async getPosts(query: {
    site_id: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    page: number;
    limit: number;
    search?: string;
  }) {
    const { site_id, status, page, limit, search } = query;
    const skip = (page - 1) * limit;

    const where: any = { site_id };
    if (status) where.status = status;
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
        orderBy: { updatedAt: "desc" },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { fullName: true, email: true } },
          lastEditor: { select: { fullName: true } },
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

  async getPostById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { fullName: true, email: true } },
        lastEditor: { select: { fullName: true } },
      },
    });
  }

  async createPost(payload: any, authorId: string) {
    return prisma.post.create({
      data: {
        ...payload,
        authorId,
        lastEditedById: authorId,
        status: "DRAFT",
      },
    });
  }

  async updatePost(id: string, payload: any, editorId: string) {
    const { updatedAt, ...updateData } = payload;
    return prisma.post.update({
      where: { id },
      data: {
        ...updateData,
        lastEditedById: editorId,
      },
      include: {
        lastEditor: { select: { fullName: true } },
      },
    });
  }

  async publishPost(id: string, editorId: string) {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) throw { statusCode: 404, code: "NOT_FOUND", message: "Artikel tidak ditemukan." };

    // 1. Transaction: create snapshot & update post
    const [_, updatedPost] = await prisma.$transaction([
      prisma.contentSnapshot.create({
        data: {
          site_id: post.site_id,
          entityType: "POST",
          entityId: post.id,
          title: post.title,
          snapshotPayload: post as any,
          savedById: editorId,
        },
      }),
      prisma.post.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          lastEditedById: editorId,
        },
      }),
    ]);

    // 2. FIFO prune snapshots (keep latest 5)
    await this.pruneSnapshots("POST", id);

    // 3. Trigger revalidation webhook
    triggerRevalidationWebhook("articles").catch(console.error);

    return updatedPost;
  }

  async archivePost(id: string, editorId: string) {
    const post = await prisma.post.update({
      where: { id },
      data: {
        status: "ARCHIVED",
        lastEditedById: editorId,
      },
    });
    triggerRevalidationWebhook("articles").catch(console.error);
    return post;
  }

  // ==================== PORTFOLIOS ====================
  async getPortfolios(query: {
    site_id: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    page: number;
    limit: number;
  }) {
    const { site_id, status, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = { site_id };
    if (status) where.status = status;

    const [total, items] = await Promise.all([
      prisma.portfolio.count({ where }),
      prisma.portfolio.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
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

  async getPortfolioById(id: string) {
    return prisma.portfolio.findUnique({ where: { id } });
  }

  async createPortfolio(payload: any, editorId: string) {
    return prisma.portfolio.create({
      data: {
        ...payload,
        lastEditedById: editorId,
        status: "DRAFT",
      },
    });
  }

  async updatePortfolio(id: string, payload: any, editorId: string) {
    const { updatedAt, ...updateData } = payload;
    return prisma.portfolio.update({
      where: { id },
      data: {
        ...updateData,
        lastEditedById: editorId,
      },
    });
  }

  async publishPortfolio(id: string, editorId: string) {
    const portfolio = await prisma.portfolio.findUnique({ where: { id } });
    if (!portfolio) throw { statusCode: 404, code: "NOT_FOUND", message: "Portofolio tidak ditemukan." };

    const [_, updated] = await prisma.$transaction([
      prisma.contentSnapshot.create({
        data: {
          site_id: portfolio.site_id,
          entityType: "PORTFOLIO",
          entityId: portfolio.id,
          title: portfolio.title,
          snapshotPayload: portfolio as any,
          savedById: editorId,
        },
      }),
      prisma.portfolio.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          lastEditedById: editorId,
        },
      }),
    ]);

    await this.pruneSnapshots("PORTFOLIO", id);
    triggerRevalidationWebhook("portfolios").catch(console.error);
    return updated;
  }

  async archivePortfolio(id: string, editorId: string) {
    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        status: "ARCHIVED",
        lastEditedById: editorId,
      },
    });
    triggerRevalidationWebhook("portfolios").catch(console.error);
    return portfolio;
  }

  // ==================== SERVICES ====================
  async getServices(site_id: string, status?: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
    const where: any = { site_id };
    if (status) where.status = status;
    return prisma.service.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });
  }

  async getServiceById(id: string) {
    return prisma.service.findUnique({ where: { id } });
  }

  async createService(payload: any, editorId: string) {
    return prisma.service.create({
      data: {
        ...payload,
        lastEditedById: editorId,
        status: "DRAFT",
      },
    });
  }

  async updateService(id: string, payload: any, editorId: string) {
    const { updatedAt, ...updateData } = payload;
    return prisma.service.update({
      where: { id },
      data: {
        ...updateData,
        lastEditedById: editorId,
      },
    });
  }

  async publishService(id: string, editorId: string) {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw { statusCode: 404, code: "NOT_FOUND", message: "Layanan tidak ditemukan." };

    const [_, updated] = await prisma.$transaction([
      prisma.contentSnapshot.create({
        data: {
          site_id: service.site_id,
          entityType: "SERVICE",
          entityId: service.id,
          title: service.title,
          snapshotPayload: service as any,
          savedById: editorId,
        },
      }),
      prisma.service.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          lastEditedById: editorId,
        },
      }),
    ]);

    await this.pruneSnapshots("SERVICE", id);
    triggerRevalidationWebhook("services").catch(console.error);
    return updated;
  }

  async archiveService(id: string, editorId: string) {
    const service = await prisma.service.update({
      where: { id },
      data: {
        status: "ARCHIVED",
        lastEditedById: editorId,
      },
    });
    triggerRevalidationWebhook("services").catch(console.error);
    return service;
  }

  // ==================== PAGES ====================
  async getPages(site_id: string) {
    return prisma.page.findMany({
      where: { site_id },
      orderBy: { updatedAt: "desc" },
    });
  }

  async getPageById(id: string) {
    return prisma.page.findUnique({ where: { id } });
  }

  async createPage(payload: any, editorId: string) {
    return prisma.page.create({
      data: {
        ...payload,
        lastEditedById: editorId,
        status: "DRAFT",
      },
    });
  }

  async updatePage(id: string, payload: any, editorId: string) {
    const { updatedAt, ...updateData } = payload;
    return prisma.page.update({
      where: { id },
      data: {
        ...updateData,
        lastEditedById: editorId,
      },
    });
  }

  async publishPage(id: string, editorId: string) {
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) throw { statusCode: 404, code: "NOT_FOUND", message: "Halaman tidak ditemukan." };

    const [_, updated] = await prisma.$transaction([
      prisma.contentSnapshot.create({
        data: {
          site_id: page.site_id,
          entityType: "PAGE",
          entityId: page.id,
          title: page.title,
          snapshotPayload: page as any,
          savedById: editorId,
        },
      }),
      prisma.page.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          lastEditedById: editorId,
        },
      }),
    ]);

    await this.pruneSnapshots("PAGE", id);
    triggerRevalidationWebhook("pages").catch(console.error);
    return updated;
  }

  async archivePage(id: string, editorId: string) {
    const page = await prisma.page.update({
      where: { id },
      data: {
        status: "ARCHIVED",
        lastEditedById: editorId,
      },
    });
    triggerRevalidationWebhook("pages").catch(console.error);
    return page;
  }

  // ==================== FAQS ====================
  async getFaqs(site_id: string) {
    return prisma.faq.findMany({
      where: { site_id },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  async getFaqById(id: string) {
    return prisma.faq.findUnique({ where: { id } });
  }

  async createFaq(payload: any, editorId: string) {
    return prisma.faq.create({
      data: {
        ...payload,
        lastEditedById: editorId,
      },
    });
  }

  async updateFaq(id: string, payload: any, editorId: string) {
    const { updatedAt, ...updateData } = payload;
    return prisma.faq.update({
      where: { id },
      data: {
        ...updateData,
        lastEditedById: editorId,
      },
    });
  }

  async deleteFaq(id: string, editorId: string) {
    // Soft toggle to isActive = false
    return prisma.faq.update({
      where: { id },
      data: {
        isActive: false,
        lastEditedById: editorId,
      },
    });
  }

  // ==================== TESTIMONIALS ====================
  async getTestimonials(site_id: string) {
    return prisma.testimonial.findMany({
      where: { site_id },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        portfolio: { select: { id: true, title: true, slug: true } },
      },
    });
  }

  async getTestimonialById(id: string) {
    return prisma.testimonial.findUnique({
      where: { id },
      include: { portfolio: true },
    });
  }

  async createTestimonial(payload: any, editorId: string) {
    return prisma.testimonial.create({
      data: {
        ...payload,
        lastEditedById: editorId,
        status: payload.status || "PUBLISHED",
      },
    });
  }

  async updateTestimonial(id: string, payload: any, editorId: string) {
    const { updatedAt, ...updateData } = payload;
    return prisma.testimonial.update({
      where: { id },
      data: {
        ...updateData,
        lastEditedById: editorId,
      },
    });
  }

  async archiveTestimonial(id: string, editorId: string) {
    return prisma.testimonial.update({
      where: { id },
      data: {
        status: "ARCHIVED",
        lastEditedById: editorId,
      },
    });
  }

  // ==================== CONTENT SNAPSHOTS ====================
  async restoreSnapshot(snapshotId: string, editorId: string) {
    const snapshot = await prisma.contentSnapshot.findUnique({
      where: { id: snapshotId },
    });

    if (!snapshot) {
      throw { statusCode: 404, code: "NOT_FOUND", message: "Snapshot tidak ditemukan." };
    }

    const data = snapshot.snapshotPayload as any;

    if (snapshot.entityType === "POST") {
      await prisma.post.update({
        where: { id: snapshot.entityId },
        data: {
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          coverUrl: data.coverUrl,
          coverAlt: data.coverAlt,
          categoryId: data.categoryId,
          tags: data.tags,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          lastEditedById: editorId,
        },
      });
      triggerRevalidationWebhook("articles").catch(console.error);
    } else if (snapshot.entityType === "PORTFOLIO") {
      await prisma.portfolio.update({
        where: { id: snapshot.entityId },
        data: {
          title: data.title,
          clientName: data.clientName,
          serviceCategory: data.serviceCategory,
          summary: data.summary,
          impactSummary: data.impactSummary,
          metricResult: data.metricResult,
          technologies: data.technologies,
          thumbnailUrl: data.thumbnailUrl,
          projectUrl: data.projectUrl,
          isFeatured: data.isFeatured,
          lastEditedById: editorId,
        },
      });
      triggerRevalidationWebhook("portfolios").catch(console.error);
    }

    return { message: "Konten berhasil dipulihkan dari snapshot.", snapshotId };
  }

  private async pruneSnapshots(entityType: string, entityId: string) {
    try {
      const snapshots = await prisma.contentSnapshot.findMany({
        where: { entityType, entityId },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      if (snapshots.length > 5) {
        const toDelete = snapshots.slice(5).map((s) => s.id);
        await prisma.contentSnapshot.deleteMany({
          where: { id: { in: toDelete } },
        });
      }
    } catch (err: any) {
      console.warn("[Snapshot Prune Warning]", err.message);
    }
  }
}
