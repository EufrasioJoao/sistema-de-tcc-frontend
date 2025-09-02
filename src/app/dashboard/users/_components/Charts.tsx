"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartData } from "./types";
import { TrendingUp } from "lucide-react";

interface ChartsProps {
  barChartData: ChartData[];
  lineChartData: ChartData[];
}

const barChartConfig = {
  Administrador: {
    label: "Administrador",
    color: "oklch(0.646 0.222 41.116)",
  },
  "Gerente de Sistema": {
    label: "Gerente de Sistema",
    color: "oklch(0.6 0.118 184.704)",
  },
  "Coordenador de Curso": {
    label: "Coordenador de Curso",
    color: "oklch(0.398 0.07 227.392)",
  },
  "Registro Acadêmico": {
    label: "Registro Acadêmico",
    color: "oklch(0.828 0.189 84.429)",
  },
} satisfies ChartConfig;

const chartConfig = {
  users: {
    label: "Novos Usuários",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function Charts({ barChartData, lineChartData }: ChartsProps) {
  return (
    <div className="grid gap-4 grid-cols-3 mb-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Novos usuários</CardTitle>
          <CardDescription>
            Total de novos usuários nos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="max-h-[280px] w-full" config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={lineChartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-users)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-users)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="users"
                type="natural"
                fill="url(#fillUsers)"
                fillOpacity={0.4}
                stroke="var(--color-users)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Cargos</CardTitle>
          <CardDescription>
            Uma visão geral da distribuição de cargos na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig} className="w-full">
            <BarChart
              accessibilityLayer
              data={barChartData}
              layout="vertical"
              margin={{ right: 20, left: 20 }}
              barSize={40}
            >
              <CartesianGrid horizontal={false} />
              <YAxis dataKey="name" type="category" hide />
              <XAxis dataKey="total" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="total" layout="vertical" radius={5}>
                {barChartData.map((entry) => {
                  const configEntry =
                    barChartConfig[entry.name as keyof typeof barChartConfig];
                  const color =
                    configEntry && "color" in configEntry
                      ? configEntry.color
                      : "var(--chart-5)";
                  return <Cell key={entry.name} fill={color as string} />;
                })}
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={8}
                  className="fill-[var(--card)]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="total"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="text-muted-foreground">
            Mostrando o total de usuários para cada cargo.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
