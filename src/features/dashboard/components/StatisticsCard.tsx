"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface StatisticsCardProps {
  icon: ReactNode;
  value: string | number;
  title: string;
  changePercentage: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export function StatisticsCard({
  icon,
  value,
  title,
  changePercentage,
  subtitle = "than last month",
  className,
  onClick,
}: StatisticsCardProps) {
  const isPositive = changePercentage.startsWith("+");
  const isNegative = changePercentage.startsWith("-");

  return (
    <Card
      onClick={onClick}
      className={`${className ?? ""} ${
        onClick ? "cursor-pointer transition hover:border-primary/50 hover:shadow-xs" : ""
      }`}
    >
      <CardHeader className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-sm">
          {icon}
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <span className="text-base font-semibold">{title}</span>
        <p className="space-x-2 text-sm">
          <span
            className={
              isPositive
                ? "font-medium text-emerald-600 dark:text-emerald-400"
                : isNegative
                ? "font-medium text-rose-600 dark:text-rose-400"
                : "text-muted-foreground"
            }
          >
            {changePercentage}
          </span>
          <span className="text-muted-foreground">{subtitle}</span>
        </p>
      </CardContent>
    </Card>
  );
}

export default StatisticsCard;
