"use client";

import React from "react";
import { motion } from "framer-motion";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Settings,
  Mail,
  GraduationCap,
  BookOpen,
  User,
} from "lucide-react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  courseId: string;
  createdAt: string;
  course: {
    id: string;
    name: string;
  };
  _count: {
    tccs: number;
  };
}

interface Props {
  students: Student[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-8 w-24" />
    </div>
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-200 dark:border-gray-700">
          {[1, 2, 3, 4, 5].map((i) => (
            <TableHead key={i} className="px-6 py-4">
              <Skeleton className="h-4 w-24" />
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

export function StudentTable({
  students,
  loading,
  onRefresh,
  onEdit,
  onDelete,
}: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span>Nome</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </Button>
      ),
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center space-x-3 py-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {student.firstName} {student.lastName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Mail className="mr-1 h-3 w-3" />
                {student.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "studentNumber",
      header: () => (
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Matrícula
          </span>
        </div>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {row.getValue("studentNumber")}
        </span>
      ),
    },
    {
      accessorKey: "course",
      header: () => (
        <div className="flex items-center">
          <GraduationCap className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Curso
          </span>
        </div>
      ),
      cell: ({ row }) => {
        const course = row.original.course;
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
            {course.name}
          </Badge>
        );
      },
    },
    {
      accessorKey: "_count.tccs",
      header: () => (
        <div className="flex items-center">
          <BookOpen className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            TCCs
          </span>
        </div>
      ),
      cell: ({ row }) => {
        const tccCount = row.original._count.tccs;
        return (
          <Badge 
            variant={tccCount > 0 ? "default" : "secondary"}
            className={
              tccCount > 0 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }
          >
            {tccCount}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <span>Data de Cadastro</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {date.toLocaleDateString("pt-BR")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="flex items-center justify-center">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Ações</span>
        </div>
      ),
      cell: ({ row }) => {
        const student = row.original;

        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <Eye className="mr-2 h-4 w-4 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Ver detalhes
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                  onClick={() => onEdit(student)}
                >
                  <Edit className="mr-2 h-4 w-4 text-yellow-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Editar estudante
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600"
                  onClick={() => onDelete(student)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Remover estudante</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: students,
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
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-6 py-4">
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
              table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4">
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
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Nenhum estudante encontrado
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tente ajustar os filtros de busca ou adicione um novo
                        estudante
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} estudante(s) selecionado(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
