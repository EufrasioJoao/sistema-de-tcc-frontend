"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useUserData } from "@/contexts/app-context";
import { motion } from "framer-motion";
import { Loader2, Shield, ShieldCheck, ShieldX } from "lucide-react";

interface Props {
  userId: string;
  isActive: boolean;
}

export default function ActivationSwitch({ userId, isActive }: Props) {
  const [isChecked, setIsChecked] = useState(isActive);
  const [loading, setLoading] = useState(false);
  const { user } = useUserData();

  const toggleAccountStatus = async () => {
    if (user?.id == userId) {
      toast.warning(`Você não pode desativar a sua própria conta!`, {
        icon: <ShieldX className="h-4 w-4" />,
      });
      return;
    }
    setLoading(true);

    try {
      const url = `/api/users/${userId}/${
        !isChecked ? "activate" : "deactivate"
      }`;
      const response = await api.put(url);

      if (response.status == 200) {
        setIsChecked((prev) => !prev);
        toast.success(
          `Conta do operador ${
            !isChecked ? "ativada" : "desativada"
          } com sucesso!`,
          {
            icon: !isChecked ? (
              <ShieldCheck className="h-4 w-4 text-green-600" />
            ) : (
              <Shield className="h-4 w-4 text-orange-600" />
            ),
          }
        );
        location.reload();
      }
    } catch (error) {
      toast.error(
        "Ocorreu um erro ao atualizar o estado da conta. Tente novamente!",
        {
          icon: <ShieldX className="h-4 w-4 text-red-600" />,
        }
      );
      console.error("Error updating account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-full z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
          </motion.div>
        )}
        
        <Switch
          checked={isChecked}
          onCheckedChange={toggleAccountStatus}
          disabled={loading}
          className={`
            data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500
            data-[state=unchecked]:bg-gradient-to-r data-[state=unchecked]:from-gray-300 data-[state=unchecked]:to-gray-400
            dark:data-[state=unchecked]:from-gray-600 dark:data-[state=unchecked]:to-gray-700
            shadow-lg transition-all duration-300 ease-in-out
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
            ${isChecked ? 'ring-2 ring-green-200 dark:ring-green-800' : 'ring-2 ring-gray-200 dark:ring-gray-700'}
          `}
        />
      </motion.div>
      
      {/* Status Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center"
      >
        {loading ? (
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Atualizando...</span>
          </div>
        ) : (
          <motion.div
            key={isChecked ? 'active' : 'inactive'}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center space-x-1 text-xs font-medium ${
              isChecked 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {isChecked ? (
              <>
                <ShieldCheck className="h-3 w-3" />
                <span>Ativo</span>
              </>
            ) : (
              <>
                <Shield className="h-3 w-3" />
                <span>Inativo</span>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
