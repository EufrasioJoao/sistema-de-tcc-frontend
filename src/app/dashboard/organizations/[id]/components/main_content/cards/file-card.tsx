"use client";

import {
  AccessLevel,
  File,
  FileExpirationAlert,
  type Permission,
} from "@/types/index";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ImageIcon,
  Video,
  Music,
  Table,
  FileArchive,
  Trash2,
  Download,
  Eye,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  format,
  isBefore,
  parseISO,
  differenceInDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { api } from "@/lib/api";
import { PulseLoader } from "react-spinners";
import { useState, useEffect } from "react";
import { useUserData } from "@/contexts/app-context";
import { useFolder } from "@/contexts/folder-context";
import { Checkbox } from "@/components/ui/checkbox";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FileCardProps {
  file: File;
  onClick: () => void;
  onDelete: () => void;
  view: "list" | "grid";
  permission: Permission | null;
}

export function FileCard({
  file,
  onClick,
  onDelete,
  view,
  permission,
}: FileCardProps) {
  const { selectedFileIds, handleSelectFile } = useFolder();
  const isSelected = selectedFileIds.includes(file.id);
  const { user } = useUserData();

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [expirationAlert, setExpirationAlert] =
    useState<FileExpirationAlert | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [expirationDescription, setExpirationDescription] = useState("");
  const [savingExpiration, setSavingExpiration] = useState(false);

  useEffect(() => {
    if (file.expiration_alerts && file.expiration_alerts.length > 0) {
      const alert = file.expiration_alerts[0];
      setExpirationAlert(alert);

      if (alert.expirationDate) {
        setExpirationDate(alert.expirationDate.split("T")[0]);
      }
      setExpirationDescription(alert.description || "");
    } else {
      setExpirationAlert(null);
      setExpirationDate("");
      setExpirationDescription("");
    }
  }, [file.id, file.expiration_alerts]);

  const fetchExpirationAlert = async () => {
    try {
      const response = await api.get(
        `/api/expiration-alerts/${file.id}/get-by-file`
      );
      if (response.data?.success && response.data?.alert) {
        setExpirationAlert(response.data.alert);
        if (response.data.alert.expirationDate) {
          setExpirationDate(response.data.alert.expirationDate.split("T")[0]);
        }
        setExpirationDescription(response.data.alert.description || "");
      } else {
        setExpirationAlert(null);
        setExpirationDate("");
        setExpirationDescription("");
      }
    } catch (error) {
      console.error("Error fetching expiration alert:", error);
      setExpirationAlert(null);
    }
  };

  const handleSaveExpiration = async () => {
    if (!expirationDate) {
      toast.error("Por favor, selecione uma data de expiração");
      return;
    }

    setSavingExpiration(true);
    try {
      if (expirationAlert) {
        // Update existing alert
        await api.put(`/api/expiration-alerts/${expirationAlert.id}/update`, {
          description: expirationDescription,
          expirationDate: expirationDate,
          status: "active",
        });
        toast.success("Alerta de expiração atualizado com sucesso");
      } else {
        // Create new alert
        await api.post("/api/expiration-alerts/create", {
          documentId: file.id,
          description: expirationDescription,
          expirationDate: expirationDate,
        });
        toast.success("Alerta de expiração criado com sucesso");
      }
      setDialogOpen(false);
      fetchExpirationAlert();
    } catch (error) {
      console.error("Error managing expiration alert:", error);
      toast.error("Erro ao gerenciar alerta de expiração");
    } finally {
      setSavingExpiration(false);
    }
  };

  const handleDeleteExpiration = async () => {
    if (!expirationAlert) return;

    setSavingExpiration(true);
    try {
      await api.delete(`/api/expiration-alerts/${expirationAlert.id}/destroy`);
      toast.success("Alerta de expiração removido com sucesso");
      setDialogOpen(false);
      setExpirationAlert(null);
      setExpirationDate("");
      setExpirationDescription("");
    } catch (error) {
      console.error("Error deleting expiration alert:", error);
      toast.error("Erro ao remover alerta de expiração");
    } finally {
      setSavingExpiration(false);
    }
  };

  const getExpirationStatus = () => {
    if (!expirationAlert?.expirationDate) return null;

    try {
      const today = new Date();
      const expirationDate = parseISO(expirationAlert.expirationDate);
      const daysUntilExpiration = differenceInDays(expirationDate, today);

      if (isBefore(expirationDate, today)) {
        return {
          type: "expired",
          message: "Documento expirado",
          color: "text-red-500",
          bgColor: "bg-red-100",
        };
      }

      if (daysUntilExpiration <= 7) {
        return {
          type: "warning",
          message: `Expira em ${daysUntilExpiration} dias`,
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
        };
      }

      return {
        type: "active",
        message: `Expira em ${daysUntilExpiration} dias`,
        color: "text-green-500",
        bgColor: "bg-green-100",
      };
    } catch (error) {
      console.error("Error calculating expiration status:", error);
      return null;
    }
  };

  function formatDateInPortuguese(date: Date | string): string {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return format(parsedDate, "dd 'de' MMMM 'de' yyyy, HH:mm", {
      locale: ptBR,
    });
  }

  const getFileIcon = (type: string = "") => {
    if (type.includes("pdf")) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    if (type.includes("spreadsheet") || type.includes("excel")) {
      return <Table className="h-8 w-8 text-emerald-500" />;
    }
    if (type.includes("document") || type.includes("word")) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    }
  };

  const downloadFile = async (fileId: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.get(`/api/files/download/${fileId}`, {
        responseType: "blob", // Ensure the response is treated as a binary blob
      });

      const filename = file?.displayName;

      // Create a blob and trigger the download
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename; // Dynamically set the filename here
      link.click();

      // Cleanup the object URL
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading the file:", error);
      if (error instanceof AxiosError) {
        const text =
          error?.response?.data?.message ||
          "Ocorreu um erro ao fazer download!";
        toast.error(text);
      }
    } finally {
      setLoading(false);
    }
  };

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.floor(Math.log10(bytes) / 3); // Determine the unit index
    const size = bytes / Math.pow(1024, index); // Convert to the appropriate unit
    return `${size.toFixed(2)} ${units[index]}`;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        `flex flex-wrap justify-between ${
          view === "grid" ? "flex-col" : "flex-row"
        } items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 cursor-pointer group relative`,
        isSelected && "bg-blue-100 dark:bg-blue-900/30"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => handleSelectFile(file.id)}
          onClick={(e) => e.stopPropagation()}
        />
        {getFileIcon(file.type as string)}
      </div>
      <div
        className={`flex-1 ${
          view === "grid" && "w-full text-center"
        } overflow-hidden`}
      >
        <div
          className="w-full max-w-full overflow-hidden"
          onClick={(e) => {
            e.stopPropagation(); // prevent card click from triggering
            router.push(`/file/${file?.id}?name=${file?.displayName}`);
          }}
        >
          <p
            className={`font-medium text-sm truncate ${
              view === "grid" && "text-center"
            } `}
          >
            {file.displayName}
          </p>
          <div
            className={`flex flex-col ${
              view === "grid" ? "items-center" : "items-start"
            }`}
          >
            <p
              className={`text-xs text-muted-foreground ${
                view === "grid" && " text-center"
              } truncate`}
            >
              {formatFileSize(Number(file.size))} •{" "}
              {formatDateInPortuguese(file.created_at)}
            </p>
            {expirationAlert?.expirationDate && getExpirationStatus() && (
              <div className="flex items-center gap-2 mt-2">
                {expirationAlert?.expirationDate && getExpirationStatus() && (
                  <div
                    className={cn(
                      "p-1 rounded-full flex items-center justify-center cursor-pointer",
                      getExpirationStatus()?.bgColor,
                      getExpirationStatus()?.color
                    )}
                  >
                    <AlertTriangle className="h-3 w-3" />
                  </div>
                )}
                <p
                  className={cn(
                    "text-xs font-semibold",
                    getExpirationStatus()?.color
                  )}
                >
                  {getExpirationStatus()?.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-1">
        {(user?.is_admin ||
          permission?.accessLevel === AccessLevel.VIEW_DOWNLOAD ||
          permission?.accessLevel === AccessLevel.UPLOAD ||
          permission?.accessLevel === AccessLevel.MANAGE) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              downloadFile(file?.id);
            }}
          >
            {loading ? (
              <PulseLoader color="black" size={6} />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        )}

        {(user?.is_admin || permission?.accessLevel === AccessLevel.MANAGE) && (
          <>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDialogOpen(true);
                  }}
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-[425px]"
                onClick={(e) => e.stopPropagation()}
              >
                <DialogHeader>
                  <DialogTitle>
                    {expirationAlert ? "Editar Alerta" : "Criar Alerta"}
                  </DialogTitle>
                  <DialogDescription>
                    {expirationAlert
                      ? "Atualize as informações do alerta de expiração"
                      : "Configure um alerta de expiração para este documento"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={expirationDescription}
                      onChange={(e) => setExpirationDescription(e.target.value)}
                      placeholder="Descreva o motivo do alerta..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Data de Expiração</Label>
                    <Input
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      className="w-full cursor-pointer"
                      onClick={(e) => {
                        e.currentTarget.showPicker();
                      }}
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-between">
                  {expirationAlert && (
                    <Button
                      variant="destructive"
                      onClick={handleDeleteExpiration}
                      disabled={savingExpiration}
                    >
                      Remover Alerta
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveExpiration}
                      disabled={savingExpiration}
                    >
                      {savingExpiration ? (
                        <PulseLoader color="white" size={8} />
                      ) : expirationAlert ? (
                        "Atualizar"
                      ) : (
                        "Criar"
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}

        {(user?.is_admin ||
          (permission && permission.accessLevel !== AccessLevel.NO_ACCESS)) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/file/${file?.id}?name=${file?.displayName}`);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
