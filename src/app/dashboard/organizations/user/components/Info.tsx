import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/index";
import { useLanguage } from "@/contexts/language-content";
import { format } from "date-fns";

export function Info({ user }: { user: User }) {
  const { t } = useLanguage();

  return (
    <div className="w-full p-4 rounded-xl bg-white border shadow-sm my-4 space-y-4">
      <h1 className="block font-semibold text-lg">{t("user-page.mainInfo")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{t("user-page.name")}</Label>
          <p className="w-full p-2 px-3 rounded mt-2 bg-secondary text-sm">
            {user?.first_name} {user?.last_name}
          </p>
        </div>

        {user?.phone_number && (
          <div>
            <Label>{t("user-page.phone")}</Label>
            <p className="w-full p-2 px-3 rounded mt-2 bg-secondary text-sm">
              {user?.phone_number}
            </p>
          </div>
        )}

        <div>
          <Label>{t("user-page.role")}</Label>
          <div className="w-full p-2 px-3 rounded mt-2 bg-secondary text-sm">
            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
              {user.role === "ADMIN" ? "Admin" : "Normal"}
            </Badge>
          </div>
        </div>

        <div>
          <Label>{t("user-page.status")}</Label>
          <div className="w-full p-2 px-3 rounded mt-2 bg-secondary text-sm">
            <Badge variant={user.is_active ? "default" : "destructive"}>
              {user.is_active
                ? t("user-page.accountActive")
                : t("user-page.accountInactive")}
            </Badge>
          </div>
        </div>

        {user.last_login_at && (
          <div>
            <Label>{t("user-page.lastLogin")}</Label>
            <p className="w-full p-2 px-3 rounded mt-2 bg-secondary text-sm">
              {format(new Date(user.last_login_at), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
