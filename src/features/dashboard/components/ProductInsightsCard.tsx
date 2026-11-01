"use client";

import React from "react";
import { Bar, BarChart } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

const productReachChartData = [
  { month: "January", reached: 168 },
  { month: "February", reached: 305 },
  { month: "March", reached: 213 },
  { month: "April", reached: 330 },
  { month: "May", reached: 305 },
];

const productReachChartConfig = {
  reached: {
    label: "Reached",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const orderPlacedChartData = [
  { month: "January", orders: 168 },
  { month: "February", orders: 305 },
  { month: "March", orders: 213 },
  { month: "April", orders: 330 },
  { month: "May", orders: 305 },
];

const orderPlacedChartConfig = {
  orders: {
    label: "Orders",
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
  title = "Product insight",
  publishedDate = "Published on 12 MAY 2025 (Aktif)",
  reachedValue = "21,153",
  orderValue = "2,123",
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
          alt="Product"
          className="w-20.5 rounded-md object-cover"
        />
      </CardHeader>
      <CardContent>
        <Separator />
      </CardContent>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-1">
          <div className="flex flex-col gap-1">
            <span className="text-xs">Product reached</span>
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
            <span className="text-xs">Order placed</span>
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
