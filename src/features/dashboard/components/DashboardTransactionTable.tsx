"use client";

import { useState } from "react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon } from "lucide-react";
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
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePagination } from "@/hooks/use-pagination";

export type TransactionItem = {
  id: string;
  avatar: string;
  avatarFallback: string;
  name: string;
  email: string;
  amount: number;
  status: "pending" | "processing" | "paid" | "failed";
  paidBy: "mastercard" | "visa";
};

function RowActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="icon"
            variant="ghost"
            aria-label="Aksi baris"
            className="cursor-pointer size-8"
          />
        }
      >
        <EllipsisVerticalIcon className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Lihat Detail</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Hubungi WhatsApp</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<TransactionItem>[] = [
  {
    accessorKey: "name",
    header: "Calon Klien",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-9">
          <AvatarImage src={row.original.avatar} alt={row.getValue("name")} />
          <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
            {row.original.avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sm">
          <span className="text-card-foreground font-semibold">{row.getValue("name")}</span>
          <span className="text-muted-foreground text-xs">{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Estimasi Nilai",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(amount);

      return <span className="font-semibold text-sm">{formatted}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status Pipeline",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const badgeConfig =
        status === "paid"
          ? {
              label: "Deal",
              className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            }
          : status === "processing"
          ? {
              label: "Penawaran",
              className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            }
          : status === "pending"
          ? {
              label: "Konsultasi",
              className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            }
          : {
              label: "Batal",
              className: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
            };

      return (
        <Badge
          className={`${badgeConfig.className} h-auto rounded-sm px-2 py-0.5 capitalize font-medium border-0`}
        >
          {badgeConfig.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paidBy",
    header: () => <span className="w-fit">Tahap Pengerjaan</span>,
    cell: ({ row }) => {
      const isTermin = row.getValue("paidBy") === "visa";
      return (
        <span className="text-xs text-muted-foreground font-medium">
          {isTermin ? "Termin Pengerjaan" : "Kesepakatan Awal"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => "Aksi",
    cell: () => <RowActions />,
    size: 60,
    enableHiding: false,
  },
];

export interface DashboardTransactionTableProps {
  data?: TransactionItem[];
}

export function DashboardTransactionTable({
  data = [],
}: DashboardTransactionTableProps) {
  const pageSize = 5;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 2,
  });

  return (
    <div className="w-full">
      <div className="border-b">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-muted-foreground h-14 first:pl-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="first:pl-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada data permohonan konsultasi masuk.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 px-6 py-4 max-sm:flex-col md:max-lg:flex-col">
        <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
          Menampilkan{" "}
          <span>
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} sampai{" "}
            {Math.min(
              Math.max(
                table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                  table.getState().pagination.pageSize,
                0
              ),
              table.getRowCount()
            )}
          </span>{" "}
          dari <span>{table.getRowCount().toString()} entri</span>
        </p>

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  className="disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                  variant="ghost"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeftIcon aria-hidden="true" />
                  Sebelumnya
                </Button>
              </PaginationItem>

              {showLeftEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {pages.map((page) => {
                const isActive = page === table.getState().pagination.pageIndex + 1;

                return (
                  <PaginationItem key={page}>
                    <Button
                      size="icon"
                      className={`cursor-pointer ${
                        !isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40"
                          : ""
                      }`}
                      onClick={() => table.setPageIndex(page - 1)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                );
              })}

              {showRightEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <Button
                  className="disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                  variant="ghost"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Halaman berikutnya"
                >
                  Berikutnya
                  <ChevronRightIcon aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default DashboardTransactionTable;
