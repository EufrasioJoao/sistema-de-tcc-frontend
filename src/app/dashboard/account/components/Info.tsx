import { Label } from "@/components/ui/label";
import { useUserData } from "@/contexts/app-context";
import { User } from "@/types/index";

export function Info({ user }: { user: User | null }) {
  const data = useUserData()
  return (
    <div className="w-full p-4 rounded-xl bg-white border shadow-sm my-4 space-y-4">
      <h1 className="block font-semibold text-[0.9rem]">
        Principais informações
      </h1>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 text-[0.9rem]">Nome</Label>
          <p className="bg-[#eee] w-full p-2 px-3 rounded mt-2  text-sm">
            {data?.user?.first_name}
          </p>
        </div>

        {user?.phone_number && (
          <div>
            <Label className="mb-2 text-[0.9rem]">Telefone</Label>
            <p className="w-full p-2 px-3 rounded mt-2 bg-secondary text-sm font-[0.2px]">
              {user?.phone_number}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
