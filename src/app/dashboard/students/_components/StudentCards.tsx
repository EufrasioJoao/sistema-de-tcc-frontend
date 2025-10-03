import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentCardsProps {
  totalStudents: number;
  studentsWithTCCs: number;
  uniqueCourses: number;
}

export function StudentCards({ 
  totalStudents, 
  studentsWithTCCs, 
  uniqueCourses 
}: StudentCardsProps) {
  const tccCompletionRate = totalStudents > 0 ? Math.round((studentsWithTCCs / totalStudents) * 100) : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 * 0.1 }}
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
              {totalStudents}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Estudantes cadastrados
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 * 0.1 }}
      >
        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Com TCCs
            </CardTitle>
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <BookOpen className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {studentsWithTCCs}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tccCompletionRate}% taxa de conclusão
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 * 0.1 }}
      >
        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Cursos Ativos
            </CardTitle>
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <GraduationCap className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {uniqueCourses}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cursos diferentes
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
