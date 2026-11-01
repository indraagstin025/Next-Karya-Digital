"use client";

import React, { useState } from "react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  FileTextIcon,
  HistoryIcon,
  PencilIcon,
  SearchIcon,
  SendIcon,
  ArchiveIcon,
} from "lucide-react";
import type { CmsCategory, CmsPost, ContentStatus } from "../../types";
import { formatDateShortId } from "../../utils";
import { Card } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground shadow-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-10";

export interface PostDatatableProps {
  posts: CmsPost[];
  categories: CmsCategory[];
  onStartEdit: (post: CmsPost) => void;
  onLifecycle: (post: CmsPost, action: "publish" | "archive") => Promise<void>;
  onOpenSnapshot: (post: CmsPost) => void;
}

export function PostDatatable({
  posts,
  categories,
  onStartEdit,
  onLifecycle,
  onOpenSnapshot,
}: PostDatatableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredPosts = posts.filter((post) => {
    const matchSearch =
      !search.trim() ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.slug.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "all" || post.categoryId === categoryFilter;
    const matchStatus = statusFilter === "all" || post.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const totalPages = Math.ceil(filteredPosts.length / pageSize) || 1;
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "DRAFT":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "ARCHIVED":
        return "bg-slate-500/10 text-slate-500 dark:text-slate-400";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getStatusLabel = (status: ContentStatus) => {
    switch (status) {
      case "PUBLISHED":
        return "Sudah Tayang";
      case "DRAFT":
        return "Draf";
      case "ARCHIVED":
        return "Diarsipkan";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Filter Toolbar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-3 sm:grid-cols-4">
        <div className="relative sm:col-span-2">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari berdasarkan judul atau slug artikel..."
            className={`${INPUT_CLASS} pl-9`}
          />
        </div>
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className={INPUT_CLASS}
          >
            <option value="all">Semua Kategori ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
            <option value="all">Semua Status</option>
            <option value="PUBLISHED">Sudah Tayang (PUBLISHED)</option>
            <option value="DRAFT">Draf (DRAFT)</option>
            <option value="ARCHIVED">Diarsipkan (ARCHIVED)</option>
          </select>
        </div>
      </div>

      {/* 2. Datatable Card Sesuai Template Asli */}
      <Card className="w-full py-0 overflow-hidden shadow-xs">
        <div className="border-b">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground h-14 pl-4 font-semibold">
                  Artikel & Ringkasan
                </TableHead>
                <TableHead className="text-muted-foreground h-14 font-semibold">
                  Kategori
                </TableHead>
                <TableHead className="text-muted-foreground h-14 font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground h-14 font-semibold">
                  Tanggal Terbit
                </TableHead>
                <TableHead className="text-muted-foreground h-14 pr-4 text-right font-semibold">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPosts.length > 0 ? (
                paginatedPosts.map((post) => (
                  <TableRow key={post.id}>
                    {/* Cover Image, Title & Slug */}
                    <TableCell className="pl-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {post.coverUrl ? (
                          <img
                            src={post.coverUrl}
                            alt={post.coverAlt || post.title}
                            className="size-12 rounded-lg object-cover border border-border shadow-2xs shrink-0"
                          />
                        ) : (
                          <Avatar className="size-12 rounded-lg">
                            <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                              <FileTextIcon className="size-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col text-sm min-w-0">
                          <span
                            onClick={() => onStartEdit(post)}
                            className="text-card-foreground font-semibold truncate cursor-pointer hover:text-primary transition-colors max-w-xs sm:max-w-md"
                          >
                            {post.title}
                          </span>
                          <span className="text-muted-foreground text-xs font-mono truncate max-w-xs">
                            /{post.slug}
                          </span>
                          {post.excerpt && (
                            <span className="text-muted-foreground text-[11px] truncate max-w-sm mt-0.5 line-clamp-1">
                              {post.excerpt}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="py-3.5">
                      <Badge className="bg-primary/10 text-primary border-0 rounded-sm font-medium h-auto px-2 py-0.5">
                        {post.category?.name || "Tanpa Kategori"}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3.5">
                      <Badge
                        className={`${getStatusBadge(
                          post.status
                        )} border-0 rounded-sm font-semibold h-auto px-2 py-0.5`}
                      >
                        {getStatusLabel(post.status)}
                      </Badge>
                    </TableCell>

                    {/* Published Date */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarIcon className="size-3.5 opacity-70" />
                        <span>
                          {post.publishedAt
                            ? formatDateShortId(post.publishedAt)
                            : "Belum terbit"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions Dropdown */}
                    <TableCell className="pr-4 py-3.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8 cursor-pointer"
                              aria-label="Aksi artikel"
                            />
                          }
                        >
                          <EllipsisVerticalIcon className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => onStartEdit(post)}>
                              <PencilIcon className="size-4 mr-2" />
                              <span>Sunting Artikel</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onOpenSnapshot(post)}
                            >
                              <HistoryIcon className="size-4 mr-2" />
                              <span>Riwayat Revisi</span>
                            </DropdownMenuItem>
                            {post.status !== "PUBLISHED" ? (
                              <DropdownMenuItem
                                onClick={() => onLifecycle(post, "publish")}
                              >
                                <SendIcon className="size-4 mr-2 text-emerald-500" />
                                <span>Terbitkan Sekarang</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => onLifecycle(post, "archive")}
                              >
                                <ArchiveIcon className="size-4 mr-2 text-rose-500" />
                                <span>Arsipkan Artikel</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-28 text-center text-xs text-muted-foreground"
                  >
                    Tidak ada artikel yang cocok dengan filter pencarian.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 3. Datatable Pagination Sesuai Template Asli */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 max-sm:flex-col md:max-lg:flex-col">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            Showing{" "}
            <span>
              {filteredPosts.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
              {Math.min(page * pageSize, filteredPosts.length)}
            </span>{" "}
            of <span>{filteredPosts.length} entries</span>
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

export default PostDatatable;
