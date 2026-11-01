"use client";

import React from "react";
import { Bar, BarChart } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import type { AnalyticsPageRank } from "../types";

const defaultReachData = [
  { month: "1", reached: 120 },
  { month: "2", reached: 210 },
  { month: "3", reached: 180 },
  { month: "4", reached: 260 },
  { month: "5", reached: 240 },
];

const productReachChartConfig = {
  reached: {
    label: "Tayangan",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const defaultOrderData = [
  { month: "1", orders: 4 },
  { month: "2", orders: 8 },
  { month: "3", orders: 6 },
  { month: "4", orders: 11 },
  { month: "5", orders: 9 },
];

const orderPlacedChartConfig = {
  orders: {
    label: "Konversi",
    color: "color-mix(in oklab, var(--primary) 10%, transparent)",
  },
} satisfies ChartConfig;

export interface ProductInsightsCardProps {
  className?: string;
  title?: string;
  publishedDate?: string;
  reachedValue?: string;
  orderValue?: string;
  pages?: AnalyticsPageRank[];
}

export function ProductInsightsCard({
  className,
  title = "Statistik Konten",
  publishedDate = "Portofolio & artikel aktif",
  reachedValue = "1.850",
  orderValue = "8",
  pages,
}: ProductInsightsCardProps) {
  const reachData =
    pages && pages.length > 0
      ? pages.slice(0, 5).map((p, idx) => ({
          month: String(idx + 1),
          reached: p.pageviews,
        }))
      : defaultReachData;

  const conversionData =
    pages && pages.length > 0
      ? pages.slice(0, 5).map((p, idx) => ({
          month: String(idx + 1),
          orders: p.conversions || 1,
        }))
      : defaultOrderData;

  return (
    <Card className={className}>
      <CardHeader className="flex justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">{title}</span>
          <span className="text-muted-foreground text-sm">{publishedDate}</span>
        </div>
        <img
          src="/images/widgets/image-7.webp"
          alt="Konten"
          className="w-20.5 rounded-md object-cover"
        />
      </CardHeader>
      <CardContent>
        <Separator />
      </CardContent>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-1">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Pembaca Halaman</span>
            <span className="text-2xl font-semibold">{reachedValue}</span>
          </div>
          <ChartContainer config={productReachChartConfig} className="min-h-13 max-w-18">
            <BarChart accessibilityLayer data={reachData} barSize={8}>
              <Bar dataKey="reached" fill="var(--color-reached)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="flex items-center justify-between gap-1">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Permohonan Masuk</span>
            <span className="text-2xl font-semibold">{orderValue}</span>
          </div>
          <ChartContainer config={orderPlacedChartConfig} className="min-h-13 max-w-18">
            <BarChart accessibilityLayer data={conversionData} barSize={8}>
              <Bar dataKey="orders" fill="var(--color-orders)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductInsightsCard;
