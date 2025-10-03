"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCharts } from "./_components/CourseCharts";
import { CourseTable } from "./_components/CourseTable";
import { AddCourseDialog } from "./_components/AddCourseDialog";
import { EditCourseDialog } from "./_components/EditCourseDialog";
import { DeleteCourseDialog } from "./_components/DeleteCourseDialog";

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

export default function CoursesPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setEditDialogOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  return (
    <motion.div
      className="mx-auto py-6 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full pb-6 border-b border-gray-200 dark:border-slate-700"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Gerenciamento de Cursos
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Visualize e gerencie todos os cursos da instituição
            </p>
          </div>

          <Button
            onClick={() => setDialogOpen(true)}
            size="sm"
            className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Curso
          </Button>
        </div>
      </motion.div>

      {/* Charts Section */}
      <CourseCharts />

      {/* Table Section */}
      <CourseTable
        refreshTrigger={refreshTrigger}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
      />

      {/* Add Course Dialog */}
      <AddCourseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={triggerRefresh}
      />

      {/* Edit Course Dialog */}
      <EditCourseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={triggerRefresh}
        course={selectedCourse}
      />

      {/* Delete Course Dialog */}
      <DeleteCourseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={triggerRefresh}
        course={selectedCourse}
      />
    </motion.div>
  );
}
