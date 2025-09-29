"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Eye, 
  Download, 
  Upload, 
  Edit, 
  MoreHorizontal, 
  FileText, 
  User,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

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

interface AuditTableProps {
  auditLogs: AuditLog[];
  loading: boolean;
  onRefresh: () => void;
}

export function AuditTable({ auditLogs, loading, onRefresh }: AuditTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = auditLogs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(auditLogs.length / itemsPerPage);

  const actionIcons = {
    VIEW_FILE: Eye,
    DOWNLOAD_FILE: Download,
    UPLOAD_FILE: Upload,
    EDIT_FILE: Edit,
  };

  const actionLabels = {
    VIEW_FILE: "Visualização",
    DOWNLOAD_FILE: "Download",
    UPLOAD_FILE: "Upload",
    EDIT_FILE: "Edição",
  };

  const actionColors = {
    VIEW_FILE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    DOWNLOAD_FILE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    UPLOAD_FILE: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    EDIT_FILE: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  };

  const roleLabels = {
    ADMIN: "Administrador",
    SISTEM_MANAGER: "Gerente de Sistema",
    COURSE_COORDENATOR: "Coordenador",
    ACADEMIC_REGISTER: "Registro Acadêmico",
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getTCCInfo = (log: AuditLog) => {
    const tcc = log.file.tcc || log.file.defenseRecordForTcc;
    if (tcc) {
      return {
        title: tcc.title,
        author: `${tcc.author.firstName} ${tcc.author.lastName}`,
        type: log.file.tcc ? "Principal" : "Ata de Defesa"
      };
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Logs de Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Logs de Auditoria
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {auditLogs.length} registro{auditLogs.length !== 1 ? 's' : ''}
            </span>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {auditLogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum log encontrado</h3>
            <p className="text-muted-foreground">
              Não há logs de auditoria para os filtros selecionados.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ação</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>TCC</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map((log, index) => {
                    const Icon = actionIcons[log.action_performed];
                    const tccInfo = getTCCInfo(log);
                    
                    return (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <Badge 
                              variant="secondary" 
                              className={actionColors[log.action_performed]}
                            >
                              {actionLabels[log.action_performed]}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {log.user.first_name} {log.user.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {roleLabels[log.user.role as keyof typeof roleLabels] || log.user.role}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium max-w-[200px] truncate">
                              {log.file.displayName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {log.file.filename}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {tccInfo ? (
                            <div className="space-y-1">
                              <div className="font-medium max-w-[250px] truncate">
                                {tccInfo.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {tccInfo.author} • {tccInfo.type}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDate(log.accessed_at)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                Ver usuário
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Ver arquivo
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, auditLogs.length)} de {auditLogs.length} registros
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <span className="text-sm">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
