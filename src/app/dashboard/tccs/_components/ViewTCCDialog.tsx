"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  Calendar,
  User,
  GraduationCap,
  BookOpen,
  Tag,
  Clock,
  Loader2,
} from "lucide-react";
import { downloadTCCFile } from "@/lib/download";
import { useFileViewer } from "@/lib/file-viewer";
import { useState } from "react";
import { Eye } from "lucide-react";
import { TCC } from "@/types/index";

// Using imported TCC type instead of local interface

interface ViewTCCDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tcc: TCC;
}

const typeLabels = {
  BACHELOR: "Monografia (Licenciatura)",
  MASTER: "Dissertação (Mestrado)",
  DOCTORATE: "Tese (Doutoramento)",
};

const typeColors = {
  BACHELOR: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  MASTER:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  DOCTORATE:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

export function ViewTCCDialog({ open, onOpenChange, tcc }: ViewTCCDialogProps) {
  const [downloadingMain, setDownloadingMain] = useState(false);
  const [downloadingDefense, setDownloadingDefense] = useState(false);
  const { openFileInViewer } = useFileViewer();

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (size: string) => {
    const bytes = parseInt(size);
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDownloadMain = async () => {
    if (tcc.file) {
      await downloadTCCFile(
        tcc.id,
        "main",
        tcc.file.displayName,
        setDownloadingMain
      );
    }
  };

  const handleDownloadDefense = async () => {
    if (tcc.defenseRecordFile) {
      await downloadTCCFile(
        tcc.id,
        "defense",
        tcc.defenseRecordFile.displayName,
        setDownloadingDefense
      );
    }
  };

  const handleViewMain = () => {
    if (tcc.file) {
      openFileInViewer(
        tcc.id,
        tcc.file.id,
        tcc.file.displayName,
        "main"
      );
    }
  };

  const handleViewDefense = () => {
    if (tcc.defenseRecordFile) {
      openFileInViewer(
        tcc.id,
        tcc.defenseRecordFile.id,
        tcc.defenseRecordFile.displayName,
        "defense"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Detalhes do TCC
          </DialogTitle>
          <DialogDescription>
            Informações completas do trabalho de conclusão de curso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title and Type */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                {tcc.title}
              </h3>
              <Badge className={typeColors[tcc.type]}>
                {typeLabels[tcc.type]}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Ano: {tcc.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Cadastrado em: {formatDate(tcc.createdAt)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Author and Supervisor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                Autor
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {tcc.author?.firstName} {tcc.author?.lastName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Codigo de Estudante: {tcc.author?.studentNumber || "N/A"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email: {tcc.author?.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-500" />
                Supervisor
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {tcc.supervisor?.first_name} {tcc.supervisor?.last_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email: {tcc.supervisor?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Course */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              Curso
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {tcc.course?.name || "N/A"}
              </p>
            </div>
          </div>

          {/* Keywords */}
          {tcc.keywords && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Tag className="h-4 w-4 text-orange-500" />
                Palavras-chave
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {tcc.keywords}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Files */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Arquivos
            </h4>

            {/* Main TCC File */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {tcc.file?.displayName || "Arquivo não disponível"}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Tamanho: {tcc.file ? formatFileSize(tcc.file.size) : "N/A"}</span>
                      <span>Enviado em: {tcc.file ? formatDate(tcc.file.created_at) : "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewMain}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadMain}
                    disabled={downloadingMain}
                    className="gap-2"
                  >
                    {downloadingMain ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {downloadingMain ? "Baixando..." : "Download"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Defense Record File */}
            {tcc.defenseRecordFile && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Ata de Defesa
                      </p>
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        {tcc.defenseRecordFile.displayName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>
                          Tamanho: {formatFileSize(tcc.defenseRecordFile.size)}
                        </span>
                        <span>
                          Enviado em:{" "}
                          {formatDate(tcc.defenseRecordFile.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleViewDefense}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadDefense}
                      disabled={downloadingDefense}
                      className="gap-2"
                    >
                      {downloadingDefense ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {downloadingDefense ? "Baixando..." : "Download"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">Data de criação:</span>
              <p>{formatDate(tcc.createdAt)}</p>
            </div>
            <div>
              <span className="font-medium">Última atualização:</span>
              <p>{formatDate(tcc.updatedAt)}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
          <Button
            type="button"
            onClick={handleDownloadMain}
            disabled={downloadingMain}
            className="gap-2"
          >
            {downloadingMain ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloadingMain ? "Baixando..." : "Download TCC"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
