"use client";

import React from "react";
import { Bar, BarChart } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

const productReachChartData = [
  { month: "Jan", reached: 120 },
  { month: "Feb", reached: 210 },
  { month: "Mar", reached: 180 },
  { month: "Apr", reached: 260 },
  { month: "Mei", reached: 240 },
];

const productReachChartConfig = {
  reached: {
    label: "Pembaca",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const orderPlacedChartData = [
  { month: "Jan", orders: 4 },
  { month: "Feb", orders: 8 },
  { month: "Mar", orders: 6 },
  { month: "Apr", orders: 11 },
  { month: "Mei", orders: 9 },
];

const orderPlacedChartConfig = {
  orders: {
    label: "Permohonan",
    color: "color-mix(in oklab, var(--primary) 10%, transparent)",
  },
} satisfies ChartConfig;

export interface ProductInsightsCardProps {
  className?: string;
  title?: string;
  publishedDate?: string;
  reachedValue?: string;
  orderValue?: string;
}

export function ProductInsightsCard({
  className,
  title = "Statistik Konten",
  publishedDate = "Portofolio & artikel aktif",
  reachedValue = "1.850",
  orderValue = "8",
}: ProductInsightsCardProps) {
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
            <span className="text-xs text-muted-foreground">Pembaca Artikel</span>
            <span className="text-2xl font-semibold">{reachedValue}</span>
          </div>
          <ChartContainer config={productReachChartConfig} className="min-h-13 max-w-18">
            <BarChart accessibilityLayer data={productReachChartData} barSize={8}>
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
            <BarChart accessibilityLayer data={orderPlacedChartData} barSize={8}>
              <Bar dataKey="orders" fill="var(--color-orders)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductInsightsCard;
