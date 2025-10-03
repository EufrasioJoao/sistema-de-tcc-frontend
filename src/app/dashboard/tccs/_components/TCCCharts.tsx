"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  LabelList
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from "@/lib/api";
import { TccChart } from "../../_components/TccChart";

interface TCCStatistics {
  byType: Array<{
    type: string;
    count: number;
  }>;
  
  areaChartData: Array<{
    date: string;
    tccs: number;
  }>;
}

interface TCCChartsProps {
  refreshTrigger: number;
}

const typeLabels = {
  BACHELOR: "Monografias",
  MASTER: "Dissertações",
  DOCTORATE: "Teses",
};

const typeChartConfig = {
  value: {
    label: "TCCs",
  },
  BACHELOR: {
    label: "Monografias",
    color: "#3B82F6",
  },
  MASTER: {
    label: "Dissertações",
    color: "#10B981",
  },
  DOCTORATE: {
    label: "Teses",
    color: "#8B5CF6",
  },
} satisfies ChartConfig;


export function TCCCharts({ refreshTrigger }: TCCChartsProps) {
  const [statistics, setStatistics] = useState<TCCStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("365d");

  useEffect(() => {
    fetchStatistics();
  }, [refreshTrigger]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/tccs/statistics/charts");
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading || !statistics) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {[1, 2].map((i) => (
          <Card key={i} className="h-80">
            <CardHeader>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-60 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const typeData = statistics.byType.map((item) => ({
    type: item.type,
    value: item.count,
    fill: `var(--color-${item.type})`,
  }));


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      

      {/* TCCs Chart */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2"
      >
       
       <TccChart areaChartData={statistics.areaChartData || []} />
      </motion.div>

      {/* TCCs por Tipo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>TCCs por Tipo</CardTitle>
            <CardDescription>
              Distribuição dos trabalhos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={typeChartConfig}
              className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="value" hideLabel />}
                />
                <Pie data={typeData} dataKey="value">
                  <LabelList
                    dataKey="type"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                    formatter={(value: keyof typeof typeLabels) =>
                      typeLabels[value] || value
                    }
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              {typeData.reduce((sum, item) => sum + item.value, 0)} trabalhos
              cadastrados
            </div>
            <div className="text-muted-foreground leading-none">
              {typeData.length} tipos diferentes
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
