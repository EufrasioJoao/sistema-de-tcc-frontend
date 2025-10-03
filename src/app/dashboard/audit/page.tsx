"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserData } from "@/contexts/app-context";
import { UserRoles } from "@/types/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Activity,
  Users,
  FileText,
  Download,
  Eye,
  Upload,
  Edit,
} from "lucide-react";
import { AuditStatistics } from "./_components/AuditStatistics";
import { AuditTable } from "./_components/AuditTable";
import { AuditFilters } from "./_components/AuditFilters";
import { AuditCharts } from "./_components/AuditCharts";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface AuditLog {
  id: string;
  action_performed: "VIEW_FILE" | "DOWNLOAD_FILE" | "EDIT_FILE" | "UPLOAD_FILE";
  accessed_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  file: {
    id: string;
    filename: string;
    displayName: string;
    tcc?: {
      id: string;
      title: string;
      author: {
        firstName: string;
        lastName: string;
      };
    };
    defenseRecordForTcc?: {
      id: string;
      title: string;
      author: {
        firstName: string;
        lastName: string;
      };
    };
  };
}

interface AuditStatisticsData {
  totalActions: number;
  uniqueUsers: number;
  actionBreakdown: Record<string, number>;
  period: string;
  timeSeriesData?: {
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
  };
}

interface AuditFilters {
  userId?: string;
  fileId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export default function AuditPage() {
  const { user } = useUserData();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [statistics, setStatistics] = useState<AuditStatisticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AuditFilters>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check if user has access to audit logs
  const hasAuditAccess =
    user?.role === UserRoles.ADMIN || user?.role === UserRoles.SISTEM_MANAGER;

  useEffect(() => {
    if (!hasAuditAccess) return;

    fetchAuditData();
  }, [hasAuditAccess, filters, refreshTrigger]);

  const fetchAuditData = async () => {
    try {
      setLoading(true);

      // Fetch audit logs
      const logsParams = new URLSearchParams();
      if (filters.userId) logsParams.append("userId", filters.userId);
      if (filters.fileId) logsParams.append("fileId", filters.fileId);
      if (filters.action) logsParams.append("action", filters.action);
      if (filters.startDate) logsParams.append("startDate", filters.startDate);
      if (filters.endDate) logsParams.append("endDate", filters.endDate);
      logsParams.append("limit", "100");

      const [logsResponse, statsResponse] = await Promise.all([
        api.get(`/api/audit?${logsParams.toString()}`),
        api.get("/api/audit/statistics?days=30"),
      ]);

      if (logsResponse.data.success) {
        setAuditLogs(logsResponse.data.data.auditLogs);
      }

      if (statsResponse.data.success) {
        setStatistics(statsResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching audit data:", error);
      toast.error("Erro ao carregar dados de auditoria");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: AuditFilters) => {
    setFilters(newFilters);
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!hasAuditAccess) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
                <p className="text-muted-foreground">
                  Você não tem permissão para acessar os logs de auditoria.
                  Apenas administradores e gerentes de sistema podem visualizar
                  esta página.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Auditoria</h1>
            <p className="text-muted-foreground">
              Monitore e analise atividades do sistema
            </p>
          </div>
          <Shield className="h-8 w-8 text-primary" />
        </div>
      </motion.div>

      {/* Statistics Cards */}
      {statistics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AuditStatistics statistics={statistics} />
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="logs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs de Auditoria
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Análises
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-6">
            {/* Filters */}
            <AuditFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onRefresh={triggerRefresh}
            />

            {/* Audit Table */}
            <AuditTable
              auditLogs={auditLogs}
              loading={loading}
              onRefresh={triggerRefresh}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {statistics?.timeSeriesData ? (
              <AuditCharts timeSeriesData={statistics.timeSeriesData} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Análises Detalhadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Carregando Análises
                    </h3>
                    <p className="text-muted-foreground">
                      Preparando gráficos e análises detalhadas...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
