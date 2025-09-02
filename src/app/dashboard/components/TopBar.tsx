import { useUserData } from "@/contexts/app-context";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const TopBar = () => {
  const { user } = useUserData();

  function formatDateInPortuguese() {
    const parsedDate = new Date();
    return format(parsedDate, "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
  }

  return (
    <div className="border-b p-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-sm font-bold block">
            Saudações, {user?.first_name}!
          </span>
          <span className="text-xs block text-stone-500">
            {formatDateInPortuguese()}
          </span>
        </div>
      </div>
    </div>
  );
};
