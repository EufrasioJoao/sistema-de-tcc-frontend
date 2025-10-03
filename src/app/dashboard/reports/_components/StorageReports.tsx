"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { HardDrive, Users, Database } from "lucide-react";

interface StorageReportsData {
    largestFiles: Array<any>;
    byUploader: Array<{ uploaderId: string; uploaderName: string; fileCount: number }>;
    organization: {
        name: string;
        usedStorage: number;
    };
}

interface StorageReportsProps {
    data: StorageReportsData;
}


function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function StorageReports({ data }: StorageReportsProps) {
    // Verificação de segurança - se não há dados, mostrar estado de carregamento
    if (!data) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Carregando dados de armazenamento...</p>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3
             gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Armazenamento Usado</CardTitle>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatFileSize(data?.organization?.usedStorage || 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {data?.organization?.name || 'N/A'}
                        </div>
                    </CardContent>
                </Card>


                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.byUploader?.length || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tipos de Arquivo</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.byType?.length || 0}</div>
                    </CardContent>
                </Card>
            </div>
            {/* Charts */}
            <div className="grid grid-cols-1">

                {/* Arquivos por Usuário */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Arquivos por Usuário</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={(data?.byUploader || []).slice(0, 8)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="uploaderName"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="fileCount" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Maiores Arquivos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Maiores Arquivos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">Nome</th>
                                            <th className="text-left p-2">Tamanho</th>
                                            <th className="text-left p-2">Tipo</th>
                                            <th className="text-left p-2">Uploader</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data?.largestFiles || []).slice(0, 8).map((file) => (
                                            <tr key={file.id} className="border-b">
                                                <td className="p-2 font-medium max-w-xs truncate">
                                                    {file.displayName || file.filename}
                                                </td>
                                                <td className="p-2 text-muted-foreground">
                                                    {formatFileSize(parseInt(file.size) || 0)}
                                                </td>
                                                <td className="p-2 text-muted-foreground">{file.type}</td>
                                                <td className="p-2 text-muted-foreground">
                                                    {file.uploader ?
                                                        `${file.uploader.first_name} ${file.uploader.last_name}` :
                                                        'N/A'
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Top Uploaders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
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
                                            <th className="text-left p-2">Arquivos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data?.byUploader || []).slice(0, 8).map((uploader) => (
                                            <tr key={uploader.uploaderId} className="border-b">
                                                <td className="p-2 font-medium">{uploader.uploaderName}</td>
                                                <td className="p-2 text-muted-foreground">{uploader.fileCount}</td>
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