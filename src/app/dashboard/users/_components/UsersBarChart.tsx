"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"



const chartConfig = {
  total: {
    label: "total",
  },
  Administrador: {
    label: "Administrador",
    color: "var(--chart-1)",
  },
  "Gerente de Sistema": {
    label: "Gerente de Sistema",
    color: "var(--chart-2)",
  },
  "Coordenador de Curso": {
    label: "Coordenador de Curso",
    color: "var(--chart-3)",
  },
  "Registro Acadêmico": {
    label: "Registro Acadêmico",
    color: "var(--chart-4)",
  },
  Outro: {
    label: "Outro",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function UsersBarChart({ chartData }: { chartData: {
    name: string;
    total: number;
  }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Mixed</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total total for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
