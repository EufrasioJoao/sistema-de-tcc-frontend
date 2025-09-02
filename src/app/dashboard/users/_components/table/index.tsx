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
  Filter,
  Eye,
  User2,
  Mail,
  Shield,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

import { User, UserRoles } from "@/types/index";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useUserData } from "@/contexts/app-context";
import ActivationSwitch from "./activation-switch";

export function DataTableDemo({
  router,
  users,
}: {
  router: AppRouterInstance;
  users: User[];
}) {
  const { user } = useUserData();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const roleMapping: Record<string, string> = {
    [UserRoles.ADMIN]: "Administrador",
    [UserRoles.SISTEM_MANAGER]: "Gerente de Sistema",
    [UserRoles.COURSE_COORDENATOR]: "Coordenador de Curso",
    [UserRoles.ACADEMIC_REGISTER]: "Registro Acadêmico",
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "first_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <User2 className="mr-2 h-4 w-4" />
            Nome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center space-x-3 py-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {row.getValue("first_name")?.toString().charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
              {row.getValue("first_name")}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ID: {row.original.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Mail className="mr-2 h-4 w-4" />
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 py-2">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
          <span className="text-gray-700 dark:text-gray-300 font-mono text-sm">
            {row.getValue("email")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Status
          </span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-3 py-2">
          {user?.role === UserRoles.ADMIN && (
            <ActivationSwitch
              isActive={row.original.is_active}
              userId={row.original.id}
            />
          )}
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
              row.original.is_active
                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 dark:border-green-700"
                : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-300 dark:border-red-700"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                row.original.is_active
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            {row.original.is_active ? "Ativo" : "Inativo"}
          </motion.span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: () => (
        <div className="flex items-center justify-end">
          <Shield className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Perfil
          </span>
        </div>
      ),
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const roleColors = {
          [UserRoles.ADMIN]: "from-red-500 to-pink-500",
          [UserRoles.SISTEM_MANAGER]: "from-blue-500 to-indigo-500",
          [UserRoles.COURSE_COORDENATOR]: "from-purple-500 to-violet-500",
          [UserRoles.ACADEMIC_REGISTER]: "from-green-500 to-emerald-500",
        };
        return (
          <div className="flex items-center justify-end py-2">
            <motion.span
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
                roleColors[role as UserRoles] || "from-gray-500 to-gray-600"
              } shadow-lg`}
            >
              <Shield className="w-3 h-3 mr-1.5" />
              {roleMapping[role] || role}
            </motion.span>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Ações
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push(`/dashboard/users/${id}`)}
                  className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <Eye className="mr-2 h-4 w-4 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Ver detalhes do usuário
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
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
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Header Section */}
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Gerenciamento de Usuários
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {table.getFilteredRowModel().rows.length} usuários encontrados
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome..."
                value={
                  (table.getColumn("first_name")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("first_name")
                    ?.setFilterValue(event.target.value)
                }
                className="pl-10 w-full sm:w-64 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Colunas
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const columnHeaderMap: { [key: string]: string } = {
                      first_name: "Nome",
                      email: "Email",
                      is_active: "Status",
                      role: "Perfil",
                    };
                    const displayText = columnHeaderMap[column.id] || column.id;
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {displayText}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Table */}
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200 group"
                    onClick={(e) => {
                      if (
                        !(e.target as HTMLElement).closest(
                          '[role="menuitem"]'
                        ) &&
                        !(e.target as HTMLElement).closest('[role="switch"]')
                      ) {
                        router.push(`/dashboard/users/${row.original.id}`);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap group-hover:bg-gray-50/50 dark:group-hover:bg-gray-800/30 transition-colors"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <User2 className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          Nenhum usuário encontrado
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Tente ajustar os filtros de busca
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>

      {/* Enhanced Pagination */}
      <motion.div
        className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 mt-4 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>
          <span className="text-gray-400">•</span>
          <span>{table.getFilteredRowModel().rows.length} total</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Próximo
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
