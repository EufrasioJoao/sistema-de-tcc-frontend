"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loading } from "@/components/Loading";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useUserData } from "@/contexts/app-context";
import { UserRoles } from "@/types/index";
import { SystemStatistics } from "./_components/SystemStatistics";
import { TccReports } from "./_components/TccReports";
import { ActivityReports } from "./_components/ActivityReports";
import { StorageReports } from "./_components/StorageReports";
import { CourseReports } from "./_components/CourseReports";
import { AuthorReports } from "./_components/AuthorReports";
import { KeywordReports } from "./_components/KeywordReports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Activity,
  HardDrive,
  GraduationCap,
  User,
  Tag,
  Repeat,
} from "lucide-react";

interface SystemStats {
  users: {
    total: number;
    active: number;
  };
  courses: number;
  students: number;
  tccs: number;
  files: number;
  storage: {
    used: number;
  };
  activity: {
    recent: number;
  };
}

interface TccReportsData {
  byType: Array<{ type: string; count: number }>;
  byYear: Array<{ year: number; count: number }>;
  byCourse: Array<{ courseId: string; courseName: string; count: number }>;
  recent: Array<any>;
}

interface ActivityReportsData {
  byAction: Array<{ action: string; count: number }>;
  byDay: Array<{ date: string; count: number }>;
  mostActiveUsers: Array<{
    userId: string;
    userName: string;
    email: string;
    activityCount: number;
  }>;
  mostAccessedFiles: Array<{
    fileId: string;
    fileName: string;
    accessCount: number;
  }>;
}

interface StorageReportsData {
  largestFiles: Array<any>;
  byUploader: Array<{
    uploaderId: string;
    uploaderName: string;
    fileCount: number;
  }>;
  organization: {
    name: string;
    usedStorage: number;
  };
}

interface CourseReportsData {
  totalCourses: number;
  byTccCount: Array<{ id: string; name: string; tccCount: number }>;
  byStudentCount: Array<{ id: string; name: string; studentCount: number }>;
  bySupervisorCount: Array<{
    id: string;
    name: string;
    supervisor_count: number;
  }>;
  byYear: Array<{ year: number; count: number }>;
  recent: Array<{ id: string; name: string; createdAt: string }>;
}

interface AuthorReportsData {
  mostProductive: Array<{
    id: string;
    name: string;
    email: string;
    courseName: string;
    tccCount: number;
  }>;
  byCourse: Array<{ courseId: string; courseName: string; count: number }>;
  withMostSupervisors: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    supervisor_count: number;
  }>;
  recent: Array<{
    id: string;
    name: string;
    email: string;
    courseName: string;
    createdAt: string;
  }>;
}

interface KeywordReportsData {
  mostUsed: Array<{
    keyword: string;
    count: number;
    courseCount: number;
    yearSpread: number;
    tccs: Array<any>;
  }>;
  byCourse: Array<{
    courseName: string;
    topKeywords: Array<{ keyword: string; count: number }>;
  }>;
  byYear: Array<{
    year: number;
    topKeywords: Array<{ keyword: string; count: number }>;
  }>;
  totalKeywords: number;
  totalTccsWithKeywords: number;
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [tccReports, setTccReports] = useState<TccReportsData | null>(null);
  const [activityReports, setActivityReports] =
    useState<ActivityReportsData | null>(null);
  const [storageReports, setStorageReports] =
    useState<StorageReportsData | null>(null);
  const [courseReports, setCourseReports] = useState<CourseReportsData | null>(
    null
  );
  const [authorReports, setAuthorReports] = useState<AuthorReportsData | null>(
    null
  );
  const [keywordReports, setKeywordReports] =
    useState<KeywordReportsData | null>(null);
  const { user } = useUserData();

