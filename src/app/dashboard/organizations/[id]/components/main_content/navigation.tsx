import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function Navigation({
  selectedFolder,
  onNavigateBack,
  onBreadcrumbClick,
}: {
  selectedFolder: string;
  onNavigateBack: () => void;
  onBreadcrumbClick: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {selectedFolder !== "Todas as Pastas" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onNavigateBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voltar</p>
          </TooltipContent>
        </Tooltip>
      )}
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        {selectedFolder !== "Todas as Pastas" &&
          selectedFolder.split("/").map((part, index) => (
            <div key={index} className={`flex items-center gap-1`}>
              <span className={`${index === 0 && "hidden"}`}>/</span>
              <span
                className="hover:text-primary cursor-pointer"
                onClick={() => onBreadcrumbClick(index)}
              >
                {part}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
