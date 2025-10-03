"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { User, Award, Users, Calendar } from "lucide-react";

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

interface AuthorReportsProps {
    data: AuthorReportsData;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

export function AuthorReports({ data }: AuthorReportsProps) {
    // Verificação de segurança - se não há dados, mostrar estado de carregamento
    if (!data) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Carregando dados dos autores...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Autores</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data?.mostProductive?.length || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mais Produtivo</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {data?.mostProductive?.[0]?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {data?.mostProductive?.[0]?.tccCount || 0} TCCs
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mais Orientadores</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {data?.withMostSupervisors?.[0] ?
                                `${data?.withMostSupervisors[0].firstName} ${data?.withMostSupervisors[0].lastName}` : 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {data?.withMostSupervisors?.[0]?.supervisor_count || 0} orientadores
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Autores Recentes</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.recent?.length || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Autores Mais Produtivos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Autores Mais Produtivos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={(data?.mostProductive || []).slice(0, 8)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="tccCount" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Autores por Curso */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Autores por Curso</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={(data?.byCourse || []).slice(0, 8)}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ courseName, count }) => `${courseName}: ${count}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {(data?.byCourse || []).slice(0, 8).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Autores com Mais Orientadores */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Autores com Mais Orientadores</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">Nome</th>
                                            <th className="text-left p-2">Orientadores</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data?.withMostSupervisors || []).slice(0, 5).map((author) => (
                                            <tr key={author.id} className="border-b">
                                                <td className="p-2 font-medium">
                                                    {author.firstName} {author.lastName}
                                                </td>
                                                <td className="p-2 text-muted-foreground">
                                                    {author.supervisor_count}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Autores Recentes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Autores Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">Nome</th>
                                            <th className="text-left p-2">Curso</th>
                                            <th className="text-left p-2">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.recent?.slice(0, 5).map((author) => (
                                            <tr key={author.id} className="border-b">
                                                <td className="p-2 font-medium">{author.name}</td>
                                                <td className="p-2 text-muted-foreground">{author.courseName}</td>
                                                <td className="p-2 text-muted-foreground">
                                                    {new Date(author.createdAt).toLocaleDateString('pt-BR')}
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
        </div>
    );
}