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

const salesPlanPercentage = 64;
const totalBars = 24;
const filledBars = Math.round((salesPlanPercentage * totalBars) / 100);

const salesChartData = Array.from({ length: totalBars }, (_, index) => {
  const date = new Date(2025, 5, index + 1);
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
  });

  return {
    date: formattedDate,
    sales: index < filledBars ? 240 : 0.0001,
  };
});

const salesChartConfig = {
  sales: {
    label: "Aktivitas",
  },
} satisfies ChartConfig;

const revenueChartData = [
  { month: "january", sales: 280, fill: "var(--color-january)" },
  { month: "february", sales: 180, fill: "var(--color-february)" },
  { month: "march", sales: 140, fill: "var(--color-march)" },
];

const revenueChartConfig = {
  sales: {
    label: "Status",
  },
  january: {
    label: "Selesai",
    color: "var(--primary)",
  },
  february: {
    label: "Dalam Proses",
    color: "color-mix(in oklab, var(--primary) 60%, transparent)",
  },
  march: {
    label: "Penawaran",
    color: "color-mix(in oklab, var(--primary) 20%, transparent)",
  },
} satisfies ChartConfig;

export interface SalesMetricsCardProps {
  className?: string;
  conversionTrendValue?: string;
  activeLeadsValue?: string;
  dealValue?: string;
  completedProjectsValue?: string;
}

export function SalesMetricsCard({
  className,
  conversionTrendValue = "+8.4%",
  activeLeadsValue = "6 Klien",
  dealValue = "Rp 36 Jt",
  completedProjectsValue = "12 Proyek",
}: SalesMetricsCardProps) {
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
            <span className="text-lg font-semibold">Aktivitas Prospek & Proyek</span>
            <div className="flex items-center gap-3">
              <img
                src="/images/brands/logo-square.webp"
                className="size-10.5 rounded-lg"
                alt="Next Karya Logo"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-xl font-medium">Next Karya Solusindo</span>
                <span className="text-muted-foreground text-sm">agency@nextkarya.com</span>
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
              <CardTitle className="text-lg font-semibold">Status Pengerjaan</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <ChartContainer config={revenueChartConfig} className="h-38.5 w-full">
                <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={revenueChartData}
                    dataKey="sales"
                    nameKey="month"
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
                                {salesPlanPercentage}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 19}
                                className="fill-muted-foreground text-sm"
                              >
                                Berjalan
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
                <span className="text-base text-muted-foreground">Target pengerjaan</span>
                <span className="text-2xl font-semibold text-primary">{salesPlanPercentage}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>

      <CardContent>
        <Card className="ring-foreground/10 shadow-none ring-1">
          <CardContent className="grid gap-4 lg:grid-cols-5">
            <div className="flex flex-col justify-center gap-6">
              <span className="text-lg font-semibold">Aktivitas Prospek</span>
              <span className="max-lg:text-5xl text-6xl font-bold">{salesPlanPercentage}%</span>
              <span className="text-muted-foreground text-sm">
                Alur tindak lanjut calon klien yang berkonsultasi
              </span>
            </div>
            <div className="flex flex-col gap-6 text-lg md:col-span-4">
              <span className="font-medium">Alur Komunikasi Prospek</span>
              <span className="text-muted-foreground text-sm text-wrap">
                Pemantauan pesan masuk, pembuatan penawaran layanan, dan penjadwalan pengerjaan
                website klien.
              </span>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <ChartNoAxesCombinedIcon className="size-6 text-primary" />
                  <span className="text-base font-medium">Konsultasi Aktif</span>
                </div>
                <div className="flex items-center gap-2">
                  <CirclePercentIcon className="size-6 text-primary" />
                  <span className="text-base font-medium">Tindak Lanjut Cepat</span>
                </div>
              </div>

              <ChartContainer config={salesChartConfig} className="h-7.75 w-full">
                <BarChart
                  accessibilityLayer
                  data={salesChartData}
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
