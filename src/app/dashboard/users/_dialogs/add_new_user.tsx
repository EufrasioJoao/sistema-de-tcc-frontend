"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { User } from "@/types/index";
import { api } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRoles } from "@/types/index";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addNewUser: (user: User) => void;
}

export function AddNewUserDialog({ open, onOpenChange, addNewUser }: IProps) {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<UserRoles | "">("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  async function handleSubmit() {
    if (loading) return;
    if (!firstName || !lastName || !email || !phoneNumber || !role) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    setShowSuccessMessage(false);

    try {
      const url = `/api/users/register`;
      const body = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        role: role,
      };

      const response = await api.post(url, body);

      if (response.status === 201) {
        const user = response.data?.user as User;

        addNewUser(user);
        setShowSuccessMessage(true);

        // Reset form fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setRole("");

        toast.success("Usuário criado com sucesso!", {
          description:
            "Uma senha temporária foi enviada para o e-mail do usuário.",
        });
      } else {
        toast.error(response.data?.message || "Erro ao criar operador!", {
          description: "Verifique os dados e tente novamente.",
          style: {
            backgroundColor: "#f8d7da",
            color: "#721c24",
          },
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error);
        const displayMessage =
          error?.response?.data?.message ||
          "Ocorreu um erro ao criar o usuário!";

        setShowSuccessMessage(false);
        toast.error(displayMessage, {
          description: "Ocorreu um erro.",
          style: {
            backgroundColor: "#f8d7da",
            color: "#721c24",
          },
        });
      }
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-4 sm:px-6 rounded-xl flex flex-col max-h-[90vh] w-[315px] sm:min-w-[450px]  overflow-y-scroll">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-lg font-medium">
            Adicionar Novo Usuário
          </DialogTitle>
          <DialogDescription sr-only={true}></DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <Label htmlFor="first_name">Primeiro Nome</Label>
            <Input
              id="first_name"
              value={firstName}
              required
              onChange={(event) => setFirstName(event.target.value)}
              className="border rounded-md p-2"
              placeholder="Digite o primeiro nome"
            />
          </div>

          <div>
            <Label htmlFor="last_name">Último Nome</Label>
            <Input
              id="last_name"
              value={lastName}
              required
              onChange={(event) => setLastName(event.target.value)}
              className="border rounded-md p-2"
              placeholder="Digite o último nome"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              type="email"
              required
              onChange={(event) => setEmail(event.target.value)}
              className="border rounded-md p-2"
              placeholder="Digite o email"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              required
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              className="border rounded-md p-2"
              placeholder="Digite o telefone"
            />
          </div>

          <div>
            <Label htmlFor="role">Perfil</Label>
            <Select
              required
              value={role}
              onValueChange={(value) => setRole(value as UserRoles)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRoles.ADMIN}>Administrador</SelectItem>
                <SelectItem value={UserRoles.SISTEM_MANAGER}>
                  Gestor do Sistema
                </SelectItem>
                <SelectItem value={UserRoles.COURSE_COORDENATOR}>
                  Coordenador de Curso
                </SelectItem>
                <SelectItem value={UserRoles.ACADEMIC_REGISTER}>
                  Registo Acadêmico
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showSuccessMessage && (
            <div className="mt-4 w-full bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-lg">
              <span className="font-semibold">Usuário criado com sucesso!</span>
              <p>
                Uma senha de acesso temporária foi enviada para o e-mail
                cadastrado.
              </p>
            </div>
          )}

          <Button
            type="submit"
            variant="destructive"
            className="w-full rounded-lg active:opacity-[0.6] mt-4 text-white"
          >
            {loading ? (
              <PulseLoader color="white" size={10} />
            ) : (
              "Criar Usuário"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
