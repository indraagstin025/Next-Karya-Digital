"use client";

import React from "react";
import { Bar, BarChart, Label, Pie, PieChart } from "recharts";
import {
  TrendingUpIcon,
  BadgePercentIcon,
  DollarSignIcon,
  ShoppingBagIcon,
  ChartNoAxesCombinedIcon,
  CirclePercentIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { AnalyticsTrafficSource } from "../types";

const defaultColors = [
  "var(--primary)",
  "color-mix(in oklab, var(--primary) 70%, transparent)",
  "color-mix(in oklab, var(--primary) 45%, transparent)",
  "color-mix(in oklab, var(--primary) 20%, transparent)",
];

const salesChartConfig = {
  sales: {
    label: "Aktivitas",
  },
} satisfies ChartConfig;

const revenueChartConfig = {
  sales: {
    label: "Tayangan",
  },
} satisfies ChartConfig;

export interface SalesMetricsCardProps {
  className?: string;
  conversionTrendValue?: string;
  activeLeadsValue?: string;
  dealValue?: string;
  completedProjectsValue?: string;
  sources?: AnalyticsTrafficSource[];
}

export function SalesMetricsCard({
  className,
  conversionTrendValue = "0%",
  activeLeadsValue = "0 Klien",
  dealValue = "Rp 0",
  completedProjectsValue = "0 Portofolio",
  sources,
}: SalesMetricsCardProps) {
  const hasSources = Boolean(sources && sources.length > 0);

  const chartPieData = hasSources
    ? sources!.map((s, idx) => ({
        name: s.label,
        sales: s.pageviews,
        fill: defaultColors[idx % defaultColors.length],
        share: s.sharePercentage,
      }))
    : [{ name: "Belum Ada Rujukan", sales: 1, fill: "color-mix(in oklab, var(--muted) 40%, transparent)", share: 0 }];

  const topSource = hasSources ? chartPieData[0] : null;
  const topPercentage = topSource ? Math.round(topSource.share) : 0;

  const totalBars = 24;
  const filledBars = topPercentage > 0 ? Math.round((topPercentage * totalBars) / 100) : 0;

  const dynamicBarData = Array.from({ length: totalBars }, (_, index) => {
    const date = new Date(2026, 9, index + 1);
    const formattedDate = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
    });

    return {
      date: formattedDate,
      sales: index < filledBars ? 240 : 0.0001,
    };
  });

  const metricsData = [
    {
      icons: <TrendingUpIcon className="size-5" />,
      title: "Tingkat Respon",
      value: conversionTrendValue,
    },
    {
      icons: <BadgePercentIcon className="size-5" />,
      title: "Prospek Masuk",
      value: activeLeadsValue,
    },
    {
      icons: <DollarSignIcon className="size-5" />,
      title: "Estimasi Nilai",
      value: dealValue,
    },
    {
      icons: <ShoppingBagIcon className="size-5" />,
      title: "Portofolio Rilis",
      value: completedProjectsValue,
    },
  ];

  return (
    <Card className={className}>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="flex flex-col justify-between gap-7 lg:col-span-3">
            <span className="text-lg font-semibold">Aktivitas Prospek & Trafik</span>
            <div className="flex items-center gap-3">
              <img
                src="/icon.png"
                className="size-10.5 rounded-lg object-contain bg-primary/10 p-1"
                alt="Next Karya Logo"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-xl font-medium">Next Karya Digital Solutions</span>
                <span className="text-muted-foreground text-sm">nextkarya@gmail.com</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {metricsData.map((metric, index) => (
                <Card key={index} className="ring-foreground/10 py-2 shadow-none ring-1">
                  <CardContent className="flex items-center gap-3 px-4">
                    <Avatar className="rounded-sm after:border-0">
                      <AvatarFallback className="bg-primary/10 text-primary shrink-0 rounded-sm">
                        {metric.icons}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground text-sm font-medium">
                        {metric.title}
                      </span>
                      <span className="text-lg font-semibold">{metric.value}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="ring-foreground/10 justify-between gap-4 shadow-none ring-1 lg:col-span-2">
            <CardHeader className="gap-1">
              <CardTitle className="text-lg font-semibold">Saluran Rujukan</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <ChartContainer config={revenueChartConfig} className="h-38.5 w-full">
                <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={chartPieData}
                    dataKey="sales"
                    nameKey="name"
                    startAngle={300}
                    endAngle={660}
                    innerRadius={58}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 12}
                                className="fill-card-foreground text-lg font-bold"
                              >
                                {topPercentage}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 19}
                                className="fill-muted-foreground text-xs"
                              >
                                {hasSources ? "Organik" : "Data Kosong"}
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground truncate max-w-[170px]">
                  {topSource ? topSource.name : "Belum Ada Rujukan"}
                </span>
                <span className="text-2xl font-semibold text-primary">{topPercentage}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>

      <CardContent>
        <Card className="ring-foreground/10 shadow-none ring-1">
          <CardContent className="grid gap-4 lg:grid-cols-5">
            <div className="flex flex-col justify-center gap-6">
              <span className="text-lg font-semibold">Saluran Teratas</span>
              <span className="max-lg:text-5xl text-6xl font-bold">{topPercentage}%</span>
              <span className="text-muted-foreground text-sm">
                {hasSources
                  ? "Porsi kontribusi trafik pengunjung dari saluran rujukan teratas"
                  : "Menunggu kunjungan rujukan pertama dari Google atau tautan luar"}
              </span>
            </div>
            <div className="flex flex-col gap-6 text-lg md:col-span-4">
              <span className="font-medium">Saluran Pemasaran Digital</span>
              <span className="text-muted-foreground text-sm text-wrap">
                Pemantauan rujukan Google, tautan langsung, media sosial, dan mitra bisnis
                untuk efisiensi akuisisi calon klien.
              </span>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <ChartNoAxesCombinedIcon className="size-6 text-primary" />
                  <span className="text-base font-medium">Trafik Alami Google</span>
                </div>
                <div className="flex items-center gap-2">
                  <CirclePercentIcon className="size-6 text-primary" />
                  <span className="text-base font-medium">Pengunjung Berkualitas</span>
                </div>
              </div>

              <ChartContainer config={salesChartConfig} className="h-7.75 w-full">
                <BarChart
                  accessibilityLayer
                  data={dynamicBarData}
                  margin={{
                    left: 0,
                    right: 0,
                  }}
                  maxBarSize={16}
                >
                  <Bar
                    dataKey="sales"
                    fill="var(--primary)"
                    background={{
                      fill: "color-mix(in oklab, var(--primary) 10%, transparent)",
                      radius: 12,
                    }}
                    radius={12}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

export default SalesMetricsCard;
