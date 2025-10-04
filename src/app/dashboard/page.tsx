"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  GraduationCap,
  FileText,
  Award,
  RefreshCw,
  PieChart,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { CoursesTable } from "./_components/CoursesTable";
import { TccChart } from "./_components/TccChart";

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

interface DashboardData {
  organization: {
    id: string;
    name: string;
  };
  overview: {
    total_users: number;
    total_tccs: number;
    total_files: number;
    total_courses: number;
  };
  distributions: {
    users_by_role: Array<{
      role: string;
      count: number;
      label: string;
    }>;
    tccs_by_type: Array<{
      type: string;
      count: number;
      label: string;
    }>;
  };
  trends: {
    monthly_tccs: Array<{
      date: string;
      bachelor: number;
      master: number;
      doctorate: number;
    }>;
    tcc_area_chart: Array<{
      date: string;
      tccs: number;
    }>;
  };
  top_courses: Array<{
    id: string;
    name: string;
    tcc_count: number;
  }>;
  courses: Course[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  async function getDashboardData() {
    setLoading(true);

    try {
      const response = await api.get("/api/users/get-dashboard-data");

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error("Error getting dashboard data:", error);
      toast.error("Erro ao carregar dados do dashboard");
    }

    setLoading(false);
  }

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Dados não encontrados</h3>
          <p className="text-muted-foreground mb-4">
            Não foi possível carregar os dados do dashboard.
          </p>
          <Button onClick={getDashboardData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  dark:bg-slate-900">
      <div className="py-8 space-y-8">
        {/* Greeting Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full pb-6 border-b border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Bem-vindo ao Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {dashboardData.organization.name} • Gerencie seus dados
                acadêmicos
              </p>
            </div>

            <Button
              onClick={getDashboardData}
              variant="outline"
              size="sm"
              className="border-slate-200 dark:border-slate-700   dark:hover:bg-slate-800"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Usuários
                </CardTitle>
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {dashboardData.overview.total_users}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total de usuários cadastrados
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  TCCs
                </CardTitle>
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <GraduationCap className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {dashboardData.overview.total_tccs}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total de TCCs
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Arquivos
                </CardTitle>
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {dashboardData.overview.total_files}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total de arquivos no sistema
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Cursos
                </CardTitle>
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <Award className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardData.overview.total_courses}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total de cursos
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="distributions" className="space-y-6">
          <div className="flex justify-start">
            <TabsList className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm rounded-lg">
              <TabsTrigger
                value="distributions"
                className="data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200"
              >
                <PieChart className="mr-2 h-4 w-4" />
                Distribuições
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200"
              >
                <Trophy className="mr-2 h-4 w-4" />
                Cursos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="distributions" className="space-y-6">
            {/* TCC Area Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TccChart areaChartData={dashboardData.trends.tcc_area_chart} />
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Users by Role */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      Usuários por Função
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dashboardData.distributions.users_by_role.map(
                      (role, index) => (
                        <motion.div
                          key={role.role}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-200"
                        >
                          <span className="text-sm font-medium">
                            {role.label}
                          </span>
                          <Badge variant="secondary" className="px-3 py-1">
                            {role.count}
                          </Badge>
                        </motion.div>
                      )
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* TCCs by Type */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      TCCs por Tipo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    {dashboardData.distributions.tccs_by_type.map(
                      (type, index) => (
                        <motion.div
                          key={type.type}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-emerald-50 dark:from-slate-800/50 dark:to-emerald-900/20 rounded-2xl hover:shadow-lg transition-all duration-300"
                        >
                          <span className="font-medium text-lg">
                            {type.label}
                          </span>
                          <Badge
                            className={`shadow-lg px-4 py-2 text-lg text-white ${
                              type.type === "BACHELOR"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                : type.type === "MASTER"
                                ? "bg-gradient-to-r from-purple-500 to-purple-600"
                                : "bg-gradient-to-r from-orange-500 to-orange-600"
                            }`}
                          >
                            {type.count}
                          </Badge>
                        </motion.div>
                      )
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <CoursesTable courses={dashboardData.courses} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
