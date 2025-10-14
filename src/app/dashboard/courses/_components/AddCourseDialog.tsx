"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, GraduationCap, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddCourseDialog({ open, onOpenChange, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [coordinatorId, setCoordinatorId] = useState("");
  const [coordinators, setCoordinators] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCoordinators, setLoadingCoordinators] = useState(false);

  // Fetch potential coordinators when dialog opens
  useEffect(() => {
    if (open) {
      fetchCoordinators();
    }
  }, [open]);

  const fetchCoordinators = async () => {
    try {
      setLoadingCoordinators(true);
      const response = await api.get("/api/users/coordinators");
      if (response.data.success) {
        setCoordinators(response.data.coordinators);
      }
    } catch (error) {
      toast.error("Erro ao carregar coordenadores");
    } finally {
      setLoadingCoordinators(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nome do curso é obrigatório");
      return;
    }

    if (!coordinatorId || coordinatorId === "none") {
      toast.error("Coordenador é obrigatório");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/courses", {
        name: name.trim(),
        coordinatorId: coordinatorId,
      });

      if (response.data.success) {
        toast.success("Curso criado com sucesso!", {
          icon: <GraduationCap className="h-4 w-4 text-green-600" />,
        });
        onSuccess();
        handleClose();
      }
    } catch (error) {
      toast.error("Erro ao criar curso. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setCoordinatorId("");
    onOpenChange(false);
  };

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
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Adicionar Novo Curso
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Preencha as informações para criar um novo curso
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome do Curso *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ciência da Computação"
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="coordinator" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Coordenador *
              </Label>
              <Select value={coordinatorId} onValueChange={setCoordinatorId}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder={
                    loadingCoordinators
                      ? "Carregando coordenadores..."
                      : "Selecione um coordenador"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {coordinators.map((coordinator) => (
                    <SelectItem key={coordinator.id} value={coordinator.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {coordinator.first_name.charAt(0)}{coordinator.last_name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {coordinator.first_name} {coordinator.last_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {coordinator.email}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loadingCoordinators && (
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Carregando coordenadores...</span>
                </div>
              )}
            </motion.div>

            <DialogFooter className="flex items-center space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="border-gray-200 dark:border-gray-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !name.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Criar Curso
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
