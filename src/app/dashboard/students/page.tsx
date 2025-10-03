"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { StudentTable } from "./_components/StudentTable";
import { StudentCards } from "./_components/StudentCards";
import { AddStudentDialog } from "./_components/AddStudentDialog";
import { EditStudentDialog } from "./_components/EditStudentDialog";
import { DeleteStudentDialog } from "./_components/DeleteStudentDialog";
import { StudentsChart } from "./_components/StudentsChart";

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

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [areaChartData, setAreaChartData] = useState<Array<{ date: string; students: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/students");
      if (response.data.success) {
        setStudents(response.data.students);
        setAreaChartData(response.data.areaChartData || []);
      } else {
        toast.error("Erro ao carregar estudantes");
      }
    } catch (error) {
      toast.error("Erro ao carregar estudantes");
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setShowAddDialog(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowEditDialog(true);
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowDeleteDialog(true);
  };

  const handleStudentAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowAddDialog(false);
    toast.success("Estudante adicionado com sucesso!");
  };

  const handleStudentUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowEditDialog(false);
    setSelectedStudent(null);
    toast.success("Estudante atualizado com sucesso!");
  };

  const handleStudentDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowDeleteDialog(false);
    setSelectedStudent(null);
    toast.success("Estudante removido com sucesso!");
  };

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const studentsWithTCCs = students.filter(
    (student) => student._count.tccs > 0
  ).length;
  const uniqueCourses = new Set(students.map((student) => student.courseId))
    .size;

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
              Gerenciamento de Estudantes
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Gerencie os estudantes da sua organização
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleAddStudent}
              size="sm"
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Estudante
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StudentCards
          totalStudents={totalStudents}
          studentsWithTCCs={studentsWithTCCs}
          uniqueCourses={uniqueCourses}
        />
      </motion.div>

      {/* Students Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <StudentsChart areaChartData={areaChartData} />
      </motion.div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <StudentTable
          refreshTrigger={refreshTrigger}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />
      </motion.div>

      {/* Dialogs */}
      <AddStudentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onStudentAdded={handleStudentAdded}
      />

      {selectedStudent && (
        <>
          <EditStudentDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            student={selectedStudent}
            onStudentUpdated={handleStudentUpdated}
          />

          <DeleteStudentDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            student={selectedStudent}
            onStudentDeleted={handleStudentDeleted}
          />
        </>
      )}
    </motion.div>
  );
}
