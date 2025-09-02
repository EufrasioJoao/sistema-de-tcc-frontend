"use client";

import { Folder, Permission, AccessLevel } from "@/types/index";
import { Button } from "@/components/ui/button";
import { FolderArchive, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserData } from "@/contexts/app-context";
import { useFolder } from "@/contexts/folder-context";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
  onDelete: () => void;
  onRename: () => void;
  view: "list" | "grid";
  permission: Permission | null;
}

export function FolderCard({
  folder,
  onClick,
  onDelete,
  onRename,
  view,
  permission,
}: FolderCardProps) {
  const { user } = useUserData();
  const { selectedFolderIds, handleSelectFolder } = useFolder();
  const isSelected = selectedFolderIds.includes(folder.id);

  function formatDateInPortuguese(date: Date | string): string {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return format(parsedDate, "dd 'de' MMMM 'de' yyyy, HH:mm", {
      locale: ptBR,
    });
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        `flex ${
          view == "grid" ? "flex-col" : "flex-row"
        } items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 cursor-pointer  relative`,
        isSelected && "bg-blue-100 dark:bg-blue-900/30"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => handleSelectFolder(folder.id)}
          onClick={(e) => e.stopPropagation()}
        />
        <FolderArchive className="h-8 w-8 text-primary" />
      </div>
      <div className={`flex-1 ${view == "grid" && "w-full text-center"}  `}>
        <p className="font-medium text-sm truncate">{folder.name}</p>{" "}
        <p
          className={`text-xs text-muted-foreground ${
            view === "grid" && " text-center"
          } truncate`}
        >
          {formatDateInPortuguese(folder.created_at)}
        </p>
      </div>

      {(user?.is_admin || permission?.accessLevel === AccessLevel.MANAGE) && (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onRename();
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