  const fetchSystemStatistics = async () => {
    try {
      const response = await api("/api/reports/statistics");
      if (response.status === 200) {
        setSystemStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching system statistics:", error);
      toast.error("Erro ao carregar estatísticas do sistema");
    }
  };

  const fetchTccReports = async () => {
    try {
      const response = await api("/api/reports/tccs");
      if (response.status === 200) {
        setTccReports(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching TCC reports:", error);
      toast.error("Erro ao carregar relatórios de TCC");
    }
  };

  const fetchActivityReports = async () => {
    try {
      const response = await api("/api/reports/activity");
      if (response.status === 200) {
        setActivityReports(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching activity reports:", error);
      toast.error("Erro ao carregar relatórios de atividade");
    }
  };

  const fetchStorageReports = async () => {
    try {
      const response = await api("/api/reports/storage");
      if (response.status === 200) {
        setStorageReports(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching storage reports:", error);
      toast.error("Erro ao carregar relatórios de armazenamento");
    }
  };

  const fetchCourseReports = async () => {
    try {
      const response = await api("/api/reports/courses");
      if (response.status === 200) {
        setCourseReports(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching course reports:", error);
      toast.error("Erro ao carregar relatórios de cursos");
    }
  };

  const fetchAuthorReports = async () => {
    try {
      const response = await api("/api/reports/authors");
      if (response.status === 200) {
        setAuthorReports(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching author reports:", error);
      toast.error("Erro ao carregar relatórios de autores");
    }
  };

  const fetchKeywordReports = async () => {
    try {
      const response = await api("/api/reports/keywords");
      if (response.status === 200) {
        setKeywordReports(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching keyword reports:", error);
      toast.error("Erro ao carregar relatórios de palavras-chave");
    }
  };

  useEffect(() => {
    const fetchAllReports = async () => {
      setLoading(true);
      await Promise.all([
        fetchSystemStatistics(),
        fetchTccReports(),
        fetchActivityReports(),
        fetchStorageReports(),
        fetchCourseReports(),
        fetchAuthorReports(),
        fetchKeywordReports(),
      ]);
      setLoading(false);
    };

    fetchAllReports();
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Check permissions
  if (
    !user ||
    (user.role !== UserRoles.ADMIN && user.role !== UserRoles.SISTEM_MANAGER)
  ) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          Acesso negado. Apenas administradores e gerentes de sistema podem
          visualizar relatórios.
        </p>
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full pb-6 border-b border-gray-200 dark:border-slate-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Relatórios e Estatísticas
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Visualize dados e métricas do sistema
            </p>
          </div>
        </div>
      </motion.div>

      {/* System Statistics Overview */}
      {systemStats && <SystemStatistics data={systemStats} />}

      {/* Detailed Reports */}
      <Tabs defaultValue="tccs" className="w-full">
        <TabsList className="grid w-full md:grid-cols-6 grid-cols-3 h-auto gap-1">
          <TabsTrigger value="tccs" className="flex items-center gap-2 text-xs md:text-sm">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">TCCs</span>
            <span className="sm:hidden">TCCs</span>
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="flex items-center gap-2 text-xs md:text-sm"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Cursos</span>
            <span className="sm:hidden">Cursos</span>
          </TabsTrigger>
          <TabsTrigger
            value="authors"
            className="flex items-center gap-2 text-xs md:text-sm"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Autores</span>
            <span className="sm:hidden">Autores</span>
          </TabsTrigger>
          <TabsTrigger
            value="keywords"
            className="flex items-center gap-2 text-xs md:text-sm"
          >
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Palavras-chave</span>
            <span className="sm:hidden">Chaves</span>
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="flex items-center gap-2 text-xs md:text-sm"
          >
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Atividade</span>
            <span className="sm:hidden">Ativ.</span>
          </TabsTrigger>
          <TabsTrigger
            value="storage"
            className="flex items-center gap-2 text-xs md:text-sm"
          >
            <HardDrive className="h-4 w-4" />
            <span className="hidden sm:inline">Armazenamento</span>
            <span className="sm:hidden">Armaz.</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tccs" className="mt-6">
          <TccReports data={tccReports as TccReportsData} />
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <CourseReports data={courseReports as CourseReportsData} />
        </TabsContent>

        <TabsContent value="authors" className="mt-6">
          <AuthorReports data={authorReports as AuthorReportsData} />
        </TabsContent>

        <TabsContent value="keywords" className="mt-6">
          <KeywordReports data={keywordReports as KeywordReportsData} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityReports data={activityReports as ActivityReportsData} />
        </TabsContent>

        <TabsContent value="storage" className="mt-6">
          <StorageReports data={storageReports as StorageReportsData} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
