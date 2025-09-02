"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { EditUserDialog } from "./dialogs/EditUser";
import { EditUserEmail } from "./dialogs/EditEmail";
import { DeleteAccountDialog } from "./dialogs/delete-account";
import { Info } from "./components/Info";
import { Access } from "./components/Access";
import { toast } from "sonner";
import { fetchUser } from "./api";
import { User } from "@/types/index";
import { Loading } from "@/components/Loading";
import { useUserData } from "@/contexts/app-context";
import { Header } from "@/components/header";
import ActivationSwitch from "./components/activation-switch";
import { useLanguage } from "@/contexts/language-content";

export default function UserPage() {
  const [userId, setUserId] = useState<string>("");
  const [isEditUserDialogOpened, setIsEditUserDialogOpened] = useState(false);
  const [isEditEmailDialogOpened, setIsEditEmailDialogOpened] = useState(false);
  const [isDeleteAccountDialogOpened, setIsDeleteAccountDialogOpened] =
    useState(false);
  const account = useUserData()?.user;
  const { t } = useLanguage();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("user-id") as string;
      setUserId(id);
    }
  }, []);
  const [user, setUser] = useState({} as User);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  async function checkPermission() {
    if (account?.is_admin == true) {
      setHasPermission(true);
      return;
    }
  }

  useEffect(() => {
    if (!account?.is_admin) return;

    checkPermission();
  }, [account?.is_admin]);

  const getData = async () => {
    setLoading(true);
    try {
      const [UserData] = await Promise.all([fetchUser(userId)]);
      setUser(UserData);
    } catch (err) {
      console.error("Error getting data:", err);
      toast.error("Ocorreu um error ao carregar os dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    getData();
  }, [userId]);

  return (
    <div className="w-full">
      <Header currentPage="organizations" />

      {loading ? (
        <Loading />
      ) : (
        <div className="flex-1 overflow-auto p-6 ">
          <div className="mb-8 flex gap-2 md:justify-between flex-col md:flex-row md:items-center">
            <h1 className="text-lg font-medium ">
              {t("user-page.data")} {user?.first_name}
            </h1>

            {hasPermission && (
              <div className="flex gap-2 flex-col md:flex-row">
                <Button
                  onClick={() => setIsEditUserDialogOpened(true)}
                  variant="outline"
                  className="rounded-lg active:opacity-[0.6] w-fit "
                >
                  {t("user-page.editData")}
                </Button>

                {account?.is_admin && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsDeleteAccountDialogOpened(true);
                    }}
                    className="rounded-lg active:opacity-[0.6] hover:opacity-[0.8] w-fit"
                  >
                    {t("user-page.deleteAccount")}
                  </Button>
                )}
              </div>
            )}
          </div>

          {user?.email && (
            <>
              <ActivationSwitch
                hasPermission={hasPermission}
                isActive={user?.is_active}
                userId={user?.id}
              />
              <Info user={user} />
              <Access
                openEditEmailDialog={() => {
                  setIsEditEmailDialogOpened(true);
                }}
                hasPermission={hasPermission}
                email={user?.email}
              />
            </>
          )}
        </div>
      )}

      {user?.email && (
        <>
          <EditUserDialog
            open={isEditUserDialogOpened}
            onOpenChange={setIsEditUserDialogOpened}
            user={user}
          />
          <EditUserEmail
            open={isEditEmailDialogOpened}
            onOpenChange={setIsEditEmailDialogOpened}
            user={user}
          />
        </>
      )}

      <DeleteAccountDialog
        open={isDeleteAccountDialogOpened}
        onOpenChange={setIsDeleteAccountDialogOpened}
        user={user}
      />
    </div>
  );
}
