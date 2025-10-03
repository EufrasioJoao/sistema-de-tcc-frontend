"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import { downloadTCCFile } from "@/lib/download";
import { useFileViewer } from "@/lib/file-viewer";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Eye,
  Edit,
  Trash2,
  Download,
  FileText,
  Calendar,
  User,
  GraduationCap,
  Building2,
  Loader2,
  Search,
  Filter,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { PermissionGuard, usePermissions } from "@/components/PermissionGuard";
import { TCC as TCCType } from "@/types/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Use the imported TCC type instead of local interface
type TCC = TCCType;

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
  type: string;
  year: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface TCCTableProps {
  refreshTrigger: number;
  onEdit: (tcc: TCC) => void;
  onDelete: (tcc: TCC) => void;
  onView: (tcc: TCC) => void;
  onAdd?: () => void;
}

const typeLabels = {
  BACHELOR: "Monografia",
  MASTER: "Dissertação",
  DOCTORATE: "Tese",
};

const typeColors = {
  BACHELOR: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  MASTER:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  DOCTORATE:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

// TCC columns definition for TanStack React Table
const createTCCColumns = (
  onView: (tcc: TCC) => void,
  onEdit: (tcc: TCC) => void,
  onDelete: (tcc: TCC) => void,
  openFileInViewer: (
    tccId: string,
    fileId: string,
    fileName: string,
    fileType: "main" | "defense"
  ) => void,
  downloadingFiles: Set<string>,
  handleDownload: (tcc: TCC, fileType: "main" | "defense") => void
): ColumnDef<TCC>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Título
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {row.getValue("title")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const type = row.getValue("type") as "BACHELOR" | "MASTER" | "DOCTORATE";
        return <Badge className={typeColors[type]}>{typeLabels[type]}</Badge>;
      },
    },
    {
      accessorKey: "author",
      header: "Autor",
      cell: ({ row }) => {
        const tcc = row.original;
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {tcc?.author?.firstName} {tcc?.author?.lastName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tcc?.author?.studentNumber}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "supervisor",
      header: "Supervisor",
      cell: ({ row }) => {
        const tcc = row.original;
        return (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-purple-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {tcc?.supervisor?.first_name} {tcc?.supervisor?.last_name}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "course",
      header: "Curso",
      cell: ({ row }) => {
        const tcc = row.original;
        return (
          <div className="max-w-[200px]">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {tcc?.course?.name}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "year",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Ano
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-green-500" />
          <span className="font-medium">{row.getValue("year")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Ações",
      enableHiding: false,
      cell: ({ row }) => {
        const tcc = row.original;
        const downloadKey = `${tcc?.id}-main`;
        const isDownloading = downloadingFiles.has(downloadKey);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <PermissionGuard requireViewTCC tcc={tcc}>
                <DropdownMenuItem onClick={() => onView(tcc)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Detalhes
                </DropdownMenuItem>
              </PermissionGuard>
              <DropdownMenuSeparator />
              <PermissionGuard requireModifyTCC tcc={tcc}>
                <DropdownMenuItem onClick={() => onEdit(tcc)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              </PermissionGuard>
              <PermissionGuard requireDownloadFile tcc={tcc}>
                <DropdownMenuItem
                  onClick={() => handleDownload(tcc, "main")}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {isDownloading ? "Baixando..." : "Download"}
                </DropdownMenuItem>
              </PermissionGuard>
              <DropdownMenuSeparator />
              <PermissionGuard requireDeleteTCC tcc={tcc}>
                <DropdownMenuItem
                  onClick={() => onDelete(tcc)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </PermissionGuard>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

export function TCCTable({
  refreshTrigger,
  onEdit,
  onDelete,
  onView,
  onAdd,
}: TCCTableProps) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set()
  );
  const [showFilters, setShowFilters] = React.useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [tccs, setTccs] = useState<TCC[]>([]);
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
    type: "all",
    year: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { openFileInViewer } = useFileViewer();

  // Check if any filters are active
  const hasActiveFilters =
    filters.search || filters.type !== "all" || filters.year !== "all";

  // Clear all filters
  const clearAllFilters = () => {
    setSearchInput(""); // Clear the search input field
    handleFiltersChange({
      search: "",
      type: "all",
      year: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  // Debounce the search input
  const debouncedSearch = useDebounce(searchInput, 500);

  // Handle debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setIsSearching(true);
      setFilters((prev) => ({ ...prev, search: debouncedSearch }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  }, [debouncedSearch, filters.search]);

  // Reset searching state when loading changes
  useEffect(() => {
    if (!loading) {
      setIsSearching(false);
    }
  }, [loading]);

  // Fetch TCCs when filters, pagination, or refreshTrigger changes
  useEffect(() => {
    fetchTCCs();
  }, [
    pagination.page,
    filters.type,
    filters.year,
    filters.sortBy,
    filters.sortOrder,
    filters.search,
    refreshTrigger,
  ]);

  const fetchTCCs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: filters.search,
        type: filters.type,
        year: filters.year,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const response = await api.get(`/api/tccs?${params.toString()}`);
      if (response?.data.success) {
        setTccs(response?.data.data);
        setPagination(response?.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching TCCs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleDownload = async (
    tcc: TCC,
    fileType: "main" | "defense" = "main"
  ) => {
    const downloadKey = `${tcc?.id}-${fileType}`;

    if (downloadingFiles.has(downloadKey)) return;

    setDownloadingFiles((prev) => new Set(prev).add(downloadKey));

    const fileName =
      fileType === "main"
        ? tcc?.file?.displayName
        : tcc?.defenseRecordFile?.displayName || "ata-defesa.pdf";

    await downloadTCCFile(tcc?.id, fileType, fileName as string, () => {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(downloadKey);
        return newSet;
      });
    });
  };

  const columns = createTCCColumns(
    onView,
    onEdit,
    onDelete,
    openFileInViewer,
    downloadingFiles,
    handleDownload
  );

  const table = useReactTable({
    data: tccs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: pagination.totalPages,
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            TCCs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tccs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            TCCs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Nenhum TCC encontrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {hasActiveFilters
                ? "Tente ajustar os filtros para encontrar mais resultados"
                : "Comece adicionando o primeiro TCC ao sistema."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={fetchTCCs} variant="outline">
                Atualizar
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Container with Border */}
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardContent className="p-6 space-y-6">
          {/* Modern Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    TCCs
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tccs.length} trabalhos de conclusão de curso
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTCCs}
                className="gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
              {onAdd && (
                <Button
                  onClick={onAdd}
                  className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  Novo TCC
                </Button>
              )}
            </div>
          </div>

          {/* Modern Search and Filter Bar */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-4">
              <div className="flex items-center gap-4">
                {/* Global Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 animate-spin" />
                  )}
                  <Input
                    placeholder="Pesquisar TCCs..."
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    className={`pl-10 ${isSearching ? "pr-10" : ""
                      } bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  />
                </div>

                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`gap-2 ${showFilters ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                  {hasActiveFilters && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-500 text-white rounded-full">
                      {
                        [
                          filters.search,
                          filters.type !== "all",
                          filters.year !== "all",
                        ].filter(Boolean).length
                      }
                    </span>
                  )}
                </Button>

                {/* Column Visibility */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Colunas
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>
                      Visibilidade das Colunas
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        const columnNames: Record<string, string> = {
                          title: "Título",
                          type: "Tipo",
                          author: "Autor",
                          supervisor: "Supervisor",
                          course: "Curso",
                          year: "Ano",
                        };

                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {columnNames[column.id] || column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="gap-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Type Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tipo de TCC
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {filters.type === "all"
                              ? "Todos os tipos"
                              : typeLabels[
                              filters.type as keyof typeof typeLabels
                              ]}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          <DropdownMenuItem
                            onClick={() => handleFiltersChange({ type: "all" })}
                          >
                            Todos os tipos
                          </DropdownMenuItem>
                          {Object.keys(typeLabels).map((type) => (
                            <DropdownMenuItem
                              key={type}
                              onClick={() => handleFiltersChange({ type })}
                            >
                              {typeLabels[type as keyof typeof typeLabels]}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Year Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ano
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {filters.year === "all"
                              ? "Todos os anos"
                              : filters.year}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          <DropdownMenuItem
                            onClick={() => handleFiltersChange({ year: "all" })}
                          >
                            Todos os anos
                          </DropdownMenuItem>
                          {[2024, 2023, 2022, 2021, 2020].map((year) => (
                            <DropdownMenuItem
                              key={year}
                              onClick={() =>
                                handleFiltersChange({ year: year.toString() })
                              }
                            >
                              {year}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Results Info */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Resultados
                      </label>
                      <div className="flex items-center h-9 px-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {pagination.total} TCCs encontrados
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="bg-gray-50 dark:bg-gray-800/50"
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-b-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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
                        <Search className="h-8 w-8 text-gray-400" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Nenhum resultado encontrado
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {hasActiveFilters
                              ? "Tente ajustar os filtros para encontrar mais resultados"
                              : "Não há TCCs cadastrados no sistema"}
                          </p>
                        </div>
                        {hasActiveFilters && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearAllFilters}
                            className="gap-2"
                          >
                            <X className="h-4 w-4" />
                            Limpar Filtros
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex-1 text-sm">
                  Página {pagination.page} de {pagination.totalPages} (
                  {pagination.total} TCCs no total)
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                    {pagination.page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
