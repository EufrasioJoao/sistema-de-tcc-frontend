"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Database,
    RefreshCw,
    Plus,
    Clock,
    CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { BackupTable } from "../_components/BackupTable";

interface Backup {
    id: string;
    filename: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
    file_size: number | null;
    created_at: string;
    completed_at: string | null;
    started_at: string | null;
    error_message: string | null;
}

interface BackupData {
    backups: Backup[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

interface BackupFilters {
    search: string;
    status: string;
    sortBy: string;
    sortOrder: string;
    page: number;
    limit: number;
}

export default function BackupPage() {
    const [loading, setLoading] = useState(true);
    const [backupData, setBackupData] = useState<BackupData | null>(null);
    const [creatingBackup, setCreatingBackup] = useState(false);
    const [filters, setFilters] = useState<BackupFilters>({
        search: "",
        status: "all",
        sortBy: "created_at",
        sortOrder: "desc",
        page: 1,
        limit: 10,
    });

    async function getBackupHistory(currentFilters = filters) {
        setLoading(true);

        try {
            const params = new URLSearchParams({
                page: currentFilters.page.toString(),
                limit: currentFilters.limit.toString(),
                sortBy: currentFilters.sortBy,
                sortOrder: currentFilters.sortOrder,
            });

            if (currentFilters.search) {
                params.append('search', currentFilters.search);
            }

            if (currentFilters.status && currentFilters.status !== 'all') {
                params.append('status', currentFilters.status);
            }

            const response = await api.get(`/api/backup/history?${params.toString()}`);

            if (response.data.success) {
                setBackupData(response.data.data);
            }
        } catch (error) {
            console.error("Error getting backup history:", error);
            toast.error("Erro ao carregar histórico de backups");
        }

        setLoading(false);
    }

    async function createBackup() {
        setCreatingBackup(true);

        try {
            const response = await api.post("/api/backup/create");

            if (response.data.success) {
                toast.success("Backup iniciado com sucesso");
                // Refresh the list after a short delay
                setTimeout(() => {
                    getBackupHistory();
                }, 2000);
            }
        } catch (error: any) {
            console.error("Error creating backup:", error);
            toast.error(
                error.response?.data?.message || "Erro ao iniciar backup"
            );
        }

        setCreatingBackup(false);
    }

    async function downloadBackup(backup: Backup) {
        try {
            const response = await api.get(`/api/backup/download/${backup.id}`);

            if (response.data.success) {
                const { downloadUrl } = response.data.data;

                // Create a temporary link to download the file
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = backup.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success("Download iniciado");
            }
        } catch (error: any) {
            console.error("Error downloading backup:", error);
            toast.error(
                error.response?.data?.message || "Erro ao baixar backup"
            );
        }
    }

    const handleRefresh = (newFilters: BackupFilters) => {
        setFilters(newFilters);
        getBackupHistory(newFilters);
    };

    const handlePageChange = (page: number) => {
        const newFilters = { ...filters, page };
        setFilters(newFilters);
        getBackupHistory(newFilters);
    };

    useEffect(() => {
        getBackupHistory();
    }, []);

    if (loading && !backupData) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-2" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen dark:bg-slate-900">
            <div className="py-8 space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full pb-6 border-b border-gray-200 dark:border-slate-700"
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                Gerenciamento de Backup
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Gerencie backups do banco de dados do sistema
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={() => getBackupHistory()}
                                variant="outline"
                                size="sm"
                                className="border-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Atualizar
                            </Button>

                            <Button
                                onClick={createBackup}
                                disabled={creatingBackup}
                                className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                            >
                                {creatingBackup ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="mr-2 h-4 w-4" />
                                )}
                                Criar Backup
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                {backupData && (
                    <div className="grid gap-6 md:grid-cols-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Total de Backups
                                    </CardTitle>
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                        <Database className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                        {backupData.pagination.total}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Backups registrados
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Backups Concluídos
                                    </CardTitle>
                                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                        {backupData.backups.filter(b => b.status === "COMPLETED").length}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Disponíveis para download
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Em Progresso
                                    </CardTitle>
                                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                        {backupData.backups.filter(b => b.status === "IN_PROGRESS").length}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Backups sendo processados
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}

                {/* Backup Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <BackupTable
                        backups={backupData?.backups || []}
                        loading={loading}
                        pagination={backupData?.pagination}
                        onDownload={downloadBackup}
                        onRefresh={handleRefresh}
                        onPageChange={handlePageChange}
                    />
                </motion.div>
            </div>
        </div>
    );
}