import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const studentsWithoutTCCs = totalStudents - studentsWithTCCs;
  const tccCompletionRate = totalStudents > 0 ? Math.round((studentsWithTCCs / totalStudents) * 100) : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-blue-800 dark:text-blue-200">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Total de Estudantes
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {totalStudents}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {totalStudents}
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              estudantes cadastrados
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-green-800 dark:text-green-200">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Com TCCs
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                {studentsWithTCCs}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {tccCompletionRate}%
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              taxa de conclusão
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-purple-800 dark:text-purple-200">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Cursos Ativos
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                {uniqueCourses}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {uniqueCourses}
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
              cursos diferentes
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
