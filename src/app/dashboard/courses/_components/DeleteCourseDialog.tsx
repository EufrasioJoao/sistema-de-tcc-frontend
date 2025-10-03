"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface Course {
  id: string;
  name: string;
  coordinatorId: string | null;
  createdAt: string;
  updatedAt: string;
  coordinator: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  _count: {
    students: number;
    tccs: number;
  };
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  course: Course | null;
}

export function DeleteCourseDialog({
  open,
  onOpenChange,
  onSuccess,
  course,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!course) {
      toast.error("Curso não encontrado");
      return;
    }

    try {
      setLoading(true);
      const response = await api.delete(`/api/courses/${course.id}`);

      if (response.data.success) {
        toast.success("Curso excluído com sucesso!", {
          icon: <Trash2 className="h-4 w-4 text-green-600" />,
        });
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Erro ao excluir curso. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  const hasStudentsOrTccs =
    course &&
    course._count &&
    (course._count.students > 0 || course._count.tccs > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto  sm:mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Excluir Curso
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Esta ação não pode ser desfeita
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="py-4"
          >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Tem certeza que deseja excluir o curso "{course?.name}"?
                  </p>

                  {hasStudentsOrTccs && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-3">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-amber-800 dark:text-amber-200">
                          <p className="font-medium mb-1">Atenção:</p>
                          <ul className="space-y-1">
                            {course?._count?.students &&
                              course._count.students > 0 && (
                                <li>
                                  • {course._count.students} estudante(s)
                                  vinculado(s)
                                </li>
                              )}
                            {course?._count?.tccs && course._count.tccs > 0 && (
                              <li>
                                • {course._count.tccs} TCC(s) vinculado(s)
                              </li>
                            )}
                          </ul>
                          <p className="mt-2 text-amber-700 dark:text-amber-300">
                            O curso será marcado como excluído, mas os dados
                            relacionados serão preservados.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-red-600 dark:text-red-400">
                    O curso será removido da listagem, mas os dados serão
                    preservados no sistema.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <DialogFooter className="flex items-center space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-gray-200 dark:border-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Curso
                </>
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
