"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Eye, Download, Upload, Edit } from "lucide-react";
import { motion } from "framer-motion";

interface AuditStatisticsProps {
  statistics: {
    totalActions: number;
    uniqueUsers: number;
    actionBreakdown: Record<string, number>;
    period: string;
  };
}

export function AuditStatistics({ statistics }: AuditStatisticsProps) {
  const actionIcons = {
    VIEW_FILE: Eye,
    DOWNLOAD_FILE: Download,
    UPLOAD_FILE: Upload,
    EDIT_FILE: Edit,
  };

  const actionLabels = {
    VIEW_FILE: "Visualizações",
    DOWNLOAD_FILE: "Downloads",
    UPLOAD_FILE: "Uploads",
    EDIT_FILE: "Edições",
  };

  const actionColors = {
    VIEW_FILE: "text-blue-600 bg-blue-100",
    DOWNLOAD_FILE: "text-green-600 bg-green-100",
    UPLOAD_FILE: "text-purple-600 bg-purple-100",
    EDIT_FILE: "text-orange-600 bg-orange-100",
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Actions */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ações</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalActions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Últimos {statistics.period}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Unique Users */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              Usuários únicos
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Breakdown */}
      {Object.entries(statistics.actionBreakdown)
        .slice(0, 2)
        .map(([action, count], index) => {
          const Icon = actionIcons[action as keyof typeof actionIcons];
          const label = actionLabels[action as keyof typeof actionLabels];
          const colorClass = actionColors[action as keyof typeof actionColors];

          return (
            <motion.div
              key={action}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{label}</CardTitle>
                  <div className={`p-2 rounded-full ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {((count / statistics.totalActions) * 100).toFixed(1)}% do total
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

      {/* Detailed Action Breakdown */}
      {Object.keys(statistics.actionBreakdown).length > 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="md:col-span-2 lg:col-span-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Distribuição de Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(statistics.actionBreakdown).map(([action, count]) => {
                  const Icon = actionIcons[action as keyof typeof actionIcons];
                  const label = actionLabels[action as keyof typeof actionLabels];
                  const colorClass = actionColors[action as keyof typeof actionColors];
                  const percentage = ((count / statistics.totalActions) * 100).toFixed(1);

                  return (
                    <div key={action} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{label}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">{count}</span>
                          <span className="text-xs text-muted-foreground">({percentage}%)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
