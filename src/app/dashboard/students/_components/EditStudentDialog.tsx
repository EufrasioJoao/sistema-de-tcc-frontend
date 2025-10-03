"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Edit, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Course {
  id: string;
  name: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  courseId: string;
  course: {
    id: string;
    name: string;
  };
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  onStudentUpdated: () => void;
}

export function EditStudentDialog({
  open,
  onOpenChange,
  student,
  onStudentUpdated,
}: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    if (open && student) {
      setFirstName(student.firstName);
      setLastName(student.lastName);
      setEmail(student.email);
      setStudentNumber(student.studentNumber);
      setCourseId(student.courseId);
      fetchCourses();
    }
  }, [open, student]);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await api.get("/api/courses");
      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      toast.error("Erro ao carregar cursos");
      console.error("Error fetching courses:", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !studentNumber.trim() ||
      !courseId
    ) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(`/api/students/${student.id}`, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        studentNumber: studentNumber.trim(),
        courseId,
      });

      if (response.data.success) {
        onStudentUpdated();
        handleClose();
      } else {
        toast.error(response.data.message || "Erro ao atualizar estudante");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao atualizar estudante";
      toast.error(errorMessage);
      console.error("Error updating student:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>

      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto  sm:mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
                <Edit className="h-4 w-4" />
              </div>
              Editar Estudante
            </DialogTitle>
            <DialogDescription>
              Atualize as informações do estudante {student?.firstName}{" "}
              {student?.lastName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome *</Label>
                <Input
                  id="firstName"
                  placeholder="Digite o nome"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome *</Label>
                <Input
                  id="lastName"
                  placeholder="Digite o sobrenome"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="estudante@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentNumber">Codigo de Estudante *</Label>
              <Input
                id="studentNumber"
                placeholder="Ex: 2024001234"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Curso *</Label>
              <Select
                value={courseId}
                onValueChange={setCourseId}
                disabled={loading || loadingCourses}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingCourses
                        ? "Carregando cursos..."
                        : "Selecione um curso"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Atualizando..." : "Atualizar Estudante"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
