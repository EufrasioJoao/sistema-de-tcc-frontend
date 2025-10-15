"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  GraduationCap,
  BookOpen,
  Trophy,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { api } from "@/lib/api";

interface TCCStatistics {
  total: number;
  currentYear: number;
  recent: number;
  byType: Array<{
    type: string;
    count: number;
  }>;
}

interface TCCCardsProps {
  refreshTrigger: number;
}

export function TCCCards({ refreshTrigger }: TCCCardsProps) {
  const [statistics, setStatistics] = useState<TCCStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [refreshTrigger]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/tccs/statistics/cards");
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };
  const getTypeCount = (type: string) => {
    return statistics?.byType.find((item) => item.type === type)?.count || 0;
  };

  const getCurrentYearCount = () => {
    return statistics?.currentYear || 0;
  };

  const cards = [
    {
      title: "Total de TCCs",
      subtitle: "Arquivo completo",
      value: statistics?.total || 0,
      icon: FileText,
      gradient: "from-slate-600 to-slate-700",
      iconBg: "bg-slate-100 dark:bg-slate-800",
      iconColor: "text-slate-600 dark:text-slate-400",
    },
    {
      title: "Monografias",
      subtitle: "Monografias",
      value: getTypeCount("BACHELOR"),
      icon: GraduationCap,
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Dissertações",
      subtitle: "Dissertações",
      value: getTypeCount("MASTER"),
      icon: BookOpen,
      gradient: "from-violet-500 to-violet-600",
      iconBg: "bg-violet-100 dark:bg-violet-900/20",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      title: "Teses",
      subtitle: "Teses",
      value: getTypeCount("DOCTORATE"),
      icon: Trophy,
      gradient: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-100 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Este Ano",
      subtitle: new Date().getFullYear().toString(),
      value: getCurrentYearCount(),
      icon: Calendar,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-10 w-10 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {card.title}
              </CardTitle>
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <card.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {card.value.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
