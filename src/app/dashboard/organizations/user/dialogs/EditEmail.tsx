"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { User } from "@/types/index";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { useLanguage } from "@/contexts/language-content";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function EditUserEmail({ open, onOpenChange, user }: IProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(user?.email);
  const [responseMessage, setResponseMessage] = useState("");
  const { t } = useLanguage();

  async function handleSubmit() {
    if (loading) return;
    if (!email) return;

    setLoading(true);
    try {
      const url = `/api/users/${user?.id}`;
      const body = {
        id: user?.id,
        email,
      } as User;

      const response = await api.put(url, body);

      if (response.status == 200) {
        setResponseMessage("Dados do usuario atulizados com sucesso");

        toast("Dados do usuario atulizados com sucesso", {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });

        location.reload();
      } else {
        toast(response.data?.message, {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof AxiosError) {
        const text = error?.response?.data?.message || "Ocorreu um erro!";
        setResponseMessage(text);
        toast.error(text);
      }
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-4 sm:px-6 rounded-xl flex flex-col max-h-[85vh] w-[315px] sm:min-w-[450px]  overflow-y-scroll">
        <DialogHeader className="shrink-0 mb-4">
          <DialogTitle className="text-lg font-medium">
            {t("user-page.editEmail")}
          </DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <Label htmlFor="email">{t("user-page.newEmail")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {responseMessage && (
            <div className="mt-4 w-full bg-secondary px-3 py-2 rounded-lg ">
              <span className="font-semibold">Resposta do servidor:</span>
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
              t("user-page.save")
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
