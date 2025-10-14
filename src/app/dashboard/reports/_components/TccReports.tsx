"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FileText, Calendar, GraduationCap, UserCheck } from "lucide-react";

interface TccReportsData {
  byType: Array<{ type: string; count: number }>;
  byYear: Array<{ year: number; count: number }>;
  byCourse: Array<{ courseId: string; courseName: string; count: number }>;
  recent: Array<any>;
}

interface TccReportsProps {
  data: TccReportsData;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
];

export function TccReports({ data }: TccReportsProps) {
  // Verificação de segurança - se não há dados, mostrar estado de carregamento
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando dados dos TCCs...</p>
      </div>
    );
  }

  const totalTccs =
    data.byType?.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de TCCs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTccs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ano Mais Ativo
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.byYear?.[0]?.year || "N/A"}
            </div>
            <div className="text-xs text-muted-foreground">
              {data.byYear?.[0]?.count || 0} TCCs
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.byCourse?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TCCs por Tipo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>TCCs por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data?.byType || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, count }) => `${type}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(data?.byType || []).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} TCCs`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* TCCs por Ano */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>TCCs por Ano</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.byYear || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} TCCs`, 'Quantidade']} />
                  <Bar dataKey="count" fill="#3b82f6" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* TCCs por Curso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>TCCs por Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={(data?.byCourse || []).slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="courseName"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} TCCs`, 'Quantidade']} />
                  <Bar dataKey="count" fill="#10b981" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent TCCs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>TCCs Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Título</th>
                    <th className="text-left p-2">Autor</th>
                    <th className="text-left p-2">Orientador</th>
                    <th className="text-left p-2">Curso</th>
                    <th className="text-left p-2">Ano</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.recent || []).map((tcc) => (
                    <tr key={tcc.id} className="border-b">
                      <td className="p-2 font-medium max-w-xs truncate">
                        {tcc.title}
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {tcc.author
                          ? `${tcc.author.firstName} ${tcc.author.lastName}`
                          : "N/A"}
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {tcc.supervisor || "N/A"}
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {tcc.course?.name || "N/A"}
                      </td>
                      <td className="p-2 text-muted-foreground">{tcc.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
