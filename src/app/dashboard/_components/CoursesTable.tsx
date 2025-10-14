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
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, User, GraduationCap, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Course {
  id: string;
  name: string;
  description?: string;
  coordinator: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  _count: {
    students: number;
    tccs: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface CoursesTableProps {
  courses?: Course[];
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onView?: (course: Course) => void;
  onAdd?: () => void;
}

// Courses columns definition for TanStack React Table
const createCoursesColumns = (
  onView?: (course: Course) => void,
  onEdit?: (course: Course) => void,
  onDelete?: (course: Course) => void
): ColumnDef<Course>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Nome do Curso
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px]">
        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
          {row.getValue("name")}
        </p>
        {row.original.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {row.original.description}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "coordinator",
    header: "Coordenador",
    cell: ({ row }) => {
      const course = row.original;
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-500" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {course?.coordinator?.first_name} {course?.coordinator?.last_name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {course?.coordinator?.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "_count.students",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Estudantes
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-purple-500" />
        <Badge variant="secondary" className="px-3 py-1">
          {row.original._count.students}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "_count.tCCs",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        TCCs
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-green-500" />
        <Badge variant="secondary" className="px-3 py-1 font-semibold">
          {row.original._count.tccs}
        </Badge>
      </div>
    ),
  },
];

export function CoursesTable({
  courses: propCourses = [],
  onEdit,
  onDelete,
  onView,
  onAdd,
}: CoursesTableProps) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Use courses from props instead of fetching
  const courses = propCourses;
  const loading = false;

  const columns = createCoursesColumns(onView, onEdit, onDelete);

  const table = useReactTable({
    data: courses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Cursos
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

  if (!loading && courses && courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Cursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Nenhum curso encontrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Comece adicionando o primeiro curso ao sistema.
            </p>
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
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <BookOpen className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Cursos
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {courses.length} cursos cadastrados
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {onAdd && (
                <Button
                  onClick={onAdd}
                  className="gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white"
                >
                  <Plus className="h-4 w-4" />
                  Novo Curso
                </Button>
              )}
            </div>
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
                        <BookOpen className="h-8 w-8 text-gray-400" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Nenhum curso encontrado
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Não há cursos cadastrados no sistema
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
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex-1 text-sm">
                  {table.getFilteredSelectedRowModel().rows.length} de{" "}
                  {table.getFilteredRowModel().rows.length} linha(s)
                  selecionada(s).
                </div>
                <div className="flex items-center space-x-2">
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
