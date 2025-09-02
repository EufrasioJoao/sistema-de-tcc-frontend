"use client";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, FolderArchive, Plus, Check, X } from "lucide-react";
import { ResizablePanel } from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";

import type { Folder } from "@/types/index";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-content";
import { useUserData } from "@/contexts/app-context";

interface IProps {
  selectedFolder: string;
  expandedFolders: string[];
  onFolderSelect: (folder: string) => void;
  onFolderToggle: (folder: string) => void;

  isCreatingFolder: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  newFolderName: string;
  setNewFolderName: Dispatch<SetStateAction<string>>;
  setIsCreatingFolder: Dispatch<SetStateAction<boolean>>;
  handleCreateFolder: () => void;
  folders: Folder[];
}

export function Desktop({
  selectedFolder,
  expandedFolders,
  onFolderSelect,
  onFolderToggle,

  isCreatingFolder,
  inputRef,
  newFolderName,
  setNewFolderName,
  setIsCreatingFolder,
  handleCreateFolder,
  folders,
}: IProps) {
  const { t } = useLanguage();
  const { user } = useUserData();

  return (
    <ResizablePanel
      defaultSize={20}
      minSize={15}
      maxSize={40}
      className="border-r bg-background min-w-[280px] flex flex-col h-screen"
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="px-4 pt-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            {!isCreatingFolder && (
              <div className="font-semibold text-primary">
                {t("organization-page.myFolders")}
              </div>
            )}
            {isCreatingFolder ? (
              <div className="flex items-center gap-1">
                <Input
                  ref={inputRef}
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateFolder();
                    if (e.key === "Escape") {
                      setIsCreatingFolder(false);
                      setNewFolderName("");
                    }
                  }}
                  placeholder="Nova pasta"
                  className="h-8  flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                {user?.is_admin == true && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setIsCreatingFolder(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            {folders.map((folder, index) => (
              <Folder
                key={index}
                folder={folder}
                isSelected={selectedFolder === folder.name}
                onSelect={onFolderSelect}
                onFolderToggle={onFolderToggle}
                expandedFolders={expandedFolders}
                path=""
              />
            ))}
          </div>
        </div>
      </div>
    </ResizablePanel>
  );
}

interface FolderProps {
  folder: Folder;
  isSelected: boolean;
  onSelect: (folder: string) => void;
  onFolderToggle: (folder: string) => void;
  path?: string;
  expandedFolders: string[];
}

function Folder({
  folder,
  isSelected,
  onSelect,
  onFolderToggle,
  path = "",
  expandedFolders,
}: FolderProps) {
  const fullPath = path ? `${path}/${folder.name}` : folder.name;
  const isOpen = expandedFolders.includes(fullPath);
  const hasSubfolders =
    folder.hasSubfolders !== undefined
      ? folder.hasSubfolders
      : folder.subfolders && folder.subfolders.length > 0;

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent/50 cursor-pointer group",
          {
            "bg-primary/10": isSelected,
          }
        )}
        onClick={() => onSelect(fullPath)}
      >
        {hasSubfolders && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onFolderToggle(fullPath);
            }}
            className="p-1 hover:bg-accent rounded-sm"
          >
            <ChevronRight
              className={cn("h-4 w-4 shrink-0 transition-transform", {
                "rotate-90": isOpen,
              })}
            />
          </div>
        )}
        <FolderArchive className="h-4 w-4 shrink-0 text-primary" />
        <span className="truncate flex-1">{folder.name}</span>
      </div>

      {isOpen && hasSubfolders && (
        <div className="pl-9 space-y-1 mt-1">
          {folder.subfolders?.map((subFolder, index) => (
            <Folder
              key={`${fullPath}/${subFolder.name}-${index}`}
              folder={subFolder}
              isSelected={isSelected}
              onSelect={onSelect}
              onFolderToggle={onFolderToggle}
              path={fullPath}
              expandedFolders={expandedFolders}
            />
          ))}
        </div>
      )}
    </div>
  );
}
