import { prisma } from "../config/prisma";
import { triggerRevalidationWebhook } from "../utils/webhook";

export class EmergencyService {
  async unpublishContent(payload: {
    site_id: string;
    targetEntity: "POST" | "PORTFOLIO" | "SERVICE" | "PAGE";
    targetId: string;
    reason: string;
    executedById: string;
  }) {
    const { site_id, targetEntity, targetId, reason, executedById } = payload;

    if (targetEntity === "POST") {
      await prisma.post.update({
        where: { id: targetId },
        data: { status: "DRAFT", lastEditedById: executedById },
      });
      triggerRevalidationWebhook("articles").catch(console.error);
    } else if (targetEntity === "PORTFOLIO") {
      await prisma.portfolio.update({
        where: { id: targetId },
        data: { status: "DRAFT", lastEditedById: executedById },
      });
      triggerRevalidationWebhook("portfolios").catch(console.error);
    } else if (targetEntity === "SERVICE") {
      await prisma.service.update({
        where: { id: targetId },
        data: { status: "DRAFT", lastEditedById: executedById },
      });
      triggerRevalidationWebhook("services").catch(console.error);
    } else if (targetEntity === "PAGE") {
      await prisma.page.update({
        where: { id: targetId },
        data: { status: "DRAFT", lastEditedById: executedById },
      });
      triggerRevalidationWebhook("pages").catch(console.error);
    }

    const auditLog = await prisma.emergencyAuditLog.create({
      data: {
        site_id,
        actionType: "UNPUBLISH_CONTENT",
        targetEntity,
        targetId,
        reason,
        actorId: executedById,
      },
    });

    return {
      message: "Konten berhasil diturunkan darurat ke status DRAFT.",
      auditLogId: auditLog.id,
      actionType: "UNPUBLISH_CONTENT",
      executedAt: auditLog.createdAt,
    };
  }

  async lockContactForm(payload: { site_id: string; reason: string; executedById: string }) {
    const { site_id, reason, executedById } = payload;

    await prisma.site.update({
      where: { id: site_id },
      data: { isFormLocked: true },
    });

    const auditLog = await prisma.emergencyAuditLog.create({
      data: {
        site_id,
        actionType: "LOCK_CONTACT_FORM",
        targetEntity: "SITE",
        targetId: site_id,
        reason,
        actorId: executedById,
      },
    });

    return {
      message: "Formulir kontak publik berhasil dikunci secara darurat.",
      auditLogId: auditLog.id,
      actionType: "LOCK_CONTACT_FORM",
      executedAt: auditLog.createdAt,
    };
  }

  async unlockContactForm(payload: { site_id: string; reason: string; executedById: string }) {
    const { site_id, reason, executedById } = payload;

    await prisma.site.update({
      where: { id: site_id },
      data: { isFormLocked: false },
    });

    const auditLog = await prisma.emergencyAuditLog.create({
      data: {
        site_id,
        actionType: "UNLOCK_CONTACT_FORM",
        targetEntity: "SITE",
        targetId: site_id,
        reason,
        actorId: executedById,
      },
    });

    return {
      message: "Formulir kontak publik berhasil dibuka kembali.",
      auditLogId: auditLog.id,
      actionType: "UNLOCK_CONTACT_FORM",
      executedAt: auditLog.createdAt,
    };
  }

  async setAlertBanner(payload: {
    site_id: string;
    isActive: boolean;
    alertBanner?: string | null;
    reason: string;
    executedById: string;
  }) {
    const { site_id, isActive, alertBanner, reason, executedById } = payload;

    await prisma.site.update({
      where: { id: site_id },
      data: {
        alertBanner: isActive ? alertBanner || null : null,
      },
    });

    const actionType = isActive ? "SET_ALERT_BANNER" : "REMOVE_ALERT_BANNER";

    const auditLog = await prisma.emergencyAuditLog.create({
      data: {
        site_id,
        actionType,
        targetEntity: "SITE",
        targetId: site_id,
        reason,
        actorId: executedById,
      },
    });

    return {
      message: isActive
        ? "Banner darurat berhasil diaktifkan."
        : "Banner darurat berhasil dinonaktifkan.",
      auditLogId: auditLog.id,
      actionType,
      executedAt: auditLog.createdAt,
    };
  }

  async reassignLead(leadId: string, payload: { newAssignedToId: string; reason: string; executedById: string }) {
    const { newAssignedToId, reason, executedById } = payload;

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw { statusCode: 404, code: "NOT_FOUND", message: "Prospek tidak ditemukan." };

    const [updatedLead, auditLog] = await prisma.$transaction([
      prisma.lead.update({
        where: { id: leadId },
        data: { assignedToId: newAssignedToId },
      }),
      prisma.emergencyAuditLog.create({
        data: {
          site_id: lead.site_id,
          actionType: "REASSIGN_STAFF",
          targetEntity: "LEAD",
          targetId: leadId,
          reason,
          actorId: executedById,
        },
      }),
      prisma.activityLog.create({
        data: {
          site_id: lead.site_id,
          actorId: executedById,
          action: "LEAD_REASSIGNED",
          entityType: "LEAD",
          entityId: leadId,
          summary: `Pengalihan darurat staf ke ID: ${newAssignedToId}. Alasan: ${reason}`,
        },
      }),
    ]);

    return {
      message: "Penanggung jawab prospek berhasil dialihkan secara darurat.",
      auditLogId: auditLog.id,
      actionType: "REASSIGN_STAFF",
      executedAt: auditLog.createdAt,
      lead: {
        ...updatedLead,
        dealValue: Number(updatedLead.dealValue),
      },
    };
  }
}
