"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  course: {
    name: string;
  };
  _count: {
    tccs: number;
  };
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  onStudentDeleted: () => void;
}

export function DeleteStudentDialog({
  open,
  onOpenChange,
  student,
  onStudentDeleted,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await api.delete(`/api/students/${student.id}`);

      if (response.data.success) {
        onStudentDeleted();
        onOpenChange(false);
      } else {
        toast.error(response.data.message || "Erro ao remover estudante");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Erro ao remover estudante";
      toast.error(errorMessage);
      console.error("Error deleting student:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-red-600">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white">
                <Trash2 className="h-4 w-4" />
              </div>
              Remover Estudante
            </DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O estudante será removido
              permanentemente do sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Você está prestes a remover:
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      <strong>Nome:</strong> {student.firstName}{" "}
                      {student.lastName}
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      <strong>Email:</strong> {student.email}
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      <strong>Codigo de Estudante:</strong>{" "}
                      {student.studentNumber}
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      <strong>Curso:</strong> {student.course.name}
                    </p>
                    {student._count.tccs > 0 && (
                      <p className="text-sm text-red-700 dark:text-red-300">
                        <strong>TCCs:</strong> {student._count.tccs} trabalho(s)
                        associado(s)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {student._count.tccs > 0 && (
              <div className="mt-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Atenção!
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Este estudante possui {student._count.tccs} TCC(s)
                      associado(s). Remover o estudante também removerá todos os
                      trabalhos relacionados.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3">
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
              className="gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Removendo..." : "Confirmar Remoção"}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
