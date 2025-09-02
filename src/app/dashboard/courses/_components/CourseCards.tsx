"use client";

import React from "react";
import { GraduationCap, Users, FileText, UserCheck, UserX, TrendingUp } from "lucide-react";
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

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
};

const numberVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      delay: 0.2
    }
  },
};

const CardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-10 w-16 mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-12" />
      </div>
    </CardContent>
  </Card>
);

export const CourseCards = ({ stats, loading }: Props) => {
  const coordinatorPercentage = stats.totalCourses > 0 
    ? Math.round((stats.coursesWithCoordinator / stats.totalCourses) * 100) 
    : 0;

  if (loading) {
    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.15 }}
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.div key={i} variants={cardVariants}>
            <CardSkeleton />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.15 }}
    >
      {/* Total Courses Card */}
      <motion.div variants={cardVariants}>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-900/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <div>
              <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                Total de Cursos
              </CardTitle>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                Cursos ativos
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <motion.div 
              variants={numberVariants}
              className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4"
            >
              {stats.totalCourses}
            </motion.div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  {stats.coursesWithCoordinator} Com coordenador
                </span>
              </div>
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-semibold">{coordinatorPercentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total Students Card */}
      <motion.div variants={cardVariants}>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/20 to-emerald-300/20 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <div>
              <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
                Total de Estudantes
              </CardTitle>
              <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                Matriculados
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <motion.div 
              variants={numberVariants}
              className="text-4xl font-bold text-green-900 dark:text-green-100 mb-4"
            >
              {stats.totalStudents}
            </motion.div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Distribuídos em {stats.totalCourses} cursos
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total TCCs Card */}
      <motion.div variants={cardVariants}>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/50 dark:to-violet-900/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-violet-300/20 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <div>
              <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                Total de TCCs
              </CardTitle>
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                Trabalhos cadastrados
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <motion.div 
              variants={numberVariants}
              className="text-4xl font-bold text-purple-900 dark:text-purple-100 mb-4"
            >
              {stats.totalTccs}
            </motion.div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                Média: {stats.totalCourses > 0 ? Math.round(stats.totalTccs / stats.totalCourses) : 0} por curso
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Coordination Status Card */}
      <motion.div variants={cardVariants}>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950/50 dark:to-red-900/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-red-300/20 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <div>
              <CardTitle className="text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                Status de Coordenação
              </CardTitle>
              <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">
                Distribuição
              </p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <UserCheck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <motion.div 
                  variants={numberVariants}
                  className="text-2xl font-bold text-green-700 dark:text-green-300"
                >
                  {stats.coursesWithCoordinator}
                </motion.div>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Com coordenador
                </p>
              </div>
              <div className="text-center">
                <motion.div 
                  variants={numberVariants}
                  className="text-2xl font-bold text-red-700 dark:text-red-300"
                >
                  {stats.coursesWithoutCoordinator}
                </motion.div>
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  Sem coordenador
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
