"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, GraduationCap, BookOpen, Trophy, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
    return (
      statistics?.byType.find((item) => item.type === type)?.count || 0
    );
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
      subtitle: "Graduação",
      value: getTypeCount("BACHELOR"),
      icon: GraduationCap,
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Dissertações",
      subtitle: "Mestrado",
      value: getTypeCount("MASTER"),
      icon: BookOpen,
      gradient: "from-violet-500 to-violet-600",
      iconBg: "bg-violet-100 dark:bg-violet-900/20",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      title: "Teses",
      subtitle: "Doutorado",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="h-full"
        >
          <Card className="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 group h-full">
            <CardContent className="p-6 h-full flex flex-col">
              {/* Header with icon */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {card.subtitle}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>

              {/* Value */}
              <div className="flex-1 flex items-end">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {card.value.toLocaleString()}
                </div>
              </div>

              {/* Gradient accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`h-full bg-gradient-to-r ${card.gradient}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
