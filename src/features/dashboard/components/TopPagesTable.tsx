"use client";

import React from "react";
import { FileTextIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsPageRank } from "../types";

export interface TopPagesTableProps {
  pages?: AnalyticsPageRank[];
  className?: string;
}

const defaultPages: AnalyticsPageRank[] = [
  {
    path: "/",
    pageviews: 7520,
    visitors: 3100,
    bounceRate: 32.1,
    conversions: 140,
    conversionRate: 4.52,
  },
  {
    path: "/layanan",
    pageviews: 3840,
    visitors: 1950,
    bounceRate: 28.4,
    conversions: 95,
    conversionRate: 4.87,
  },
  {
    path: "/portofolio",
    pageviews: 2910,
    visitors: 1420,
    bounceRate: 35.0,
    conversions: 42,
    conversionRate: 2.96,
  },
  {
    path: "/tentang-kami",
    pageviews: 2380,
    visitors: 1100,
    bounceRate: 41.2,
    conversions: 12,
    conversionRate: 1.09,
  },
  {
    path: "/blog",
    pageviews: 1800,
    visitors: 950,
    bounceRate: 44.5,
    conversions: 6,
    conversionRate: 0.63,
  },
];

export function TopPagesTable({
  pages = defaultPages,
  className,
}: TopPagesTableProps) {
  const displayPages = pages && pages.length > 0 ? pages : defaultPages;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-semibold">
            Halaman Terpopuler
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Daftar jalur halaman dengan interaksi dan tayangan tertinggi.
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-normal">
          Top {displayPages.length} Halaman
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] text-xs">Jalur Halaman</TableHead>
                <TableHead className="text-right text-xs">Tayangan</TableHead>
                <TableHead className="text-right text-xs">Pengunjung</TableHead>
                <TableHead className="text-right text-xs">Pantulan</TableHead>
                <TableHead className="text-right text-xs">Konversi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayPages.map((page, idx) => (
                <TableRow key={page.path || idx}>
                  <TableCell className="font-mono text-xs font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <FileTextIcon className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate max-w-[200px]">{page.path}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium">
                    {page.pageviews.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {page.visitors.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium ${
                        page.bounceRate < 35
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {page.bounceRate.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs font-semibold text-primary">
                    <div className="flex items-center justify-end gap-1">
                      <span>{page.conversions}</span>
                      <span className="text-[10px] text-muted-foreground">
                        ({page.conversionRate.toFixed(1)}%)
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default TopPagesTable;
