"use client";

import React from "react";
import { GraduationCap, Users, FileText, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseStats {
  totalCourses: number;
  totalStudents: number;
  totalTccs: number;
  coursesWithCoordinator: number;
  coursesWithoutCoordinator: number;
}

interface Props {
  stats: CourseStats;
  loading: boolean;
}


const CardSkeleton = () => (
  <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-700" />
      <Skeleton className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-16 bg-slate-200 dark:bg-slate-700 mb-2" />
      <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-slate-700" />
    </CardContent>
  </Card>
);

export const CourseCards = ({ stats, loading }: Props) => {
  const coordinatorPercentage = stats.totalCourses > 0 
    ? Math.round((stats.coursesWithCoordinator / stats.totalCourses) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Courses Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 * 0.1 }}
      >
        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total de Cursos
            </CardTitle>
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <GraduationCap className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {stats.totalCourses}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cursos ativos
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total Students Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 * 0.1 }}
      >
        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total de Estudantes
            </CardTitle>
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {stats.totalStudents}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Matriculados
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total TCCs Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 * 0.1 }}
      >
        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total de TCCs
            </CardTitle>
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {stats.totalTccs}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Trabalhos cadastrados
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Coordination Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 * 0.1 }}
      >
        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Com Coordenador
            </CardTitle>
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <UserCheck className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {stats.coursesWithCoordinator}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {coordinatorPercentage}% dos cursos
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
