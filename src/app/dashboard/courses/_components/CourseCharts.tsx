"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { api } from "@/lib/api";
import { Bar, BarChart, XAxis, CartesianGrid } from "recharts";

import { LabelList } from "recharts";

const chartConfig = {
  students: {
    label: "Estudantes",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;
interface Course {
  id: string;
  name: string;
  _count: {
    students: number;
    tccs: number;
  };
}

export function CourseCharts() {
  const [studentsPerCourse, setStudentsPerCourse] = useState<Course[]>([]);
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

  // Transform data for chart
  const chartData = studentsPerCourse.map((course) => ({
    name:
      course.name.length > 20
        ? course.name.substring(0, 20) + "..."
        : course.name,
    students: course._count.students,
  }));

  const totalStudents = chartData.reduce(
    (sum, course) => sum + course.students,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estudantes por Curso</CardTitle>
        <CardDescription>Top 5 cursos com mais estudantes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px]  w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 15)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="students" fill="var(--color-students)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total de {totalStudents} estudantes
        </div>
        <div className="text-muted-foreground leading-none">
          Distribuídos nos {chartData.length} principais cursos
        </div>
      </CardFooter>
    </Card>
  );
}
