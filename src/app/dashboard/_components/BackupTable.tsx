"use client";
import * as React from "react";
import { motion } from "framer-motion";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, Download, RefreshCw, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Database, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDebounce } from "@/hooks/useDebounce";

interface Backup {
    id: string;
    filename: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
    file_size: number | null;
    created_at: string;
    completed_at: string | null;
    started_at: string | null;
    error_message: string | null;
}

interface BackupTableProps {
    backups?: Backup[];
    loading?: boolean;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    onDownload?: (backup: Backup) => void;
    onRefresh?: (filters: BackupFilters) => void;
    onPageChange?: (page: number) => void;
}

interface BackupFilters {
    search: string;
    status: string;
    sortBy: string;
    sortOrder: string;
    page: number;
    limit: number;
}

function formatFileSize(bytes: number | null): string {
    if (!bytes) return "N/A";

    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
}

function getStatusIcon(status: string) {
    switch (status) {
        case "COMPLETED":
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        case "FAILED":
            return <XCircle className="h-4 w-4 text-red-500" />;
        case "IN_PROGRESS":
            return <Clock className="h-4 w-4 text-yellow-500" />;
        case "PENDING":
            return <AlertCircle className="h-4 w-4 text-blue-500" />;
        default:
            return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
}

function getStatusBadge(status: string) {
    switch (status) {
        case "COMPLETED":
            return (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Concluído
                </Badge>
            );
        case "FAILED":
            return (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Falhou
                </Badge>
            );
        case "IN_PROGRESS":
            return (
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Em Progresso
                </Badge>
            );
        case "PENDING":
            return (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Pendente
                </Badge>
            );
        default:
            return (
                <Badge variant="secondary">
                    Desconhecido
                </Badge>
            );
    }
}

// Backup columns definition for TanStack React Table
const createBackupColumns = (
    onDownload?: (backup: Backup) => void,
    downloadingId?: string | null
): ColumnDef<Backup>[] => [
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
            accessorKey: "filename",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold"
                >
                    Nome do Arquivo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="max-w-[300px]">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {row.getValue("filename")}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Criado {formatDistanceToNow(new Date(row.original.created_at), {
                            addSuffix: true,
                            locale: ptBR
                        })}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const backup = row.original;
                return (
                    <div className="flex items-center gap-2">
                        {getStatusIcon(backup.status)}
                        {getStatusBadge(backup.status)}
                    </div>
                );
            },
        },
        {
            accessorKey: "file_size",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold"
                >
                    Tamanho
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium">
                    {formatFileSize(row.original.file_size)}
                </div>
            ),
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold"
                >
                    Data de Criação
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const backup = row.original;
                return (
                    <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                            {new Date(backup.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(backup.created_at).toLocaleTimeString('pt-BR')}
                        </p>
                    </div>
                );
            },
        },
        {
            accessorKey: "completed_at",
            header: "Concluído em",
            cell: ({ row }) => {
                const backup = row.original;
                if (!backup.completed_at) {
                    return <span className="text-gray-400">-</span>;
                }
                return (
                    <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                            {new Date(backup.completed_at).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(backup.completed_at).toLocaleTimeString('pt-BR')}
                        </p>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => {
                const backup = row.original;

                if (backup.status !== "COMPLETED") {
                    return <span className="text-gray-400">-</span>;
                }

                return (
                    <Button
                        onClick={() => onDownload?.(backup)}
                        disabled={downloadingId === backup.id}
                        size="sm"
                        variant="outline"
                        className="border-slate-200 dark:border-slate-700"
                    >
                        {downloadingId === backup.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                    </Button>
                );
            },
            enableSorting: false,
        },
    ];

export function BackupTable({
    backups = [],
    loading = false,
    pagination,
    onDownload,
    onRefresh,
    onPageChange,
}: BackupTableProps) {
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

    // Filters state
    const [filters, setFilters] = React.useState<BackupFilters>({
        search: "",
        status: "all",
        sortBy: "created_at",
        sortOrder: "desc",
        page: 1,
        limit: 10,
    });

    // Debounce search input to avoid too many API calls
    const debouncedSearch = useDebounce(filters.search, 500);

    // Effect to trigger search when debounced value changes
    React.useEffect(() => {
        const newFilters = { ...filters, search: debouncedSearch, page: 1 };
        onRefresh?.(newFilters);
    }, [debouncedSearch]);

    const handleDownload = async (backup: Backup) => {
        setDownloadingId(backup.id);
        try {
            await onDownload?.(backup);
        } finally {
            setDownloadingId(null);
        }
    };

    const handleFilterChange = (key: keyof BackupFilters, value: string | number) => {
        const newFilters = { ...filters, [key]: value };
        if (key !== 'page') {
            newFilters.page = 1; // Reset to first page when filters change
        }
        setFilters(newFilters);

        // For search, let debounce handle the API call
        // For other filters, call immediately
        if (key !== 'search') {
            onRefresh?.(newFilters);
        }
    };

    const handlePageChange = (newPage: number) => {
        handleFilterChange('page', newPage);
        onPageChange?.(newPage);
    };

    const columns = createBackupColumns(handleDownload, downloadingId);

    const table = useReactTable({
        data: backups,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
        },
        manualPagination: true,
        manualSorting: true,
    });

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-600" />
                        Histórico de Backups
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

    return (
        <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                <CardContent className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                    <Database className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                        Histórico de Backups
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {pagination?.total || backups.length} backups registrados
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar por nome do arquivo..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select
                            value={filters.status}
                            onValueChange={(value) => handleFilterChange('status', value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Status</SelectItem>
                                <SelectItem value="PENDING">Pendente</SelectItem>
                                <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                                <SelectItem value="COMPLETED">Concluído</SelectItem>
                                <SelectItem value="FAILED">Falhou</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={`${filters.sortBy}-${filters.sortOrder}`}
                            onValueChange={(value) => {
                                const [sortBy, sortOrder] = value.split('-');
                                handleFilterChange('sortBy', sortBy);
                                handleFilterChange('sortOrder', sortOrder);
                            }}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at-desc">Mais Recente</SelectItem>
                                <SelectItem value="created_at-asc">Mais Antigo</SelectItem>
                                <SelectItem value="filename-asc">Nome A-Z</SelectItem>
                                <SelectItem value="filename-desc">Nome Z-A</SelectItem>
                                <SelectItem value="file_size-desc">Maior Tamanho</SelectItem>
                                <SelectItem value="file_size-asc">Menor Tamanho</SelectItem>
                            </SelectContent>
                        </Select>
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
                                                <Database className="h-8 w-8 text-gray-400" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        Nenhum backup encontrado
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Não há backups que correspondam aos filtros aplicados
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {pagination && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-muted-foreground flex-1 text-sm">
                                        {table.getFilteredSelectedRowModel().rows.length} de{" "}
                                        {pagination.total} linha(s) selecionada(s).
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={!pagination.hasPrev}
                                        >
                                            Anterior
                                        </Button>

                                        <div className="flex items-center gap-1">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Página {pagination.page} de {pagination.totalPages}
                                            </span>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={!pagination.hasNext}
                                        >
                                            Próxima
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}