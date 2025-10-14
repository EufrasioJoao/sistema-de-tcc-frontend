"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { GraduationCap, Users, UserCheck, Calendar } from "lucide-react";

interface CourseReportsData {
    totalCourses: number;
    byTccCount: Array<{ id: string; name: string; tccCount: number }>;
    byStudentCount: Array<{ id: string; name: string; studentCount: number }>;
    bySupervisorCount: Array<{ id: string; name: string; supervisor_count: number }>;
    byYear: Array<{ year: number; count: number }>;
    recent: Array<{ id: string; name: string; createdAt: string }>;
}

interface CourseReportsProps {
    data: CourseReportsData;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

export function CourseReports({ data }: CourseReportsProps) {
    // Verificação de segurança - se não há dados, mostrar estado de carregamento
    if (!data) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Carregando dados dos cursos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data?.totalCourses || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Curso Mais Ativo</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {data?.byTccCount?.[0]?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {data?.byTccCount?.[0]?.tccCount || 0} TCCs
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mais Estudantes</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {data?.byStudentCount?.[0]?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {data?.byStudentCount?.[0]?.studentCount || 0} estudantes
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cursos Recentes</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.recent?.length || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* TCCs por Curso */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>TCCs por Curso</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data?.byTccCount?.slice(0, 8)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                    />
                                    <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip formatter={(value) => [`${value} TCCs`, 'Quantidade']} />
                                    <Bar dataKey="tccCount" fill="#3b82f6" name="Quantidade" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Estudantes por Curso */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Estudantes por Curso</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={data?.byStudentCount?.slice(0, 8)}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="studentCount"
                                    >
                                        {data?.byStudentCount?.slice(0, 8).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value} estudantes`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Orientadores por Curso */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Orientadores por Curso</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data?.bySupervisorCount?.slice(0, 8)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                    />
                                    <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip formatter={(value) => [`${value} orientadores`, 'Quantidade']} />
                                    <Bar dataKey="supervisor_count" fill="#10b981" name="Quantidade" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Cursos por Ano */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Criação de Cursos por Ano</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data?.byYear}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip formatter={(value) => [`${value} cursos`, 'Quantidade']} />
                                    <Bar dataKey="count" fill="#f59e0b" name="Quantidade" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Courses Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Cursos Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">Nome do Curso</th>
                                        <th className="text-left p-2">Data de Criação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.recent?.map((course) => (
                                        <tr key={course.id} className="border-b">
                                            <td className="p-2 font-medium">{course.name}</td>
                                            <td className="p-2 text-muted-foreground">
                                                {new Date(course.createdAt).toLocaleDateString('pt-BR')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}