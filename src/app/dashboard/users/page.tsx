"use client";

import { DataTableDemo } from "./_components/table";
import { Button } from "@/components/ui/button";
import { AddNewUserDialog } from "./_dialogs/add_new_user";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cards } from "./_components/Cards";
import { Charts } from "./_components/Charts";

import { Loading } from "@/components/Loading";
import { User, UserRoles } from "@/types/index";
import { UserStats } from "./_components/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useUserData } from "@/contexts/app-context";

export default function UsersPage() {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const { user } = useUserData();

  async function getUsers() {
    setLoading(true);

    try {
      const url = `/api/users`;

      const response = await api(url);

      if (response.status == 200) {
        setUsers(response.data?.users || []);
        setStats(response.data?.stats || null);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error getting data:", error);
      toast.error("Ocorreu um error ao carregar os dados");
    }

    setLoading(false);
  }

  async function addNewUser(newUser: User) {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  }

  function countAdmins(userList: User[]): number {
    return userList.filter((u) => u.role === UserRoles.ADMIN).length;
  }

  function countNonAdmins(userList: User[]): number {
    return userList.filter((u) => u.role !== UserRoles.ADMIN).length;
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex-1  p-6 mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-lg font-medium ">Gerenciamento de Usuários</h1>
            {user?.role == UserRoles.ADMIN && (
              <Button
                onClick={() => setIsDialogOpened(true)}
                variant="default"
                className="rounded-lg active:opacity-[0.6]"
              >
                Adicionar Usuário +
              </Button>
            )}
          </div>

          {stats && <Cards stats={stats} />}
          {stats && (
            <Charts
              barChartData={stats.barChartData}
              lineChartData={stats.lineChartData}
            />
          )}
          <DataTableDemo router={router} users={users} />

          <AddNewUserDialog
            open={isDialogOpened}
            onOpenChange={setIsDialogOpened}
            addNewUser={addNewUser}
          />
        </div>
      )}
    </>
  );
}
