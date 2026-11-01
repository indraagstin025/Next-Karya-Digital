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

export const defaultTransactionData: TransactionItem[] = [
  {
    id: "1",
    avatar: "/images/avatars/avatar-1.webp",
    avatarFallback: "JA",
    name: "Jack Alfredo",
    amount: 316.0,
    status: "paid",
    email: "jack@shadcnstudio.com",
    paidBy: "mastercard",
  },
  {
    id: "2",
    avatar: "/images/avatars/avatar-2.webp",
    avatarFallback: "MG",
    name: "Maria Gonzalez",
    amount: 253.4,
    status: "pending",
    email: "maria.g@shadcnstudio.com",
    paidBy: "visa",
  },
  {
    id: "3",
    avatar: "/images/avatars/avatar-3.webp",
    avatarFallback: "JD",
    name: "John Doe",
    amount: 852.0,
    status: "paid",
    email: "john.doe@shadcnstudio.com",
    paidBy: "mastercard",
  },
  {
    id: "4",
    avatar: "/images/avatars/avatar-4.webp",
    avatarFallback: "EC",
    name: "Emily Carter",
    amount: 889.0,
    status: "pending",
    email: "emily.carter@shadcnstudio.com",
    paidBy: "visa",
  },
  {
    id: "5",
    avatar: "/images/avatars/avatar-5.webp",
    avatarFallback: "DL",
    name: "David Lee",
    amount: 723.16,
    status: "paid",
    email: "david.lee@shadcnstudio.com",
    paidBy: "mastercard",
  },
  {
    id: "6",
    avatar: "/images/avatars/avatar-6.webp",
    avatarFallback: "SP",
    name: "Sophia Patel",
    amount: 612.0,
    status: "failed",
    email: "sophia.patel@shadcnstudio.com",
    paidBy: "mastercard",
  },
  {
    id: "7",
    avatar: "/images/avatars/avatar-7.webp",
    avatarFallback: "RW",
    name: "Robert Wilson",
    amount: 445.25,
    status: "paid",
    email: "robert.wilson@shadcnstudio.com",
    paidBy: "visa",
  },
  {
    id: "8",
    avatar: "/images/avatars/avatar-8.webp",
    avatarFallback: "LM",
    name: "Lisa Martinez",
    amount: 297.8,
    status: "processing",
    email: "lisa.martinez@shadcnstudio.com",
    paidBy: "mastercard",
  },
  {
    id: "9",
    avatar: "/images/avatars/avatar-9.webp",
    avatarFallback: "MT",
    name: "Michael Thompson",
    amount: 756.9,
    status: "paid",
    email: "michael.thompson@shadcnstudio.com",
    paidBy: "visa",
  },
  {
    id: "10",
    avatar: "/images/avatars/avatar-10.webp",
    avatarFallback: "AJ",
    name: "Amanda Johnson",
    amount: 189.5,
    status: "pending",
    email: "amanda.johnson@shadcnstudio.com",
    paidBy: "mastercard",
  },
  {
    id: "11",
    avatar: "/images/avatars/avatar-11.webp",
    avatarFallback: "KB",
    name: "Kevin Brown",
    amount: 1024.75,
    status: "paid",
    email: "kevin.brown@shadcnstudio.com",
    paidBy: "visa",
  },
  {
    id: "12",
    avatar: "/images/avatars/avatar-12.webp",
    avatarFallback: "SD",
    name: "Sarah Davis",
    amount: 367.2,
    status: "failed",
    email: "sarah.davis@shadcnstudio.com",
    paidBy: "mastercard",
  },
];

function RowActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="icon"
            variant="ghost"
            aria-label="Edit item"
            className="cursor-pointer size-8"
          />
        }
      >
        <EllipsisVerticalIcon className="size-5" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplicate</span>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<TransactionItem>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-9">
          <AvatarImage src={row.original.avatar} alt={row.getValue("name")} />
          <AvatarFallback className="text-xs">{row.original.avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sm">
          <span className="text-card-foreground font-medium">{row.getValue("name")}</span>
          <span className="text-muted-foreground text-xs">{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <span className="font-semibold text-sm">{formatted}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const badgeClass =
        status === "paid"
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : status === "processing"
          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
          : status === "pending"
          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          : "bg-rose-500/10 text-rose-600 dark:text-rose-400";

      return (
        <Badge className={`${badgeClass} h-auto rounded-sm px-1.5 capitalize font-medium border-0`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paidBy",
    header: () => <span className="w-fit">Paid by</span>,
    cell: ({ row }) => (
      <img
        src={
          row.getValue("paidBy") === "mastercard"
            ? "/images/datatable/image-1.webp"
            : "/images/datatable/image-2.webp"
        }
        alt="Payment platform"
        className="w-10.5"
      />
    ),
  },
  {
    id: "actions",
    header: () => "Actions",
    cell: () => <RowActions />,
    size: 60,
    enableHiding: false,
  },
];

export interface DashboardTransactionTableProps {
  data?: TransactionItem[];
}

export function DashboardTransactionTable({
  data = defaultTransactionData,
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 px-6 py-4 max-sm:flex-col md:max-lg:flex-col">
        <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
          Showing{" "}
          <span>
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              Math.max(
                table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                  table.getState().pagination.pageSize,
                0
              ),
              table.getRowCount()
            )}
          </span>{" "}
          of <span>{table.getRowCount().toString()} entries</span>
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
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon aria-hidden="true" />
                  Previous
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
                  aria-label="Go to next page"
                >
                  Next
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
