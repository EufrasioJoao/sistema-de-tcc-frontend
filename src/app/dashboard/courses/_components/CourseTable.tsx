"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Search,
  Filter,
  Eye,
  GraduationCap,
  Users,
  FileText,
  Settings,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  RefreshCw,
  Loader2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  name: string;
  coordinatorId: string | null;
  createdAt: string;
  updatedAt: string;
  coordinator: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  _count: {
    students: number;
    tccs: number;
  };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface Filters {
  search: string;
  coordinator: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface CourseTableProps {
  refreshTrigger: number;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const TableSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 dark:bg-gray-800/50">
          {[1, 2, 3, 4, 5].map((i) => (
            <TableHead key={i} className="px-6 py-4">
              <Skeleton className="h-4 w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3, 4, 5].map((i) => (
          <TableRow
            key={i}
            className="border-b border-gray-100 dark:border-gray-800"
          >
            {[1, 2, 3, 4, 5].map((j) => (
              <TableCell key={j} className="px-6 py-4">
                <Skeleton className="h-6 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export function CourseTable({
  refreshTrigger,
  onEdit,
  onDelete,
}: CourseTableProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [filters, setFilters] = useState<Filters>({
    search: "",
    coordinator: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: debouncedSearch,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      if (filters.coordinator) {
        params.append("coordinator", filters.coordinator);
      }

      const response = await api.get(`/api/courses?${params.toString()}`);

      if (response.data.success) {
        setCourses(response.data.courses);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    filters.sortBy,
    filters.sortOrder,
    filters.coordinator,
    refreshTrigger,
  ]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleRefresh = () => {
    fetchCourses();
  };

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              const isAsc = column.getIsSorted() === "asc";
              setFilters((prev) => ({
                ...prev,
                sortBy: "name",
                sortOrder: isAsc ? "desc" : "asc",
              }));
            }}
            className="h-auto p-0 font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Nome do Curso
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center space-x-3 py-2">
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {row.getValue("name")}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ID: {row.original.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "coordinator",
      header: () => (
        <div className="flex items-center">
          <UserCheck className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Coordenador
          </span>
        </div>
      ),
      cell: ({ row }) => {
        const coordinator = row.original.coordinator;
        return (
          <div className="flex items-center space-x-2 py-2">
            {coordinator ? (
              <>
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  {coordinator.first_name.charAt(0)}
                  {coordinator.last_name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {coordinator.first_name} {coordinator.last_name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {coordinator.email}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <UserX className="h-4 w-4 text-gray-400" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Sem coordenador
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "_count.students",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              const isAsc =
                filters.sortBy === "students" && filters.sortOrder === "asc";
              setFilters((prev) => ({
                ...prev,
                sortBy: "students",
                sortOrder: isAsc ? "desc" : "asc",
              }));
            }}
            className="h-auto p-0 font-semibold text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
          >
            <Users className="mr-2 h-4 w-4" />
            Estudantes
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center justify-center py-2">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          >
            <Users className="w-3 h-3 mr-1.5" />
            {row.original._count.students}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "_count.tccs",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              const isAsc =
                filters.sortBy === "tccs" && filters.sortOrder === "asc";
              setFilters((prev) => ({
                ...prev,
                sortBy: "tccs",
                sortOrder: isAsc ? "desc" : "asc",
              }));
            }}
            className="h-auto p-0 font-semibold text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
          >
            <FileText className="mr-2 h-4 w-4" />
            TCCs
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center justify-center py-2">
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
          >
            <FileText className="w-3 h-3 mr-1.5" />
            {row.original._count.tccs}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Data de Criação
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400 py-2">
          {new Date(row.getValue("createdAt")).toLocaleDateString("pt-BR")}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const course = row.original;

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
                  className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  onClick={() => router.push(`/dashboard/courses/${course.id}`)}
                >
                  <Eye className="mr-2 h-4 w-4 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Ver detalhes
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                  onClick={() => onEdit(course)}
                >
                  <Edit className="mr-2 h-4 w-4 text-yellow-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Editar curso
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600"
                  onClick={() => onDelete(course)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Excluir curso</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: courses,
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

  if (loading) {
    return <TableSkeleton />;
  }

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
              <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Lista de Cursos
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {table.getFilteredRowModel().rows.length} cursos encontrados
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto flex-wrap gap-4">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome do curso..."
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }))
                }
                className="pl-10 w-full sm:w-64 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, search: "" }))
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Coordenador</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, coordinator: "" }))
                  }
                >
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, coordinator: "with" }))
                  }
                >
                  Com coordenador
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, coordinator: "without" }))
                  }
                >
                  Sem coordenador
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

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
                      name: "Nome",
                      coordinator: "Coordenador",
                      "_count.students": "Estudantes",
                      "_count.tccs": "TCCs",
                      createdAt: "Data de Criação",
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
                        <GraduationCap className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          Nenhum curso encontrado
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Tente ajustar os filtros de busca ou adicione um novo
                          curso
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
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <span className="text-gray-400">•</span>
          <span>{pagination.total} total</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPreviousPage}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Próximo
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
