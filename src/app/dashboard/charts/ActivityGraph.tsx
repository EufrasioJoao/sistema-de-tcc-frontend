"use client";

import React from "react";
import { User, Info } from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  Legend,
} from "recharts";
import { useLanguage } from "@/contexts/language-content";

export const ActivityGraph = ({
  data,
}: {
  data: {
    date: string;
    foldersCreated: number;
    filesCreated: number;
  }[];
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full h-full overflow-hidden rounded-lg border bg-background p-4 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-1.5 text-primary">
            <User className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-medium">{t("dashboard-page.activity")}</h3>
            <p className="text-xs text-muted-foreground">
              {t("dashboard-page.activityOverview")}
            </p>
          </div>
        </div>
        <button className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
          <Info className="h-4 w-4" />
        </button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e5e5"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e5e5",
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              itemStyle={{ fontSize: "12px" }}
              labelStyle={{
                fontSize: "12px",
                fontWeight: "500",
                marginBottom: "4px",
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px" }}
            />
            <Line
              type="monotone"
              dataKey="filesCreated"
              name={t("dashboard-page.filesCreated")}
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="foldersCreated"
              name={t("dashboard-page.foldersCreated")}
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
