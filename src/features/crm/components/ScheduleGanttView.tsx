"use client";

import React from "react";
import { CalendarIcon, Trash2Icon } from "lucide-react";
import type { CmsScheduleItem } from "../types";

const DANGER_BTN_CLASS =
  "inline-flex items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive shadow-xs transition hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive cursor-pointer min-h-11";

interface ScheduleGanttViewProps {
  schedules: CmsScheduleItem[];
  onDeleteSchedule: (id: string) => Promise<void>;
}

export function ScheduleGanttView({
  schedules,
  onDeleteSchedule,
}: ScheduleGanttViewProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs">
        <div className="border-b border-border pb-3">
          <h2 className="text-sm font-bold text-foreground">
            Agenda &amp; Timeline Pengerjaan Proyek
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Jadwal milestone pengerjaan pesanan klien yang sedang aktif dikerjakan tim.
          </p>
        </div>

        <div className="mt-4 divide-y divide-border">
          {schedules.map((sc) => (
            <div
              key={sc.id}
              className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground">{sc.taskName}</span>
                  <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {sc.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="size-3.5 text-muted-foreground" />
                    <span>
                      {new Date(sc.startDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      -{" "}
                      {new Date(sc.endDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </span>
                  {sc.lead && (
                    <span>Klien: {sc.lead.clientName} ({sc.lead.serviceRequested})</span>
                  )}
                  {sc.assignedTo && (
                    <span>PIC: {sc.assignedTo.fullName}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => onDeleteSchedule(sc.id)}
                  className={DANGER_BTN_CLASS}
                >
                  <Trash2Icon className="size-3.5 mr-1" />
                  Hapus
                </button>
              </div>
            </div>
          ))}

          {schedules.length === 0 && (
            <div className="rounded-xl border border-dashed border-border py-12 text-center text-xs text-muted-foreground">
              Belum ada jadwal proyek aktif yang dicatat. Buat jadwal baru melalui tombol di atas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
