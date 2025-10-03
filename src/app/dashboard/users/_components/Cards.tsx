"use client";
import React from "react";
import { Users, UserCheck, ShieldCheck, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  rolesCount: Record<string, number>;
}

const roleMapping: Record<string, string> = {
  ADMIN: "Administradores",
  SISTEM_MANAGER: "Gerentes de Sistema",
  COURSE_COORDENATOR: "Coordenadores de Curso",
  ACADEMIC_REGISTER: "Registro Acadêmico",
};

const roleIcons: Record<string, React.ComponentType<any>> = {
  ADMIN: Award,
  SISTEM_MANAGER: ShieldCheck,
  COURSE_COORDENATOR: Users,
  ACADEMIC_REGISTER: UserCheck,
};

export const Cards = ({ stats }: { stats: Stats }) => {
  const activePercentage = stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Users Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 * 0.1 }}
        className="lg:col-span-2"
      >
        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total de Usuários
            </CardTitle>
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stats.activeUsers} ativos • {stats.inactiveUsers} inativos ({activePercentage}% ativos)
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Roles Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 * 0.1 }}
        className="lg:col-span-2"
      >
        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Distribuição de Cargos
            </CardTitle>
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <ShieldCheck className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(stats.rolesCount).map(([role, count], index) => {
                const IconComponent = roleIcons[role] || Users;
                return (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                  >
                    <div className="p-1.5 bg-slate-200 dark:bg-slate-600 rounded-md">
                      <IconComponent className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                        {roleMapping[role] || role}
                      </p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {count}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
