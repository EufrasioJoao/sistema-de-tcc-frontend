"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GraduationCap,
  Users,
  FileText,
  Calendar,
  Mail,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  students: Student[];
  tccs: TCC[];
  _count: {
    students: number;
    tccs: number;
  };
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  createdAt: string;
}

interface TCC {
  id: string;
  title: string;
  type: string;
  year: number;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/courses/${courseId}`);
      if (response.data.success) {
        setCourse(response.data.course);
      } else {
        toast.error("Erro ao carregar detalhes do curso");
      }
    } catch (error) {
      toast.error("Erro ao carregar detalhes do curso");
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto py-6 space-y-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto p-6">
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Curso não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            O curso solicitado não existe ou foi removido.
          </p>
          <Button onClick={() => router.push("/dashboard/courses")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Cursos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="mx-auto py-6 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between flex-wrap gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/courses")}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {course.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {course.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Detalhes e estatísticas do curso
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Course Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <GraduationCap className="h-5 w-5" />
              Informações do Curso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Coordenador
                </label>
                <div className="mt-1">
                  {course.coordinator ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {course.coordinator.first_name.charAt(0)}
                        {course.coordinator.last_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {course.coordinator.first_name}{" "}
                          {course.coordinator.last_name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {course.coordinator.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <UserX className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        Sem coordenador atribuído
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Data de Criação
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {new Date(course.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-green-800 dark:text-green-200">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Estudantes
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              >
                {course._count.students}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-purple-800 dark:text-purple-200">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                TCCs
              </div>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
              >
                {course._count.tccs}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-amber-800 dark:text-amber-200">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Ativo há
              </div>
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              >
                {Math.floor(
                  (new Date().getTime() -
                    new Date(course.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                dias
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Students and TCCs Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Estudantes ({course.students.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {course.students.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="truncate">
                        Codigo de Estudante
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.students.slice(0, 5).map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                              {student.firstName.charAt(0)}
                              {student.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {student.studentNumber}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Nenhum estudante cadastrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* TCCs Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  TCCs ({course.tccs.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {course.tccs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.tccs.slice(0, 5).map((tcc) => (
                      <TableRow key={tcc.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium line-clamp-1">
                              {tcc.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {tcc.author.firstName} {tcc.author.lastName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {tcc.type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Nenhum TCC cadastrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
