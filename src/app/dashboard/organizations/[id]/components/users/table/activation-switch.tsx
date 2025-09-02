"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Props {
  userId: number | undefined;
  isActive: boolean;
}

export default function ActivationSwitch({ userId, isActive }: Props) {
  const [isChecked, setIsChecked] = useState(isActive);
  const [loading, setLoading] = useState(false);

  const toggleAccountStatus = async () => {
    setLoading(true);

    try {
      const url = `/api/users/${userId}/${
        !isChecked ? "activate" : "deactivate"
      }`;
      const response = await api.put(url);

      if (response.status == 200) {
        setIsChecked((prev) => !prev);
        toast.success(
          `Conta do usuario ${
            !isChecked ? "ativada" : "desativada"
          } com sucesso!`
        );
        location.reload();
      }
    } catch (error) {
      toast.error(
        "Ocorreu um erro ao atualizar o estado da conta, Tente novamente!"
      );
      console.error("Error updating account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={toggleAccountStatus}
      disabled={loading}
    />
  );
}
