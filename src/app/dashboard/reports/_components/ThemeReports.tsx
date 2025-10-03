"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Repeat, TrendingUp, BookOpen, Calendar } from "lucide-react";

interface ThemeReportsData {
    mostRepeated: Array<{
        theme: string;
        count: number;
        courseCount: number;
        yearSpread: number;
        tccs: Array<{ id: string; title: string; authorName: string; courseName: string; year: number }>;
    }>;
    byCourse: Array<{
        courseName: string;
        topThemes: Array<{ theme: string; count: number }>;
    }>;
    byYear: Array<{
        year: number;
        topThemes: Array<{ theme: string; count: number }>;
    }>;
    totalThemes: number;
    totalTccs: number;
}

interface ThemeReportsProps {
    data: ThemeReportsData;
}

export function ThemeReports({ data }: ThemeReportsProps) {
    // Verificação de segurança - se não há dados, mostrar estado de carregamento
    if (!data) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Carregando dados de temas...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Temas Identificados</CardTitle>
                        <Repeat className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalThemes || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tema Mais Repetido</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {data?.mostRepeated?.[0]?.theme || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {data?.mostRepeated?.[0]?.count || 0} repetições
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">TCCs Analisados</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalTccs || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Anos Analisados</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.byYear?.length || 0}</div>
                    </CardContent>
                </Card>
            </div>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Temas Mais Repetidos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Temas Mais Repetidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={(data?.mostRepeated || []).slice(0, 10)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="theme"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#ef4444" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Temas por Ano */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Tendências Temáticas por Ano</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-80 overflow-y-auto">
                                {(data?.byYear || []).slice(0, 5).map((yearData) => (
                                    <div key={yearData?.year} className="border-b pb-2">
                                        <h4 className="font-semibold mb-2">{yearData?.year}</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {yearData?.topThemes?.slice(0, 4).map((theme) => (
                                                <div key={theme.theme} className="flex justify-between text-sm">
                                                    <span className="truncate">{theme.theme}</span>
                                                    <span className="text-muted-foreground">{theme.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Detailed Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Temas por Curso */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Temas por Curso</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {(data?.byCourse || []).slice(0, 5).map((courseData) => (
                                    <div key={courseData?.courseName} className="border-b pb-3">
                                        <h4 className="font-semibold mb-2 text-sm">{courseData?.courseName}</h4>
                                        <div className="space-y-1">
                                            {courseData?.topThemes?.slice(0, 5).map((theme) => (
                                                <div key={theme.theme} className="flex justify-between text-sm">
                                                    <span className="truncate">{theme.theme}</span>
                                                    <span className="text-muted-foreground">{theme.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Detalhes dos Temas Mais Repetidos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes dos Principais Temas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {(data?.mostRepeated || []).slice(0, 8).map((themeData) => (
                                    <div key={themeData.theme} className="border-b pb-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-semibold text-sm capitalize">{themeData.theme}</h4>
                                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                {themeData.count} repetições
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground mb-2">
                                            {themeData.courseCount} cursos • {themeData.yearSpread} anos
                                        </div>
                                        <div className="space-y-1">
                                            {themeData.tccs.slice(0, 3).map((tcc) => (
                                                <div key={tcc.id} className="text-xs">
                                                    <div className="font-medium truncate">{tcc.title}</div>
                                                    <div className="text-muted-foreground">
                                                        {tcc.authorName} • {tcc.courseName} • {tcc.year}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Alert for Theme Detection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <h4 className="font-semibold text-amber-800 mb-1">Sobre a Detecção de Temas</h4>
                                <p className="text-sm text-amber-700">
                                    Os temas são identificados automaticamente com base em palavras-chave comuns
                                    encontradas nos títulos dos TCCs. Esta análise ajuda a identificar áreas de
                                    pesquisa mais populares e tendências ao longo do tempo.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}