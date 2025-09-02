"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import {
  Grid,
  List,
  Pencil,
  Trash,
  Upload,
  HardDrive,
  FolderPlus,
  UserPlus,
  ArrowUpDown,
  Search,
  Trash2,
  Move,
} from "lucide-react";
import { AccessLevel, Folder, Permission } from "@/types/index";
import { useLanguage } from "@/contexts/language-content";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserData } from "@/contexts/app-context";
import { useFolder } from "@/contexts/folder-context";
import { Dispatch, SetStateAction } from "react";

export function Actions({
  selectedFolder,
  currentFolder,
  onFolderDelete,
  handleFolderRename,
  sortConfig,
  onSortChange,
  view,
  onViewChange,
  setCreateFolderDialogOpen,
  setSearchDialogOpen,
  setAddPermissionDialogOpen,
  setUploadDialogOpen,
  formatStorageSize,
  usedStorageBytes,
  totalStorageGB,
  usedStoragePercentage,
  permission,
  setDeleteSelectedDialogOpen,
  setMoveSelectedDialogOpen,
}: {
  selectedFolder: string;
  currentFolder: Folder | null | undefined;
  onFolderDelete: (path: string, folder_id: string) => Promise<void>;
  handleFolderRename: (
    folder_id: string,
    newName: string,
    currentFolderId: string
  ) => Promise<void>;
  sortConfig: {
    key: string;
    direction: string;
  };
  onSortChange: (config: { key: string; direction: string }) => void;
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
  setCreateFolderDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAddPermissionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formatStorageSize: (bytes: number) => string;
  usedStorageBytes: number;
  totalStorageGB: number;
  usedStoragePercentage: number;
  permission: Permission | null;
  setDeleteSelectedDialogOpen: Dispatch<SetStateAction<boolean>>;
  setMoveSelectedDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { selectedFileIds, selectedFolderIds } = useFolder();
  const { t } = useLanguage();
  const { user } = useUserData();

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between flex-wrap">
      <div className="flex gap-2 flex-wrap">
        <h2 className="text-lg font-semibold">
          {selectedFolder.split("/").pop()}
        </h2>
        {currentFolder &&
          (user?.is_admin ||
            permission?.accessLevel === AccessLevel.MANAGE) && (
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const d = confirm(
                        `Deletar a pasta ${currentFolder?.name}`
                      );
                      if (d) {
                        onFolderDelete(selectedFolder, currentFolder.id);
                      }
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Deletar Pasta</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newName = prompt(
                        `Novo nome para ${currentFolder?.name}:`,
                        currentFolder?.name
                      );
                      if (newName && newName !== currentFolder?.name) {
                        handleFolderRename(
                          currentFolder.id,
                          newName,
                          currentFolder.id
                        );
                      }
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Renomear Pasta</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Ordenar
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ordenar por</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={`${sortConfig.key}-${sortConfig.direction}`}
              onValueChange={(value) => {
                const [key, direction] = value.split("-");
                onSortChange({ key, direction });
              }}
            >
              <DropdownMenuRadioItem value="name-asc">
                Nome (A-Z)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="name-desc">
                Nome (Z-A)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="created_at-desc">
                Mais Recente
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="created_at-asc">
                Mais Antigo
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="size-desc">
                Tamanho (Maior)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="size-asc">
                Tamanho (Menor)
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={view === "list" ? "text-primary" : ""}
              variant="outline"
              size="icon"
              onClick={() => onViewChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Visualizar em Lista</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={view === "grid" ? "text-primary" : ""}
              variant="outline"
              size="icon"
              onClick={() => onViewChange("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Visualizar em Grade</p>
          </TooltipContent>
        </Tooltip>
        {(user?.is_admin || permission?.accessLevel === AccessLevel.MANAGE) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCreateFolderDialogOpen(true)}
              >
                <FolderPlus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Criar Nova Pasta</p>
            </TooltipContent>
          </Tooltip>
        )}
        {(user?.is_admin || permission?.accessLevel === AccessLevel.MANAGE) &&
          currentFolder?.id && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setSearchDialogOpen(true)}
              >
                <Search className="h-4 w-4" />
                {t("organization-page.search")}
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAddPermissionDialogOpen(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("organization-page.managePermissions")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        {(user?.is_admin ||
          [AccessLevel.MANAGE, AccessLevel.UPLOAD].includes(
            permission?.accessLevel as AccessLevel
          )) && (
          <Button
            onClick={() => setUploadDialogOpen(true)}
            disabled={selectedFolder === "Todas as Pastas"}
            className="w-fit"
          >
            <Upload className="mr-2 h-4 w-4" />
            {t("organization-page.uploadFiles")}
          </Button>
        )}
        {(user?.is_admin ||
          [AccessLevel.MANAGE, AccessLevel.UPLOAD].includes(
            permission?.accessLevel as AccessLevel
          )) &&
          (selectedFileIds.length > 0 || selectedFolderIds.length > 0) && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                onClick={() => setDeleteSelectedDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Deletar
              </Button>
              <Button onClick={() => setMoveSelectedDialogOpen(true)}>
                <Move className="h-4 w-4 mr-2" />
                Mover
              </Button>
            </div>
          )}

        <div className="hidden sm:flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                Armazenamento
              </span>
              <span className="text-xs text-muted-foreground">
                {formatStorageSize(usedStorageBytes)} / {totalStorageGB} GB
              </span>
            </div>
            <Progress value={usedStoragePercentage} />
          </div>
        </div>
      </div>
    </div>
  );
}
