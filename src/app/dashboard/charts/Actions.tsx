"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartStyle } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-content";

interface DataItem {
  date: string;
  foldersCreated: number;
  filesCreated: number;
}

export function ActionsChart({ data }: { data: DataItem[] }) {
  const { t } = useLanguage();
  const id = "bar-chart-interactive";
  const [activeDate, setActiveDate] = React.useState(data[0]?.date);

  const dates = React.useMemo(() => data.map((item) => item?.date), [data]);

  return (
    <Card
      data-chart={id}
      className="overflow-hidden rounded border border-stone-300 flex flex-col"
    >
      <ChartStyle id={id} config={{}} />
      <CardHeader className="flex-column  gap-4 space-y-0 pb-6">
        <div className="flex-1 grid gap-1">
          <CardTitle>{t("dashboard-page.actionsOverview")}</CardTitle>
          <CardDescription>
            {t("dashboard-page.folderFileCreation")}
          </CardDescription>
        </div>

        <Select value={activeDate} onValueChange={setActiveDate}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a date"
          >
            <SelectValue placeholder="Select date" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {dates.map((key) => {
              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">{key}</div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={{}}
          className="mx-auto aspect-square w-full  min-w-[300px]"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="foldersCreated"
                name={t("dashboard-page.foldersCreated")}
                fill="hsl(var(--chart-2))"
                barSize={20}
              />
              <Bar
                dataKey="filesCreated"
                name={t("dashboard-page.filesCreated")}
                fill="hsl(var(--chart-1))"
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
