"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { api } from "@/lib/api";
import { BarChart3, PieChart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, PieChart as RechartsPieChart, Cell, Pie } from "recharts";

interface Course {
  id: string;
  name: string;
  _count: {
    students: number;
    tccs: number;
  };
}

const studentsChartConfig = {
  students: {
    label: "Estudantes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const tccsChartConfig = {
  tccs: {
    label: "TCCs",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function CourseCharts() {
  const [studentsPerCourse, setStudentsPerCourse] = useState<Course[]>([]);
  const [tccsPerCourse, setTccsPerCourse] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoursesData();
  }, []);

  const fetchCoursesData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/courses");
      if (response.data.success) {
        const courses = response.data.courses;
        
        // Get top 5 courses by students
        const topByStudents = courses
          .sort((a: Course, b: Course) => b._count.students - a._count.students)
          .slice(0, 5);
        
        // Get top 5 courses by TCCs
        const topByTccs = courses
          .sort((a: Course, b: Course) => b._count.tccs - a._count.tccs)
          .slice(0, 5);
        
        setStudentsPerCourse(topByStudents);
        setTccsPerCourse(topByTccs);
      }
    } catch (error) {
      console.error("Error fetching courses data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                </div>
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Transform data for charts
  const studentsChartData = studentsPerCourse.map((course) => ({
    name: course.name.length > 15 ? course.name.substring(0, 15) + "..." : course.name,
    students: course._count.students,
  }));

  const tccsChartData = tccsPerCourse.map((course, index) => ({
    name: course.name.length > 15 ? course.name.substring(0, 15) + "..." : course.name,
    tccs: course._count.tccs,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Students per Course Bar Chart */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                Estudantes por Curso
              </CardTitle>
              <p className="text-sm text-blue-600/70 dark:text-blue-400/70">
                Top 5 cursos com mais estudantes
              </p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ChartContainer config={studentsChartConfig} className="h-[300px]">
              <BarChart data={studentsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                />
                <Bar 
                  dataKey="students" 
                  fill="var(--color-students)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </motion.div>
        </CardContent>
      </Card>

      {/* TCCs per Course Pie Chart */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-rose-200 dark:border-rose-800">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5" />
        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-rose-800 dark:text-rose-200">
                TCCs por Curso
              </CardTitle>
              <p className="text-sm text-rose-600/70 dark:text-rose-400/70">
                Top 5 cursos com mais trabalhos
              </p>
            </div>
            <div className="p-2 bg-rose-500/10 rounded-lg">
              <PieChart className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ChartContainer config={tccsChartConfig} className="h-[300px]">
              <RechartsPieChart>
                <ChartTooltip 
                  content={<ChartTooltipContent nameKey="tccs" />}
                />
                <Pie
                  data={tccsChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="tccs"
                >
                  {tccsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ChartContainer>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
