"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { TCC } from "@/types/index";

// Using imported TCC type instead of local interface

interface DeleteTCCDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tcc: TCC;
  onTCCDeleted: () => void;
}

const typeLabels = {
  BACHELOR: "Monografia",
  MASTER: "Dissertação",
  DOCTORATE: "Tese",
};

export function DeleteTCCDialog({ open, onOpenChange, tcc, onTCCDeleted }: DeleteTCCDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await api.delete(`/api/tccs/${tcc?.id}`);

      if (response.data.success) {
        toast.success("TCC removido com sucesso!");
        onTCCDeleted();
        onOpenChange(false);
      } else {
        toast.error(response.data.message || "Erro ao remover TCC");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao remover TCC");
      console.error("Error deleting TCC:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto  sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O TCC será removido permanentemente do sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              TCC a ser removido:
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Título:</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1">{tcc?.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Tipo:</span>
                  <p className="text-gray-700 dark:text-gray-300">{typeLabels[tcc?.type]}</p>
                </div>
                <div>
                  <span className="font-medium">Ano:</span>
                  <p className="text-gray-700 dark:text-gray-300">{tcc?.year}</p>
                </div>
              </div>
              <div>
                <span className="font-medium">Autor:</span>
                <p className="text-gray-700 dark:text-gray-300">
                  {tcc?.author?.firstName} {tcc?.author?.lastName}
                </p>
              </div>
              <div>
                <span className="font-medium">Supervisor:</span>
                <p className="text-gray-700 dark:text-gray-300">
                  {tcc?.supervisor?.first_name} {tcc?.supervisor?.last_name}
                </p>
              </div>
              <div>
                <span className="font-medium">Curso:</span>
                <p className="text-gray-700 dark:text-gray-300">{tcc?.course?.name}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Removendo..." : "Confirmar Exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
