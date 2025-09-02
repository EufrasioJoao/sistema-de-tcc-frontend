"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language-content";

interface Props {
  userId: number | undefined;
  isActive: boolean;
  hasPermission: boolean;
}

export default function ActivationSwitch({
  userId,
  isActive,
  hasPermission,
}: Props) {
  const [isChecked, setIsChecked] = useState(isActive);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

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
    <div className="w-full p-4 mt-4 mb-4 rounded-xl bg-white border shadow-sm space-y-4 ">
      <h1 className="block font-semibold text-[0.9rem]">
        {t("employee-page.accountStatus")}
      </h1>

      <div className="bg-[#eee] w-full p-2 px-3 rounded mt-2 bg-secondary text-sm flex items-center justify-between">
        {isChecked ? "Conta Ativada" : "Conta Desativada"}
        {hasPermission && (
          <Switch
            checked={isChecked}
            onCheckedChange={toggleAccountStatus}
            disabled={loading}
          />
        )}
      </div>
    </div>
  );
}
