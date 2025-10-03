"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList, XAxis,
  YAxis
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
import { UsersChart } from "./UsersChart";

interface ChartsProps {
  barChartData: ChartData[];
  areaChartData: {
    date: string;
    usuarios: number;
  }[]
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

export function Charts({ barChartData, areaChartData }: ChartsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 mb-4">
      <div className="lg:col-span-2">

        <UsersChart areaChartData={areaChartData} />
      </div>

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
