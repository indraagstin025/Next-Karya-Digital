"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { AnalyticsTimelineItem } from "../types";

const trendChartConfig = {
  visitors: {
    label: "Pengunjung Unik",
    color: "var(--primary)",
  },
  pageviews: {
    label: "Tayangan Halaman",
    color: "color-mix(in oklab, var(--primary) 35%, transparent)",
  },
} satisfies ChartConfig;

export interface TrafficTrendChartProps {
  timeline?: AnalyticsTimelineItem[];
  className?: string;
}

export function TrafficTrendChart({ timeline = [], className }: TrafficTrendChartProps) {
  const hasData = timeline && timeline.length > 0 && timeline.some((t) => t.visitors > 0 || t.pageviews > 0);

  const formattedData = timeline.map((item) => {
    // Format YYYY-MM-DD to DD/MM
    const parts = item.date.split("-");
    const label = parts.length === 3 ? `${parts[2]}/${parts[1]}` : item.date;

    return {
      date: label,
      fullDate: item.date,
      visitors: item.visitors,
      pageviews: item.pageviews,
      conversions: item.conversions,
    };
  });

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold tracking-tight">
            Tren Aktivitas Trafik Harian
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Fluktuasi pengunjung unik dan tayangan halaman berdasarkan rentang filter terpilih
          </CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-primary" />
            <span className="font-medium text-foreground">Pengunjung Unik</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-primary/35" />
            <span className="text-muted-foreground">Tayangan</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {hasData ? (
          <ChartContainer config={trendChartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradientPageviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={11}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={11}
                  allowDecimals={false}
                  stroke="var(--muted-foreground)"
                />
                <ChartTooltip
                  cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                  content={<ChartTooltipContent />}
                />
                <Area
                  type="monotone"
                  dataKey="pageviews"
                  name="Tayangan Halaman"
                  stroke="var(--primary)"
                  strokeOpacity={0.4}
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#gradientPageviews)"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Pengunjung Unik"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradientVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border rounded-lg p-6">
            <p className="text-xs font-semibold text-foreground/80">
              Belum ada riwayat trafik pada rentang tanggal ini.
            </p>
            <p className="text-[11px] text-muted-foreground/80 mt-1 max-w-sm">
              Grafik garis interaktif akan otomatis menampilkan kurva fluktuasi harian saat website menerima kunjungan publik.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TrafficTrendChart;
