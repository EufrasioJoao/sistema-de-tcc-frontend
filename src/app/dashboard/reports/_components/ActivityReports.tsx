"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Activity, Users, FileText, TrendingUp } from "lucide-react";

interface ActivityReportsData {
    byAction: Array<{ action: string; count: number }>;
    byDay: Array<{ date: string; count: number }>;
    mostActiveUsers: Array<{ userId: string; userName: string; email: string; activityCount: number }>;
    mostAccessedFiles: Array<{ fileId: string; fileName: string; accessCount: number }>;
}

interface ActivityReportsProps {
    data: ActivityReportsData;
}

export function ActivityReports({ data }: ActivityReportsProps) {
    // Verificação de segurança - se não há dados, mostrar estado de carregamento
    if (!data) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Carregando dados de atividade...</p>
            </div>
        );
    }

    const totalActivity = (data?.byAction || []).reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Atividades</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalActivity}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.mostActiveUsers?.length || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Arquivos Acessados</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.mostAccessedFiles?.length || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ação Mais Comum</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {data?.byAction?.[0]?.action || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {data?.byAction?.[0]?.count || 0} vezes
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Atividade por Ação */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Atividade por Ação</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data?.byAction || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="action"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                    />
                                    <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip formatter={(value) => [`${value} ações`, 'Quantidade']} />
                                    <Bar dataKey="count" fill="#3b82f6" name="Quantidade" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Atividade por Dia */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Atividade por Dia</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data?.byDay || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        fontSize={12}
                                    />
                                    <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip formatter={(value) => [`${value} atividades`, 'Quantidade']} />
                                    <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} name="Quantidade" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Usuários Mais Ativos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Usuários Mais Ativos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">Nome</th>
                                            <th className="text-left p-2">Email</th>
                                            <th className="text-left p-2">Atividades</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data?.mostActiveUsers || []).slice(0, 8).map((user) => (
                                            <tr key={user.userId} className="border-b">
                                                <td className="p-2 font-medium">{user.userName}</td>
                                                <td className="p-2 text-muted-foreground text-xs">{user.email}</td>
                                                <td className="p-2 text-muted-foreground">{user.activityCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Arquivos Mais Acessados */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Arquivos Mais Acessados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">Nome do Arquivo</th>
                                            <th className="text-left p-2">Acessos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data?.mostAccessedFiles || []).slice(0, 8).map((file) => (
                                            <tr key={file.fileId} className="border-b">
                                                <td className="p-2 font-medium max-w-xs truncate">{file.fileName}</td>
                                                <td className="p-2 text-muted-foreground">{file.accessCount}</td>
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