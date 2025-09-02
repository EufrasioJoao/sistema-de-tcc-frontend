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
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { User } from "@/types/index";
import { api } from "@/lib/api";
import { PulseLoader } from "react-spinners";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function EditUserPassword({ open, onOpenChange, user }: IProps) {
  const [loading, setLoading] = useState(false);
  const [OldPassword, setOldPassword] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  async function handleSubmit() {
    if (loading) return;
    if (!OldPassword) return;
    if (!NewPassword) return;

    setLoading(true);
    try {
      const url = `/api/users/${user?.id}`;
      const body = {
        id: Number(user?.id),
        old_password: OldPassword,
        new_password: NewPassword,
      };

      const response = await api.put(url, body);

      if (response.status == 200) {
        setResponseMessage("Palavra passe atulizada com sucesso");

        toast("Palavra passe atulizada com sucesso", {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
      } else {
        toast(response.data?.message, {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const text = error?.response?.data?.message || "Ocorreu um erro.";
        console.error(error);

        setResponseMessage(text);
        toast(text, {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
      } else {
        console.error(error);
      }
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="shrink-0 mb-2">
          <DialogTitle className="text-lg font-medium">
            Editar senha
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="old_password" className="mb-2">
              Senha antiga
            </Label>
            <Input
              value={OldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              id="old_password"
              type="password"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-2">
              Nova senha
            </Label>
            <Input
              required
              value={NewPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              id="password"
              type="password"
            />
          </div>

          {responseMessage && (
            <div className="mt-4 w-full bg-secondary px-3 py-2 rounded-lg ">
              <span className="font-semibold">Resposta do servidor:</span>
              <p className="truncate">
                <span className="text-primary text-lg">{responseMessage}</span>
              </p>
            </div>
          )}

          <div className="mt-16" />
          <Button
            variant="destructive"
            className="w-full rounded-l active:opacity-[0.6]"
          >
            {loading ? <PulseLoader color="white" size={10} /> : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
