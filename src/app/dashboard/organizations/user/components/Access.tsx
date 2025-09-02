import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-content";
import { Pencil } from "lucide-react";

export function Access({
  openEditEmailDialog,
  email,
  hasPermission,
}: {
  openEditEmailDialog: () => void;
  email: string;
  hasPermission: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div className="w-full p-4 mt-4 mb-4 rounded-xl bg-white border shadow-sm space-y-4 ">
      <h1 className="block font-semibold text-[0.9rem]">
        {t("user-page.accessInfo")}
      </h1>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 text-[0.9rem]">{t("user-page.email")}</Label>
          <div className="bg-[#eee] w-full p-2 px-3 rounded mt-2 bg-secondary text-sm flex items-center justify-between">
            {email}
            {hasPermission && (
              <Button
                onClick={openEditEmailDialog}
                variant="destructive"
                className="p-2 h-6 rounded-lg active:opacity-[0.6]"
              >
                <Pencil className="w-1 h-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
