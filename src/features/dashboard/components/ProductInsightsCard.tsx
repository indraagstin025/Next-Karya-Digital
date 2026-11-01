"use client";

import React from "react";
import { Bar, BarChart } from "recharts";
import { BookOpenIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import type { AnalyticsPageRank } from "../types";

const productReachChartConfig = {
  reached: {
    label: "Tayangan",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const orderPlacedChartConfig = {
  orders: {
    label: "Konversi",
    color: "color-mix(in oklab, var(--primary) 20%, transparent)",
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
  reachedValue = "0",
  orderValue = "0",
  pages,
}: ProductInsightsCardProps) {
  const hasPages = pages && pages.length > 0;

  const reachData = hasPages
    ? pages.slice(0, 5).map((p, idx) => ({
        month: String(idx + 1),
        reached: p.pageviews,
      }))
    : [{ month: "0", reached: 0 }];

  const conversionData = hasPages
    ? pages.slice(0, 5).map((p, idx) => ({
        month: String(idx + 1),
        orders: p.conversions || 0,
      }))
    : [{ month: "0", orders: 0 }];

  return (
    <Card className={className}>
      <CardHeader className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">{title}</span>
          <span className="text-muted-foreground text-sm">{publishedDate}</span>
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BookOpenIcon className="size-5" />
        </div>
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
