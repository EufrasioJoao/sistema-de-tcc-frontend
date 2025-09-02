"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { User } from "@/types/index";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { useLanguage } from "@/contexts/language-content";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function DeleteAccountDialog({ open, onOpenChange, user }: IProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const [responseMessage, setResponseMessage] = useState("");

  async function deleteUser() {
    if (!user?.id) return;
    if (loading) return;
    setLoading(true);

    try {
      const url = `/api/users/${user?.id}`;

      const response = await api.delete(url);

      if (response.status == 200) {
        setResponseMessage("usuario deletado com sucesso");
        toast("usuario deletado com sucesso", {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });

        router.back();
      } else {
        setResponseMessage(response.data?.message);
        toast(response.data?.message, {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error);
        toast(
          error.response?.data?.message ||
            "Ocorreu um erro ao deletar o usuario!",
          {
            description: "Ocorreu um erro ao Deletar o usuario!",
            action: {
              label: "Ok",
              onClick: () => {},
            },
          }
        );
      }
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-4 sm:px-6 rounded-xl flex flex-col max-h-[85vh] w-[315px] sm:min-w-[450px]  overflow-y-scroll">
        <DialogHeader className="shrink-0 mb-4">
          <DialogTitle className="text-lg font-medium">
            {t("user-page.deleteUser")}
          </DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            deleteUser();
          }}
        >
          <p className="text-l mb-2 font-medium">
            {t("user-page.confirmDelete")}
          </p>
          <p>{t("user-page.deleteWarning")}</p>

          {responseMessage && (
            <div className="mt-4 w-full bg-secondary px-3 py-2 rounded-lg ">
              <span className="font-semibold">Resposta do servidor</span>
              <p>
                <span className="text-primary text-lg">{responseMessage}</span>
              </p>
            </div>
          )}

          <Button
            type="submit"
            variant="destructive"
            className="w-full rounded-lg active:opacity-[0.6] mt-4"
          >
            {loading ? (
              <PulseLoader color="white" size={10} />
            ) : (
              t("user-page.delete")
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
