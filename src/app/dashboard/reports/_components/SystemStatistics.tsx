"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, FileText, HardDrive, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface SystemStatisticsProps {
    data: {
        users: {
            total: number;
            active: number;
        };
        courses: number;
        students: number;
        tccs: number;
        files: number;
        storage: {
            used: number;
        };
        activity: {
            recent: number;
        };
    };
}

export function SystemStatistics({ data }: SystemStatisticsProps) {
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Verificações de segurança para evitar erros
    const users = data?.users || { total: 0, active: 0 };
    const storage = data?.storage || { used: 0 };
    const activity = data?.activity || { recent: 0 };

    const stats = [
        {
            title: "Total de Usuários",
            value: users.total,
            subtitle: `${users.active} ativos`,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            title: "Cursos",
            value: data?.courses || 0,
            subtitle: "Cadastrados",
            icon: BookOpen,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-900/20",
        },
        {
            title: "Estudantes",
            value: data?.students || 0,
            subtitle: "Registrados",
            icon: GraduationCap,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
        },
        {
            title: "TCCs",
            value: data?.tccs || 0,
            subtitle: "Publicados",
            icon: FileText,
            color: "text-orange-600",
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
        },
        {
            title: "Arquivos",
            value: data?.files || 0,
            subtitle: "Armazenados",
            icon: HardDrive,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-900/20",
        },
        {
            title: "Atividade Recente",
            value: activity.recent,
            subtitle: "Últimos 7 dias",
            icon: Activity,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stat.title === "Armazenamento" ? formatBytes(storage.used) : (stat.value || 0).toLocaleString()}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {stat.subtitle}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}