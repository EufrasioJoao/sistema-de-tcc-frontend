import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

export function Access({
  openEditEmailDialog,
  openEditPasswordDialog,
  email,
}: {
  openEditEmailDialog: () => void;
  openEditPasswordDialog: () => void;
  email: string | undefined;
}) {
  return (
    <div className="w-full p-4 mt-4 mb-4 rounded-xl bg-white border shadow-sm space-y-4 ">
      <h1 className="block font-semibold text-[0.9rem]">
        Informações de acesso
      </h1>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 text-[0.9rem]">Email</Label>
          <div className="bg-[#eee] w-full p-2 px-3 rounded mt-2  text-sm flex items-center justify-between">
            {email}
            <Button
              onClick={openEditEmailDialog}
              variant="destructive"
              className="p-2 h-6 rounded-lg active:opacity-[0.6]"
            >
              <Pencil className="w-1 h-1" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="mb-2 text-[0.9rem]">Senha</Label>
          <div className="bg-[#eee] w-full p-2 px-3 rounded mt-2  text-sm flex items-center justify-between">
            ************
            <Button
              onClick={openEditPasswordDialog}
              variant="destructive"
              className="p-2 h-6 rounded-lg active:opacity-[0.6]"
            >
              <Pencil className="w-1 h-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
