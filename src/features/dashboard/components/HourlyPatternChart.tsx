"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { AnalyticsHourlyItem } from "../types";
import { formatHourLabel } from "../utils";

const hourlyChartConfig = {
  pageviews: {
    label: "Tayangan Halaman",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export interface HourlyPatternChartProps {
  hourly?: AnalyticsHourlyItem[];
  className?: string;
}

export function HourlyPatternChart({
  hourly = [],
  className,
}: HourlyPatternChartProps) {
  const data = hourly.map((item) => ({
    hour: formatHourLabel(item.hour),
    pageviews: item.pageviews,
  }));

  const hasData = data.some((item) => item.pageviews > 0);
  const peak = hasData
    ? data.reduce((busiest, item) =>
        item.pageviews > busiest.pageviews ? item : busiest
      )
    : null;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold tracking-tight">
            Pola Jam Sibuk
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Tayangan halaman per jam (WIB) pada rentang tanggal terpilih
          </CardDescription>
        </div>
        {peak ? (
          <p className="text-xs text-muted-foreground">
            Puncak{" "}
            <span className="font-semibold text-foreground">{peak.hour}</span>
          </p>
        ) : null}
      </CardHeader>

      <CardContent className="pt-2">
        {hasData ? (
          <>
            <p className="sr-only">
              Jam tersibuk {peak?.hour} dengan{" "}
              {peak?.pageviews.toLocaleString("id-ID")} tayangan halaman.
            </p>
            <ChartContainer config={hourlyChartConfig} className="h-64 w-full">
              <BarChart
                accessibilityLayer
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.2}
                />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={10}
                  interval={2}
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
                  cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="pageviews"
                  name="Tayangan Halaman"
                  fill="var(--primary)"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={18}
                />
              </BarChart>
            </ChartContainer>
          </>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground border border-dashed border-border rounded-lg p-6">
            <p className="text-xs font-semibold text-foreground/80">
              Belum ada aktivitas pada rentang tanggal ini.
            </p>
            <p className="text-[11px] text-muted-foreground/80 mt-1 max-w-xs">
              Pola jam sibuk muncul setelah website menerima kunjungan publik.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default HourlyPatternChart;
