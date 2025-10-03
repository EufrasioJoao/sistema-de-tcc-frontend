"use client";

import { DataTableDemo } from "./_components/table";
import { Button } from "@/components/ui/button";
import { AddNewUserDialog } from "./_dialogs/add_new_user";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cards } from "./_components/Cards";
import { Charts } from "./_components/Charts";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { Loading } from "@/components/Loading";
import { User, UserRoles } from "@/types/index";
import { UserStats } from "./_components/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useUserData } from "@/contexts/app-context";
import { useDebounce } from "@/hooks/useDebounce";

export default function UsersPage() {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { user } = useUserData();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  async function getUsers(page = 1, search = "", role = "", status = "") {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(role && { role }),
        ...(status && { status }),
      });

      const url = `/api/users?${params}`;
      const response = await api(url);

      if (response.status == 200) {
        setUsers(response.data?.users || []);
        setStats(response.data?.stats || null);
        setPagination(response.data?.pagination || pagination);
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
    getUsers(1, debouncedSearchTerm, roleFilter, statusFilter);
  }, [debouncedSearchTerm, roleFilter, statusFilter]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <motion.div
          className="mx-auto py-6 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full pb-6 border-b border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Gerenciamento de Usuários
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Gerencie usuários e permissões do sistema
                </p>
              </div>
              {user?.role == UserRoles.ADMIN && (
                <Button
                  onClick={() => setIsDialogOpened(true)}
                  size="sm"
                  className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Usuário
                </Button>
              )}
            </div>
          </motion.div>

          {stats && <Cards stats={stats} />}
          {stats && (
            <Charts
              barChartData={stats.barChartData}
              areaChartData={stats.areaChartData}
            />
          )}
          <DataTableDemo
            router={router}
            users={users}
            pagination={pagination}
            onPageChange={(page) => getUsers(page, searchTerm, roleFilter, statusFilter)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          <AddNewUserDialog
            open={isDialogOpened}
            onOpenChange={setIsDialogOpened}
            addNewUser={addNewUser}
          />
        </motion.div>
      )}
    </>
  );
}
