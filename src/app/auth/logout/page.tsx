"use client";

import { deleteSession } from "@/app/session";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/contexts/app-context";
import { useLanguage } from "@/contexts/language-content";
import Image from "next/image";

export default function Logoutpage() {
  const { user } = useUserData();
  const { t } = useLanguage();

  async function handleLogout() {
    await deleteSession();
    localStorage.clear();
    window.location.href = "/auth/signin";
  }

  return (
    <div className="bg-secondary h-screen w-full flex justify-center items-center p-6">
      <div className="bg-white p-6 px-12 rounded-xl border shadow-sm flex flex-col items-center gap-4">
        <Image alt="logo" src={"/logo.png"} width={50} height={50} />

        <h1 className="font-semibold text-xl text-center">
          {t("logout.title")}
        </h1>

        <div>
          <span className="text-center">{t("logout.description")}</span>
          <p className="font-medium text-center">{user?.first_name}</p>
        </div>

        <Button
          className="rounded-xl w-full hover:opacity-[0.8] active:opacity-[0.6]"
          onClick={() => handleLogout()}
        >
          {t("logout.logout")}
        </Button>
      </div>
    </div>
  );
}
