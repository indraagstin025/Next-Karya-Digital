"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsAudience, AnalyticsAudienceItem } from "../types";

export interface AudienceBreakdownCardProps {
  audience?: AnalyticsAudience | null;
  className?: string;
}

function BreakdownList({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: AnalyticsAudienceItem[];
  emptyLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <span className="text-[11px] text-muted-foreground">Tayangan</span>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="space-y-2.5">
          {items.slice(0, 5).map((item) => {
            const width = Math.min(100, Math.max(0, item.sharePercentage));
            return (
              <li key={`${title}-${item.name}`}>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="truncate font-medium text-foreground">
                    {item.name}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {item.pageviews.toLocaleString("id-ID")} ·{" "}
                    {item.sharePercentage.toFixed(1)}%
                  </span>
                </div>
                <div
                  className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function AudienceBreakdownCard({
  audience,
  className,
}: AudienceBreakdownCardProps) {
  const browsers = audience?.browsers ?? [];
  const os = audience?.os ?? [];
  const hasData = browsers.length > 0 || os.length > 0;
  const totalPageviews = browsers.reduce(
    (total, item) => total + item.pageviews,
    0
  );

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-semibold">
            Profil Pengunjung
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Browser dan sistem operasi dari kunjungan halaman.
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-normal">
          {totalPageviews > 0
            ? `${totalPageviews.toLocaleString("id-ID")} tayangan`
            : "Belum ada data"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        {hasData ? (
          <>
            <BreakdownList
              title="Browser"
              items={browsers}
              emptyLabel="Belum ada data browser."
            />
            <BreakdownList
              title="Sistem Operasi"
              items={os}
              emptyLabel="Belum ada data sistem operasi."
            />
          </>
        ) : (
          <p className="py-6 text-center text-xs text-muted-foreground">
            Belum ada data browser dan sistem operasi pada periode ini.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default AudienceBreakdownCard;
