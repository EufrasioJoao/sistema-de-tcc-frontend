"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CourseCards } from "./_components/CourseCards";
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
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  _count: {
    students: number;
    tccs: number;
  };
}

interface CourseStats {
  totalCourses: number;
  totalStudents: number;
  totalTccs: number;
  coursesWithCoordinator: number;
  coursesWithoutCoordinator: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/courses");
      if (response.data.success) {
        setCourses(response.data.courses);
      } else {
        toast.error("Erro ao carregar cursos");
      }
    } catch (error) {
      toast.error("Erro ao carregar cursos");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const calculateStats = (): CourseStats => {
    const totalCourses = courses.length;
    const totalStudents = courses.reduce(
      (sum, course) => sum + course._count.students,
      0
    );
    const totalTccs = courses.reduce(
      (sum, course) => sum + course._count.tccs,
      0
    );
    const coursesWithCoordinator = courses.filter(
      (course) => course.coordinator
    ).length;
    const coursesWithoutCoordinator = totalCourses - coursesWithCoordinator;

    return {
      totalCourses,
      totalStudents,
      totalTccs,
      coursesWithCoordinator,
      coursesWithoutCoordinator,
    };
  };

  const stats = calculateStats();

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
      className="mx-auto p-6 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Gerenciamento de Cursos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visualize e gerencie todos os cursos da instituição
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Curso
        </Button>
      </motion.div>

      {/* Cards Section */}
      <CourseCards stats={stats} loading={loading} />

      {/* Charts Section */}
      <CourseCharts />

      {/* Table Section */}
      <CourseTable
        courses={courses}
        loading={loading}
        onRefresh={fetchCourses}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
      />

      {/* Add Course Dialog */}
      <AddCourseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchCourses}
      />

      {/* Edit Course Dialog */}
      <EditCourseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={fetchCourses}
        course={selectedCourse}
      />

      {/* Delete Course Dialog */}
      <DeleteCourseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={fetchCourses}
        course={selectedCourse}
      />
    </motion.div>
  );
}
