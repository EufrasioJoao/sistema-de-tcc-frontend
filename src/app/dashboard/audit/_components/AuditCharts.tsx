"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    YAxis,
} from "recharts";
import { Activity, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface TimeSeriesData {
    dailyActivity: Array<{
        date: string;
        VIEW_FILE: number;
        DOWNLOAD_FILE: number;
        UPLOAD_FILE: number;
        EDIT_FILE: number;
        total: number;
    }>;
    hourlyActivity: Array<{
        hour: string;
        actions: number;
    }>;
}

interface AuditChartsProps {
    timeSeriesData: TimeSeriesData;
}

const chartConfig = {
    VIEW_FILE: {
        label: "Visualizações",
        color: "var(--chart-1)",
    },
    DOWNLOAD_FILE: {
        label: "Downloads",
        color: "var(--chart-2)",
    },
    UPLOAD_FILE: {
        label: "Uploads",
        color: "var(--chart-3)",
    },
    EDIT_FILE: {
        label: "Edições",
        color: "var(--chart-4)",
    },
    total: {
        label: "Total",
        color: "var(--chart-2)",
    },
    actions: {
        label: "Ações",
        color: "var(--chart-2)",
    },
};

export function AuditCharts({ timeSeriesData }: AuditChartsProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Daily Activity Trend */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="md:col-span-2"
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Atividade Diária
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="aspect-auto h-[250] w-full">
                            <AreaChart data={timeSeriesData.dailyActivity}>
                                <defs>
                                    <linearGradient id="fillVIEW_FILE" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-VIEW_FILE)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-VIEW_FILE)" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="fillDOWNLOAD_FILE" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-DOWNLOAD_FILE)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-DOWNLOAD_FILE)" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="fillUPLOAD_FILE" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-UPLOAD_FILE)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-UPLOAD_FILE)" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="fillEDIT_FILE" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-EDIT_FILE)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-EDIT_FILE)" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    minTickGap={32}
                                    tickFormatter={formatDate}
                                />
                                <YAxis tickLine={false} axisLine={false} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                    labelFormatter={(value) => formatDate(value as string)}
                                />
                                <Area
                                    type="natural"
                                    dataKey="VIEW_FILE"
                                    stackId="1"
                                    stroke="var(--color-VIEW_FILE)"
                                    fill="url(#fillVIEW_FILE)"
                                />
                                <Area
                                    type="natural"
                                    dataKey="DOWNLOAD_FILE"
                                    stackId="1"
                                    stroke="var(--color-DOWNLOAD_FILE)"
                                    fill="url(#fillDOWNLOAD_FILE)"
                                />
                                <Area
                                    type="natural"
                                    dataKey="UPLOAD_FILE"
                                    stackId="1"
                                    stroke="var(--color-UPLOAD_FILE)"
                                    fill="url(#fillUPLOAD_FILE)"
                                />
                                <Area
                                    type="natural"
                                    dataKey="EDIT_FILE"
                                    stackId="1"
                                    stroke="var(--color-EDIT_FILE)"
                                    fill="url(#fillEDIT_FILE)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Total Activity Line Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Tendência Total
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="aspect-auto h-[250]">
                            <LineChart data={timeSeriesData.dailyActivity}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    minTickGap={32}
                                    tickFormatter={formatDate}
                                />
                                <YAxis tickLine={false} axisLine={false} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                    labelFormatter={(value) => formatDate(value as string)}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="var(--color-total)"
                                    strokeWidth={2}
                                    dot={{ fill: "var(--color-total)", strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Hourly Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Atividade por Hora (24h)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="aspect-auto h-[250]">
                            <BarChart data={timeSeriesData.hourlyActivity}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="hour"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <YAxis tickLine={false} axisLine={false} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                />
                                <Bar
                                    dataKey="actions"
                                    fill="var(--color-actions)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}