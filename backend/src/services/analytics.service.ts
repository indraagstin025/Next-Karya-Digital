import { prisma } from "../config/prisma";

export class AnalyticsService {
  async getOverview(site_id: string, fromDateStr?: string, toDateStr?: string) {
    const to = toDateStr ? new Date(toDateStr) : new Date();
    const from = fromDateStr
      ? new Date(fromDateStr)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Filter analytics_daily for path = '*' strictly
    const records = await prisma.analyticsDaily.findMany({
      where: {
        site_id,
        path: "*",
        date: {
          gte: from,
          lte: to,
        },
      },
    });

    let totalVisitors = 0;
    let totalSessions = 0;
    let totalPageviews = 0;
    let totalDurationSec = 0;
    let totalBounces = 0;
    let totalWhatsappClicks = 0;
    let totalFormSubmits = 0;

    for (const r of records) {
      totalVisitors += r.visitors;
      totalSessions += r.sessions;
      totalPageviews += r.pageviews;
      totalDurationSec += r.durationSec;
      totalBounces += r.bounces;
      totalWhatsappClicks += r.whatsappClicks;
      totalFormSubmits += r.formSubmits;
    }

    const totalConversions = totalWhatsappClicks + totalFormSubmits;
    const averageDurationSec =
      totalSessions > 0 ? Math.round(totalDurationSec / totalSessions) : 0;
    const bounceRate =
      totalSessions > 0
        ? parseFloat(((totalBounces / totalSessions) * 100).toFixed(2))
        : 0;
    const conversionRate =
      totalVisitors > 0
        ? parseFloat(((totalConversions / totalVisitors) * 100).toFixed(2))
        : 0;

    return {
      site_id,
      period: {
        from: from.toISOString().slice(0, 10),
        to: to.toISOString().slice(0, 10),
      },
      metrics: {
        visitors: totalVisitors,
        visitorsChange: 0,
        sessions: totalSessions,
        sessionsChange: 0,
        pageviews: totalPageviews,
        pageviewsChange: 0,
        averageDurationSec,
        averageDurationChange: 0,
        bounceRate,
        bounceRateChange: 0,
        whatsappClicks: totalWhatsappClicks,
        formSubmits: totalFormSubmits,
        conversions: totalConversions,
        conversionsChange: 0,
        conversionRate,
        conversionRateChange: 0,
      },
    };
  }

  async getPages(site_id: string, fromDateStr?: string, toDateStr?: string, limit = 10) {
    const to = toDateStr ? new Date(toDateStr) : new Date();
    const from = fromDateStr
      ? new Date(fromDateStr)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Read analytics_daily where path != '*'
    const rows: any[] = await prisma.$queryRaw`
      SELECT 
        path,
        SUM(pageviews)::int AS pageviews,
        SUM(visitors)::int AS visitors,
        SUM(sessions)::int AS sessions,
        SUM(bounces)::int AS bounces,
        SUM(whatsapp_clicks + form_submits)::int AS conversions
      FROM analytics_daily
      WHERE site_id = ${site_id}
        AND path != '*'
        AND date >= ${from}
        AND date <= ${to}
      GROUP BY path
      ORDER BY pageviews DESC
      LIMIT ${limit}
    `;

    return rows.map((r) => {
      const pageviews = Number(r.pageviews) || 0;
      const visitors = Number(r.visitors) || 0;
      const sessions = Number(r.sessions) || 0;
      const bounces = Number(r.bounces) || 0;
      const conversions = Number(r.conversions) || 0;

      const bounceRate =
        sessions > 0 ? parseFloat(((bounces / sessions) * 100).toFixed(2)) : 0;
      const conversionRate =
        visitors > 0
          ? parseFloat(((conversions / visitors) * 100).toFixed(2))
          : 0;

      return {
        path: r.path,
        pageviews,
        visitors,
        bounceRate,
        conversions,
        conversionRate,
      };
    });
  }

  async getSources(site_id: string, fromDateStr?: string, toDateStr?: string) {
    const to = toDateStr ? new Date(toDateStr) : new Date();
    const from = fromDateStr
      ? new Date(fromDateStr)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const rows: any[] = await prisma.$queryRaw`
      SELECT 
        source,
        COUNT(*)::int AS pageviews,
        COUNT(DISTINCT session_id)::int AS visitors,
        COUNT(CASE WHEN event_name IN ('whatsapp_click', 'form_submit') THEN 1 END)::int AS conversions
      FROM analytics_events
      WHERE site_id = ${site_id}
        AND occurred_at >= ${from}
        AND occurred_at <= ${to}
      GROUP BY source
      ORDER BY pageviews DESC
    `;

    const totalPageviews = rows.reduce((acc, r) => acc + (Number(r.pageviews) || 0), 0);

    const labels: Record<string, string> = {
      google: "Pencarian Organik (Google)",
      direct: "Langsung (Direct)",
      instagram: "Media Sosial (Instagram)",
      referral: "Tautan Rujukan Mitra",
      unknown: "Lainnya",
    };

    return rows.map((r) => {
      const pageviews = Number(r.pageviews) || 0;
      const sharePercentage =
        totalPageviews > 0
          ? parseFloat(((pageviews / totalPageviews) * 100).toFixed(2))
          : 0;

      return {
        source: r.source,
        label: labels[r.source] || r.source,
        pageviews,
        visitors: Number(r.visitors) || 0,
        conversions: Number(r.conversions) || 0,
        sharePercentage,
      };
    });
  }
}
