import { DataTableDemo } from "./table";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Cards } from "./Cards";
import { User } from "@/types/index";
import { useLanguage } from "@/contexts/language-content";

export function UsersTab({
  users,
  setIsDialogOpened,
}: {
  users: User[];
  setIsDialogOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { t } = useLanguage();

  function countAdmins(users: User[]): number {
    return users.filter((user) => user.is_admin == true).length;
  }
  function countNonAdmins(users: User[]): number {
    return users.filter((user) => user.is_admin == false).length;
  }

  return (
    <div className="flex-1 p-6 mx-auto pb-16">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-lg font-medium ">{t("users-page.title")}</h1>

        <Button
          onClick={() => setIsDialogOpened(true)}
          variant="default"
          className="rounded-lg active:opacity-[0.6]"
        >
          {t("users-page.add")}
        </Button>
      </div>

      <Cards
        total_users={users?.length}
        total_admins={countAdmins(users)}
        total_non_admins={countNonAdmins(users)}
      />
      <DataTableDemo router={router} data={users} />
    </div>
  );
}
