"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { FileCard } from "../cards/file-card";
import { FolderCard } from "../cards/folder-card";
import { File, Folder, FolderPermission } from "@/types/index";
import { PulseLoader } from "react-spinners";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/language-content";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization_id: string;
  currentFolderId: string | undefined;
  permission: FolderPermission | null;
  onFileSelect: (file: File) => void;
  setDeleteFileDialogOpen: React.Dispatch<
    React.SetStateAction<{
      file: File;
      open: boolean;
    }>
  >;
  currentFolder: Folder | null | undefined;
  onFolderClick: (folderPath: string) => void;

  selectedFolder: string;
  setDeleteFolderDialogOpen: React.Dispatch<
    React.SetStateAction<{
      folder: Folder;
      open: boolean;
    }>
  >;
  handleFolderRename: (
    folder_id: string,
    newName: string,
    currentFolderId: string
  ) => Promise<void>;
}

export function SearchDialog({
  open,
  onOpenChange,
  organization_id,
  currentFolderId,
  permission,
  onFileSelect,
  onFolderClick,
  selectedFolder,
  setDeleteFolderDialogOpen,
  handleFolderRename,
  currentFolder,
  setDeleteFileDialogOpen,
}: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [results, setResults] = useState<{ files: File[]; folders: Folder[] }>({
    files: [],
    folders: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (debouncedSearchTerm.length > 2) {
      const fetchResults = async () => {
        setIsLoading(true);
        try {
          let userQueryParam = "";
          if (permission?.userId) {
            userQueryParam = `?userId=${permission.userId}`;
          }

          const response = await api.get(
            `/api/folders/organization/${organization_id}/folder/${
              currentFolderId || ""
            }/search/${debouncedSearchTerm}${userQueryParam}`
          );
          setResults(response.data.data || { files: [], folders: [] });
        } catch (error) {
          console.error("Search failed:", error);
          setResults({ files: [], folders: [] });
        } finally {
          setIsLoading(false);
        }
      };

      fetchResults();
    } else {
      setResults({ files: [], folders: [] });
    }
  }, [debouncedSearchTerm, organization_id, currentFolderId, permission]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("search-dialog.title")}</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("search-dialog.placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex-1 overflow-y-auto mt-4 pr-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <PulseLoader color="#888" size={10} />
            </div>
          ) : results.files.length === 0 && results.folders.length === 0 ? (
            <div className="text-center text-muted-foreground mt-10">
              <p>
                {debouncedSearchTerm.length > 2
                  ? t("search-dialog.no-results")
                  : t("search-dialog.enter-chars")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  view="list"
                  onClick={() => null}
                  onDelete={async () => {
                    setDeleteFolderDialogOpen({
                      folder: folder,
                      open: true,
                    });
                  }}
                  onRename={async () => {
                    const newName = prompt(
                      `${t("organization-page.newFolderName")}:`,
                      folder.name
                    );
                    if (newName && newName !== folder.name) {
                      await handleFolderRename(
                        folder.id,
                        newName,
                        currentFolder?.id as string
                      );
                    }
                    location.reload();
                  }}
                  permission={permission}
                />
              ))}
              {results.files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  view="list"
                  onClick={() => onFileSelect(file)}
                  onDelete={() => {
                    setDeleteFileDialogOpen({
                      file: file,
                      open: true,
                    });
                  }}
                  permission={permission}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
