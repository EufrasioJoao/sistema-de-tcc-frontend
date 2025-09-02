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
  GraduationCap,
  BookOpen,
  UserCheck,
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/students");
      if (response.data.success) {
        setStudents(response.data.students);
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
    fetchStudents();
    setShowAddDialog(false);
    toast.success("Estudante adicionado com sucesso!");
  };

  const handleStudentUpdated = () => {
    fetchStudents();
    setShowEditDialog(false);
    setSelectedStudent(null);
    toast.success("Estudante atualizado com sucesso!");
  };

  const handleStudentDeleted = () => {
    fetchStudents();
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
      className="container mx-auto p-6 space-y-8"
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
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Estudantes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie os estudantes da sua organização
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={handleAddStudent} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Estudante
          </Button>
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

      {/* Search and Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome, email, matrícula ou curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </motion.div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Estudantes ({filteredStudents.length})
              </div>
              <div className="text-sm text-gray-500">
                {filteredStudents.length !== totalStudents &&
                  `${filteredStudents.length} de ${totalStudents} estudantes`}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StudentTable
              students={filteredStudents}
              loading={loading}
              onRefresh={fetchStudents}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          </CardContent>
        </Card>
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
