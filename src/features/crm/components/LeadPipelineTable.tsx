"use client";

import React, { useState } from "react";
import {
  MessageSquareIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "lucide-react";
import type { CmsLeadItem, CmsStaffMember, LeadStatus } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-10";
const ICON_BTN_CLASS =
  "inline-flex items-center justify-center rounded-lg border border-border bg-card p-2 text-foreground shadow-xs transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer min-h-9 min-w-9";

interface LeadPipelineTableProps {
  leads: CmsLeadItem[];
  staffUsers: CmsStaffMember[];
  onUpdateStatus: (lead: CmsLeadItem, status: LeadStatus) => Promise<void>;
  onReassign: (lead: CmsLeadItem, staffId: string) => Promise<void>;
  onOpenNotes: (lead: CmsLeadItem) => void;
}

export function LeadPipelineTable({
  leads,
  staffUsers,
  onUpdateStatus,
  onReassign,
  onOpenNotes,
}: LeadPipelineTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredLeads = leads.filter((item) => {
    const matchSearch =
      !search.trim() ||
      item.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (item.companyName && item.companyName.toLowerCase().includes(search.toLowerCase())) ||
      item.whatsappNumber.includes(search);
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const currentLeads = filteredLeads.slice((page - 1) * pageSize, page * pageSize);

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "DEAL":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "PROPOSAL":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "DIHUBUNGI":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "BATAL":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
      case "BARU":
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari berdasarkan nama klien, perusahaan, atau nomor WhatsApp..."
            className={`${INPUT_CLASS} pl-9`}
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className={INPUT_CLASS}
          >
            <option value="all">Semua Status ({leads.length})</option>
            <option value="BARU">Baru Masuk</option>
            <option value="DIHUBUNGI">Sudah Dihubungi</option>
            <option value="PROPOSAL">Proposal Penawaran</option>
            <option value="DEAL">Deal / Kesepakatan</option>
            <option value="BATAL">Batal</option>
          </select>
        </div>
      </div>

      {/* Datatable Ber-avatar Mengikuti Template Asli */}
      <Card className="w-full py-0 overflow-hidden shadow-xs">
        <div className="border-b">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground h-14 pl-4 font-semibold">
                  Calon Klien
                </TableHead>
                <TableHead className="text-muted-foreground h-14 font-semibold">
                  Layanan & Kontak
                </TableHead>
                <TableHead className="text-muted-foreground h-14 font-semibold">
                  Nilai Deal
                </TableHead>
                <TableHead className="text-muted-foreground h-14 font-semibold">
                  Status Pipeline
                </TableHead>
                <TableHead className="text-muted-foreground h-14 font-semibold">
                  PIC Staff
                </TableHead>
                <TableHead className="text-muted-foreground h-14 pr-4 text-right font-semibold">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLeads.length > 0 ? (
                currentLeads.map((item, index) => {
                  const avatarNum = ((index + (page - 1) * pageSize) % 15) + 1;
                  const initials = item.clientName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <TableRow key={item.id}>
                      {/* Customer Avatar & Name */}
                      <TableCell className="pl-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarImage
                              src={`/images/avatars/avatar-${avatarNum}.webp`}
                              alt={item.clientName}
                            />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col text-sm min-w-0">
                            <span className="text-card-foreground font-semibold truncate">
                              {item.clientName}
                            </span>
                            {item.companyName && (
                              <span className="text-muted-foreground text-xs truncate">
                                {item.companyName}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Service & Contact Info */}
                      <TableCell className="py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium text-foreground">
                            {item.serviceRequested}
                          </span>
                          <div className="flex items-center gap-2 text-xs">
                            <a
                              href={`https://wa.me/${item.whatsappNumber.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                            >
                              +{item.whatsappNumber}
                              <ExternalLinkIcon className="size-3 opacity-70" />
                            </a>
                            {item.email && (
                              <span className="text-muted-foreground text-[11px] truncate max-w-32">
                                {item.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Deal Value */}
                      <TableCell className="py-3.5">
                        <span className="font-semibold text-sm">
                          {item.dealValue > 0
                            ? `Rp ${item.dealValue.toLocaleString("id-ID")}`
                            : "Rp 0"}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${getStatusBadge(
                              item.status
                            )} h-auto rounded-sm px-2 py-0.5 capitalize font-medium border-0`}
                          >
                            {item.status}
                          </Badge>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              onUpdateStatus(item, e.target.value as LeadStatus)
                            }
                            className="rounded border border-border bg-card px-1.5 py-0.5 text-[11px] font-semibold text-foreground cursor-pointer"
                          >
                            <option value="BARU">BARU</option>
                            <option value="DIHUBUNGI">DIHUBUNGI</option>
                            <option value="PROPOSAL">PROPOSAL</option>
                            <option value="DEAL">DEAL</option>
                            <option value="BATAL">BATAL</option>
                          </select>
                        </div>
                      </TableCell>

                      {/* Assigned Staff */}
                      <TableCell className="py-3.5">
                        <select
                          value={item.assignedToId || ""}
                          onChange={(e) => onReassign(item, e.target.value)}
                          className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-muted-foreground cursor-pointer min-h-8"
                          title="Pilih PIC Penanggung Jawab"
                        >
                          <option value="">Belum Ditugaskan</option>
                          {staffUsers.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.fullName}
                            </option>
                          ))}
                        </select>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="pr-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onOpenNotes(item)}
                          className={ICON_BTN_CLASS}
                          aria-label="Catatan interaksi"
                          title="Buka catatan komunikasi klien"
                        >
                          <MessageSquareIcon className="size-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-28 text-center text-xs text-muted-foreground">
                    Tidak ada calon klien yang sesuai dengan filter pencarian.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Datatable Pagination Sesuai Template Asli */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 max-sm:flex-col md:max-lg:flex-col">
          <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
            Showing{" "}
            <span>
              {filteredLeads.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
              {Math.min(page * pageSize, filteredLeads.length)}
            </span>{" "}
            of <span>{filteredLeads.length} entries</span>
          </p>

          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    className="disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                    variant="ghost"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeftIcon aria-hidden="true" className="size-4" />
                    Previous
                  </Button>
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isActive = p === page;
                  return (
                    <PaginationItem key={p}>
                      <Button
                        size="icon"
                        className={`cursor-pointer ${
                          !isActive
                            ? "bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20"
                            : ""
                        }`}
                        onClick={() => setPage(p)}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {p}
                      </Button>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <Button
                    className="disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                    variant="ghost"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    aria-label="Go to next page"
                  >
                    Next
                    <ChevronRightIcon aria-hidden="true" className="size-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default LeadPipelineTable;
