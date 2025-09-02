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

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function EditUserDialog({ open, onOpenChange, user }: IProps) {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name);
  const [lastName, setLastName] = useState(user?.last_name);
  const [phoneNumber, setPhoneNumber] = useState(
    user?.phone_number ? user?.phone_number : ("" as string)
  );
  const [responseMessage, setResponseMessage] = useState("");

  async function handleSubmit() {
    if (loading) return;
    if (!firstName) return;
    if (!lastName) return;
    if (!phoneNumber) return;

    setLoading(true);
    try {
      const url = `/api/users/${user?.id}`;
      const body = {
        id: user?.id,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      };

      const response = await api.put(url, body);

      if (response.status == 200) {
        setResponseMessage("Dados do Operador atulizados com sucesso");

        toast("Dados do Operador atulizados com sucesso", {
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
        toast(error.response?.data?.message, {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
      } else {
        toast("Ocorreu um erro ao atualizar os dados do operador!", {
          description: "Ocorreu um erro ao atualizar os dados do operador!",
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
      }
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-4 sm:px-6 rounded-xl flex flex-col max-h-[85vh] w-[315px] sm:min-w-[450px]  overflow-y-scroll">
        <DialogHeader className="shrink-0 mb-4">
          <DialogTitle className="text-lg font-medium">
            Editar dados
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
            <Label htmlFor="first_name">Primeiro nome</Label>
            <Input
              id="first_name"
              value={firstName}
              required
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="last_name">Último nome</Label>
            <Input
              id="last_name"
              value={lastName}
              required
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              required
              type="number"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
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
            {loading ? <PulseLoader color="white" size={10} /> : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
