"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Search,
  Copy,
  Eye,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Organization } from "@/types/index";
import ActivationSwitch from "./activation-switch";
import { useUserData } from "@/contexts/app-context";
import { formatDistanceStrict, isBefore, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLanguage } from "@/contexts/language-content";

export function DataTableDemo({
  router,
  organizations,
}: {
  router: AppRouterInstance;
  organizations: Organization[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const { t } = useLanguage();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { user } = useUserData();

  function checkNextPaymentDate(nextPaymentDate: string) {
    const today = new Date();
    const paymentDate = parseISO(nextPaymentDate);

    if (isBefore(paymentDate, today)) {
      return "Pagamento pendente!";
    }

    const daysLeft = formatDistanceStrict(today, paymentDate, {
      unit: "day",
      locale: ptBR,
    });

    return `Em ${daysLeft} dias.`;
  }

  const columns: ColumnDef<Organization>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          {t("organizations-page.name")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 pl-4">
          <div className="rounded-md bg-primary/10 p-1.5 text-primary">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent hidden md:flex"
        >
          {t("organizations-page.email")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="hidden md:block text-muted-foreground pl-4">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "nextPaymentDate",
      header: () => (
        <Button variant="ghost" className="hover:bg-transparent hidden md:flex">
          {t("organizations-page.nextPayment")}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground flex items-center gap-2 pl-4">
          {checkNextPaymentDate(row.original?.nextPaymentDate)}
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: () => (
        <Button variant="ghost" className="hover:bg-transparent hidden md:flex">
          {t("organizations-page.status")}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground flex items-center gap-2 pl-4 ">
          {user?.is_admin && (
            <ActivationSwitch
              isActive={row?.original?.is_active}
              organizationId={row.original?.id}
            />
          )}
          {row.original?.is_active
            ? t("organizations-page.active")
            : t("organizations-page.inactive")}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const { id } = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">
                  {t("organizations-page.openMenu")}
                </span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>{t("table.actions")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push(`/organizations/${id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />

                {t("table.viewDetails")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: organizations,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium">
            {t("organizations-page.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("organizations-page.manageDescription")}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 max-w-full sm:max-w-[440px]">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("organizations-page.search")}
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="pl-8 pr-2 w-full text-sm"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0">
                <span className="hidden sm:inline-block">
                  {t("organizations-page.columns")}
                </span>
                <ChevronDown className="h-4 w-4 sm:ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                {t("organizations-page.visibleColumns")}
              </DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-sm"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "id"
                      ? t("organizations-page.id")
                      : column.id === "name"
                      ? t("organizations-page.name")
                      : column.id === "email"
                      ? t("organizations-page.email")
                      : column.id === "is_active"
                      ? t("organizations-page.status")
                      : column.id === "nextPaymentDate"
                      ? t("organizations-page.nextPayment")
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={(e) => {
                      if (
                        !(e.target as HTMLElement).closest('[role="menuitem"]')
                      ) {
                        router.push(`/organizations/${row.original.id}`);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t("all-pages.no-result-found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          {table.getFilteredRowModel().rows.length}{" "}
          {t("dashboard-page.clients")}.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("organizations-page.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("organizations-page.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
