"use client";

import { motion } from "framer-motion";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { EditUserDialog } from "./dialogs/edit_info";
import { EditUserEmail } from "./dialogs/edit_email";
import { EditUserPassword } from "./dialogs/edit_password";

import { Info } from "./components/Info";
import { Access } from "./components/Access";
import { User2, Settings2, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { User } from "@/types/index";
import { useUserData } from "@/contexts/app-context";
import { Loading } from "@/components/Loading";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Header from "@/components/dashboard/Header";

export default function AccountPage() {
  const [isEditUserDialogOpened, setIsEditUserDialogOpened] = useState(false);
  const [isEditEmailDialogOpened, setIsEditEmailDialogOpened] = useState(false);
  const [isEditPasswordDialogOpened, setIsEditPasswordDialogOpened] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUser] = useState<User | null>(null);
  const { user } = useUserData();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserData = async () => {
      setLoading(true);

      try {
        const url = `/api/users/${user?.id}`;

        const response = await api(url);

        if (response.status === 200) {
          const data = response.data?.operator as User;
          setUser(data);
        }
      } catch (error) {
        console.error("Error getting data:", error);
        toast.error(
          "Ocorreu um error ao carregar os dados, tente novamente mais tarde"
        );
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user?.id]);

  return (
    <div className="py-6 w-full">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="flex items-center justify-between pb-4 w-full">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Conta</h1>
            <p className="text-muted-foreground">
              Monitore e analisesua conta
            </p>
          </div>
          <Shield className="h-8 w-8 text-primary" />
        </div>
      </motion.div>

      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-5">
          <Button
            onClick={() => setIsEditUserDialogOpened(true)}
            variant="outline"
            className="gap-2 text-[0.8rem]"
          >
            <Settings2 className="h-4 w-4" />
            Editar Perfil
          </Button>

          <Separator />

          <div className="grid gap-6">
            <div className="rounded-lg md:border bg-card">
              <div className="p-0 md:p-6">
                <h3 className="text-[1rem] md:text-lg font-medium mb-4">
                  Informações Pessoais
                </h3>
                <Info user={userData} />
              </div>
            </div>

            <div className="rounded-lg md:border bg-card">
              <div className="p-0 md:p-6">
                <h3 className="text-[1rem] md:text-lg font-medium mb-4">
                  Segurança e Acesso
                </h3>
                <Access
                  openEditEmailDialog={() => setIsEditEmailDialogOpened(true)}
                  openEditPasswordDialog={() =>
                    setIsEditPasswordDialogOpened(true)
                  }
                  email={user?.email}
                />
              </div>
            </div>
          </div>

          <EditUserDialog
            open={isEditUserDialogOpened}
            onOpenChange={setIsEditUserDialogOpened}
            user={userData}
          />
          <EditUserEmail
            open={isEditEmailDialogOpened}
            onOpenChange={setIsEditEmailDialogOpened}
            user={userData}
          />
          <EditUserPassword
            user={userData}
            open={isEditPasswordDialogOpened}
            onOpenChange={setIsEditPasswordDialogOpened}
          />
        </div>
      )}
    </div>
  );
}
