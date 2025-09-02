"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language-content";

interface Props {
  organizationId: number | undefined;
  isActive: boolean;
}

export default function ActivationSwitch({ organizationId, isActive }: Props) {
  const [isChecked, setIsChecked] = useState(isActive);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const toggleAccountStatus = async () => {
    setLoading(true);

    try {
      const url = `/api/entities/${organizationId}/${
        !isChecked ? "activate" : "deactivate"
      }`;
      const response = await api.put(url);

      if (response.status == 200) {
        setIsChecked((prev) => !prev);
        toast.success(
          `Conta do cliente ${
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
    <div className="flex items-center gap-2">
      <Switch
        checked={isChecked}
        onCheckedChange={toggleAccountStatus}
        disabled={loading}
      />
      <span className="text-sm text-gray-700">
        {isChecked
          ? t("employyes-page.activated")
          : t("employyes-page.deactivated")}
      </span>
    </div>
  );
}
