"use client";
import React from "react";
import { Users, UserCheck, UserX, ShieldCheck, TrendingUp, Award } from "lucide-react";
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

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
};

const numberVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      delay: 0.2
    }
  },
};

export const Cards = ({ stats }: { stats: Stats }) => {
  const activePercentage = stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0;
  
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.15 }}
    >
      {/* Total Users Card */}
      <motion.div variants={cardVariants} className="lg:col-span-2">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-900/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <div>
              <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                Total de Usuários
              </CardTitle>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                Sistema acadêmico
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <motion.div 
              variants={numberVariants}
              className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4"
            >
              {stats.totalUsers}
            </motion.div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    {stats.activeUsers} Ativos
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {stats.inactiveUsers} Inativos
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-semibold">{activePercentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Roles Cards */}
      <motion.div variants={cardVariants} className="lg:col-span-2">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/50 dark:to-pink-900/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-300/20 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <div>
              <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                Distribuição de Cargos
              </CardTitle>
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                Funções no sistema
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stats.rolesCount).map(([role, count], index) => {
                const IconComponent = roleIcons[role] || Users;
                return (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="group p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 border border-purple-200/50 dark:border-purple-800/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <IconComponent className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-purple-900 dark:text-purple-100 truncate">
                          {roleMapping[role] || role}
                        </p>
                        <p className="text-lg font-bold text-purple-800 dark:text-purple-200">
                          {count}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
