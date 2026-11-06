"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsContentClicks } from "../types";

export interface ContentClicksCardProps {
  contentClicks?: AnalyticsContentClicks | null;
  className?: string;
}

export function ContentClicksCard({
  contentClicks,
  className,
}: ContentClicksCardProps) {
  const items = contentClicks?.items ?? [];
  const totalClicks =
    (contentClicks?.totalServiceClicks ?? 0) +
    (contentClicks?.totalPortfolioClicks ?? 0);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-semibold">
            Klik Layanan &amp; Portofolio
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Tautan konten yang paling sering dibuka pengunjung.
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-normal">
          {totalClicks > 0
            ? `${totalClicks.toLocaleString("id-ID")} klik`
            : "Belum ada klik"}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        {items.length > 0 ? (
          <ul className="divide-y divide-border">
            {items.slice(0, 8).map((item) => (
              <li
                key={`${item.type}-${item.targetPath}`}
                className="flex items-center justify-between gap-3 px-(--card-spacing) py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Badge
                    variant={item.type === "service" ? "secondary" : "outline"}
                    className="shrink-0 text-[10px] font-medium"
                  >
                    {item.type === "service" ? "Layanan" : "Portofolio"}
                  </Badge>
                  <span
                    className="truncate font-mono text-xs text-foreground"
                    title={item.targetPath}
                  >
                    {item.targetPath}
                  </span>
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-primary">
                  {item.clicks.toLocaleString("id-ID")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-(--card-spacing) py-10 text-center text-xs text-muted-foreground">
            Belum ada klik layanan atau portofolio pada periode ini.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default ContentClicksCard;
