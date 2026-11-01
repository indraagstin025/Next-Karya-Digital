"use client";

import React from "react";
import { EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const listItems = ["Lihat Rincian", "Perbarui Nilai", "Ekspor Laporan"];

export interface EarningItem {
  img?: string;
  platform: string;
  technologies: string;
  earnings: string;
  progressPercentage: number;
}

export interface TotalEarningCardProps {
  title?: string;
  earning?: number | string;
  trend?: "up" | "down";
  percentage?: number;
  comparisonText?: string;
  earningData?: EarningItem[];
  className?: string;
}

export function TotalEarningCard({
  earningData = [],
  title = "Estimasi Nilai Proyek",
  earning = "0",
  trend = "up",
  percentage,
  comparisonText = "Akumulasi nilai dari proyek yang telah disepakati",
  className,
}: TotalEarningCardProps) {
  const formattedEarning =
    typeof earning === "number" ? earning.toLocaleString("id-ID") : earning;

  const hasTrend = typeof percentage === "number" && percentage > 0;

  return (
    <Card className={className}>
      <CardContent className="flex flex-col gap-6">
        <span className="flex items-center justify-between">
          <div className="text-lg font-semibold">{title}</div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground size-6 rounded-full cursor-pointer"
                />
              }
            >
              <EllipsisVerticalIcon className="size-4" />
              <span className="sr-only">Menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {listItems.map((item, index) => (
                  <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold">Rp {formattedEarning}</span>
            {hasTrend && (
              <span className="flex items-center gap-1">
                {trend === "up" ? (
                  <ChevronUpIcon className="size-4 text-emerald-500" />
                ) : (
                  <ChevronDownIcon className="size-4 text-rose-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    trend === "up" ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {percentage}%
                </span>
              </span>
            )}
          </div>
          <span className="text-muted-foreground text-sm">{comparisonText}</span>
        </div>
      </CardContent>
      <CardContent className="flex flex-1 flex-col gap-4">
        {earningData && earningData.length > 0 ? (
          <div className="flex flex-1 flex-col justify-evenly gap-4">
            {earningData.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-2.5">
                <div className="flex items-center justify-between gap-2.5">
                  <Avatar className="size-11 rounded-sm after:rounded-[inherit] after:border-0">
                    <AvatarFallback className="bg-primary/10 shrink-0 rounded-sm text-xs font-semibold text-primary">
                      {item.platform.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-medium">{item.platform}</span>
                    <span className="text-muted-foreground text-sm">{item.technologies}</span>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-sm font-semibold">{item.earnings}</p>
                  <Progress
                    value={item.progressPercentage}
                    className="w-36 **:data-[slot=progress-track]:h-1.5"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground border border-dashed border-border rounded-lg p-4">
            <p className="text-xs font-medium">Belum ada proyek berstatus Deal saat ini.</p>
            <p className="text-[11px] text-muted-foreground/80 mt-1">
              Nilai estimasi akan terhitung otomatis saat ada prospek disepakati di modul CRM.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TotalEarningCard;
