"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  LabelList,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from "@/lib/api";

interface TCCStatistics {
  byType: Array<{
    type: string;
    count: number;
  }>;
  byYear: Array<{
    year: number;
    count: number;
  }>;
  monthly: Array<{
    month: number;
    monthName: string;
    total: number;
    BACHELOR: number;
    MASTER: number;
    DOCTORATE: number;
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

const monthlyChartConfig = {
  total: {
    label: "Total",
    color: "#8B5CF6",
  },
} satisfies ChartConfig;

export function TCCCharts({ refreshTrigger }: TCCChartsProps) {
  const [statistics, setStatistics] = useState<TCCStatistics | null>(null);
  const [loading, setLoading] = useState(true);

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

  const yearData = statistics.byYear.map((item) => ({
    year: item.year.toString(),
    count: item.count,
  }));

  const monthlyData = statistics.monthly || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {/* TCCs por Mês */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>TCCs por Mês</CardTitle>
            <CardDescription>
              Distribuição mensal dos trabalhos no ano atual
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <ChartContainer config={monthlyChartConfig}>
              <AreaChart
                accessibilityLayer
                data={monthlyData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="monthName"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="total"
                  type="natural"
                  fill="var(--color-total)"
                  fillOpacity={0.4}
                  stroke="var(--color-total)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none font-medium">
                  {monthlyData.reduce((sum, month) => sum + month.total, 0)}{" "}
                  TCCs este ano
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                  Janeiro - Dezembro {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
