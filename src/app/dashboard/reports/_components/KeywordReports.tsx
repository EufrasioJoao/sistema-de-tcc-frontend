"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tag, TrendingUp, BookOpen, Calendar } from "lucide-react";

interface KeywordReportsData {
    mostUsed: Array<{
        keyword: string;
        count: number;
        courseCount: number;
        yearSpread: number;
        tccs: Array<{ id: string; title: string; courseName: string; year: number }>;
    }>;
    byCourse: Array<{
        courseName: string;
        topKeywords: Array<{ keyword: string; count: number }>;
    }>;
    byYear: Array<{
        year: number;
        topKeywords: Array<{ keyword: string; count: number }>;
    }>;
    totalKeywords: number;
    totalTccsWithKeywords: number;
}

interface KeywordReportsProps {
    data: KeywordReportsData;
}

export function KeywordReports({ data }: KeywordReportsProps) {
    // Verificação de segurança - se não há dados ou dados vazios
    if (!data || (!data.mostUsed && !data.totalKeywords)) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-muted-foreground mb-2">Nenhuma palavra-chave encontrada</p>
                    <p className="text-sm text-muted-foreground">
                        Adicione palavras-chave aos TCCs para ver os relatórios
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Palavras-chave</CardTitle>
                        <Tag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalKeywords || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mais Usada</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {data?.mostUsed?.[0]?.keyword || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {data?.mostUsed?.[0]?.count || 0} usos
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">TCCs com Palavras-chave</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.totalTccsWithKeywords || 0}</div>
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
                {/* Palavras-chave Mais Usadas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Palavras-chave Mais Usadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={(data?.mostUsed || []).slice(0, 10)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="keyword"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Palavras-chave por Ano */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Tendências por Ano</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-80 overflow-y-auto">
                                {(data?.byYear || []).slice(0, 5).map((yearData) => (
                                    <div key={yearData.year} className="border-b pb-2">
                                        <h4 className="font-semibold mb-2">{yearData.year}</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {yearData.topKeywords.slice(0, 4).map((keyword) => (
                                                <div key={keyword.keyword} className="flex justify-between text-sm">
                                                    <span className="truncate">{keyword.keyword}</span>
                                                    <span className="text-muted-foreground">{keyword.count}</span>
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Palavras-chave por Curso</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {(data?.byCourse || []).slice(0, 5).map((courseData) => (
                                    <div key={courseData.courseName} className="border-b pb-3">
                                        <h4 className="font-semibold mb-2 text-sm">{courseData.courseName}</h4>
                                        <div className="space-y-1">
                                            {courseData.topKeywords.slice(0, 5).map((keyword) => (
                                                <div key={keyword.keyword} className="flex justify-between text-sm">
                                                    <span className="truncate">{keyword.keyword}</span>
                                                    <span className="text-muted-foreground">{keyword.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Detalhes das Palavras-chave Mais Usadas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes das Principais Palavras-chave</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {(data?.mostUsed || []).slice(0, 8).map((keywordData) => (
                                    <div key={keywordData.keyword} className="border-b pb-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-semibold text-sm">{keywordData.keyword}</h4>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {keywordData.count} usos
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground mb-2">
                                            {keywordData.courseCount} cursos • {keywordData.yearSpread} anos
                                        </div>
                                        <div className="space-y-1">
                                            {keywordData.tccs.slice(0, 3).map((tcc) => (
                                                <div key={tcc.id} className="text-xs">
                                                    <div className="font-medium truncate">{tcc.title}</div>
                                                    <div className="text-muted-foreground">
                                                        {tcc.courseName} • {tcc.year}
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
        </div>
    );
}