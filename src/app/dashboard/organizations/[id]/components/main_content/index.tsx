"use client";

import { FolderOpen, FolderArchive } from "lucide-react";
import { FileCard } from "./cards/file-card";
import { FolderCard } from "./cards/folder-card";
import {
  AccessLevel,
  TargetType,
  type File,
  type Folder,
  type Organization,
  type Permission,
} from "@/types/index";
import { useLanguage } from "@/contexts/language-content";
import { useState, useEffect, useCallback, useMemo } from "react";
import { UploadDialog } from "./dialogs/upload-dialog";
import { AddPermissionsDialog } from "./dialogs/add-permissions";
import { useUserData } from "@/contexts/app-context";
import { api } from "@/lib/api";
import { DeleteFolderDialog } from "./dialogs/delete-folder-dialog";
import { DeleteFileDialog } from "./dialogs/delete-file-dialog";
import { CreateFolderDialog } from "./dialogs/create-folder-dialog";
import { SearchDialog } from "./dialogs/search-dialog";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "./navigation";
import { Actions } from "./actions";
import { DeleteSelectedDialog } from "./dialogs/delete-selected-dialog";
import { MoveSelectedDialog } from "./dialogs/move-selected-dialog";

interface MainContentProps {
  selectedFolder: string;
  files: File[];
  view: "list" | "grid";
  sortConfig: { key: string; direction: string };
  onSortChange: (config: { key: string; direction: string }) => void;
  onViewChange: (view: "list" | "grid") => void;
  onNavigateBack: () => void;
  onBreadcrumbClick: (index: number) => void;
  onFileSelect: (file: File) => void;
  onCreateFolder: (
    name: string,
    parent_folder_id: string | undefined
  ) => Promise<void>;
  onUploadComplete: (files: File[]) => Promise<void>;
  onDeleteFile: (fileName: string, fileId: string) => Promise<void>;
  onFolderClick: (folderPath: string) => void;
  onFolderDelete: (path: string, folder_id: string) => Promise<void>;
  currentFolder: Folder | undefined | null;
  handleFolderRename: (
    folder_id: string,
    newName: string,
    currentFolderId: string
  ) => Promise<void>;
  organization_id: string;
  organization: Organization | null;
  isFolderLoading?: boolean;
}

// Storage usage formatter
const formatStorageSize = (bytes: number) => {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);

  return `${size.toFixed(2)} ${units[i]}`;
};

export function MainContent({
  selectedFolder,
  files,
  view,
  sortConfig,
  onSortChange,
  onViewChange,
  onNavigateBack,
  onBreadcrumbClick,
  onFileSelect,
  onCreateFolder,
  onUploadComplete,
  onDeleteFile,
  onFolderClick,
  onFolderDelete,
  currentFolder,
  handleFolderRename,
  organization_id,
  organization,
  isFolderLoading = false,
}: MainContentProps) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPermissionLoading, setIsPermissionLoading] = useState(true);
  const [permission, setPermission] = useState<Permission | null>(null);
  const { t } = useLanguage();
  const [addPermissionDialogOpen, setAddPermissionDialogOpen] = useState(false);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState({
    folder: {} as Folder,
    open: false,
  });
  const [deleteSelectedDialogOpen, setDeleteSelectedDialogOpen] =
    useState(false);
  const [moveSelectedDialogOpen, setMoveSelectedDialogOpen] = useState(false);
  const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState({
    file: {} as File,
    open: false,
  });
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const { user } = useUserData();

  // Calculate storage usage
  const usedStorageBytes = organization?.UsedStorage || 0;
  const totalStorageGB = organization?.plan?.gigabytes || 0;
  const totalStorageBytes = totalStorageGB * 1024 * 1024 * 1024;
  const usedStoragePercentage =
    totalStorageBytes > 0 ? (usedStorageBytes / totalStorageBytes) * 100 : 0;

  const checkPermission = useCallback(async () => {
    setIsPermissionLoading(true);
    if (!user?.id) {
      setPermission(null);
      setIsPermissionLoading(false);
      return;
    }

    if (user.is_admin) {
      setPermission({
        id: 0,
        folderId: currentFolder?.id || "",
        userId: user.id,
        operatorId: null,
        accessLevel: AccessLevel.MANAGE,
        targetType: TargetType.USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setIsPermissionLoading(false);
      return;
    }

    const params: { operatorId: number; folderId?: string } = {
      operatorId: user.id,
    };

    if (currentFolder) {
      params.folderId = currentFolder.id;
    }

    if (!params.folderId) {
      setPermission(null);
      setIsPermissionLoading(false);
      return;
    }

    try {
      const response = await api.get(
        "/api/users/get-folder-or-file-permission",
        { params }
      );
      if (response.status === 200 && response.data.permission) {
        setPermission(response.data.permission);
      } else {
        setPermission(null);
      }
    } catch (error) {
      setPermission(null);
    } finally {
      setIsPermissionLoading(false);
    }
  }, [user?.id, currentFolder?.id]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredFolders = useMemo(() => {
    if (!currentFolder?.subfolders) return [];
    return currentFolder.subfolders;
  }, [currentFolder?.subfolders]);

  const filteredFiles = useMemo(() => {
    return files;
  }, [files]);

  if (!mounted) {
    return <div className="flex flex-col h-full w-full" />;
  }

  const deleteFolder = async (folder: Folder) => {
    await onFolderDelete(`${selectedFolder}/${folder.name}`, folder?.id);
  };

  const deleteFile = async (file: File) => {
    await onDeleteFile(file.filename, file?.id);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col flex-1 min-h-screen md:h-full md:min-h-0 w-full overflow-auto">
        <div className="border-b p-4 shrink-0 space-y-4">
          <Navigation
            onBreadcrumbClick={onBreadcrumbClick}
            selectedFolder={selectedFolder}
            onNavigateBack={onNavigateBack}
          />

          <Actions
            selectedFolder={selectedFolder}
            setDeleteSelectedDialogOpen={setDeleteSelectedDialogOpen}
            setMoveSelectedDialogOpen={setMoveSelectedDialogOpen}
            currentFolder={currentFolder}
            onFolderDelete={onFolderDelete}
            handleFolderRename={handleFolderRename}
            sortConfig={sortConfig}
            onSortChange={onSortChange}
            view={view}
            onViewChange={onViewChange}
            setCreateFolderDialogOpen={setCreateFolderDialogOpen}
            setSearchDialogOpen={setSearchDialogOpen}
            setAddPermissionDialogOpen={setAddPermissionDialogOpen}
            setUploadDialogOpen={setUploadDialogOpen}
            formatStorageSize={formatStorageSize}
            usedStorageBytes={usedStorageBytes}
            totalStorageGB={totalStorageGB}
            usedStoragePercentage={usedStoragePercentage}
            permission={permission}
          />
        </div>

        <div className="flex-1 p-4">
          {isFolderLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">
                Carregando conteúdo da pasta...
              </p>
            </div>
          ) : isPermissionLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">
                {t("organization-page.checkingPermissions")}
              </p>
            </div>
          ) : !permission && !user?.is_admin ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FolderArchive className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium">
                {t("organization-page.noPermission")}
              </p>
            </div>
          ) : selectedFolder === t("organization-page.allFolders") ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FolderArchive className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium">
                {t("organization-page.selectFolderToStart")}
              </p>
              <p className="text-sm">{t("organization-page.chooseFolder")}</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {/* Files section */}
                <div>
                  {filteredFiles.length === 0 &&
                  filteredFolders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <FolderOpen size={64} className="mb-4" />
                      <h3 className="text-xl font-semibold">
                        {t("organization-page.emptyFolder")}
                      </h3>
                      <p className="text-sm">
                        {t("organization-page.emptyFolderHelper")}
                      </p>
                    </div>
                  ) : (
                    <div>
                      {currentFolder?.subfolders &&
                        currentFolder.subfolders.length > 0 && (
                          <div>
                            <div
                              className={
                                view === "grid"
                                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                  : "space-y-2"
                              }
                            >
                              {[...currentFolder.subfolders]
                                .sort((a, b) => {
                                  if (sortConfig.key === "name") {
                                    return sortConfig.direction === "asc"
                                      ? a.name.localeCompare(b.name)
                                      : b.name.localeCompare(a.name);
                                  } else if (sortConfig.key === "created_at") {
                                    const dateA = new Date(
                                      a.created_at
                                    ).getTime();
                                    const dateB = new Date(
                                      b.created_at
                                    ).getTime();
                                    return sortConfig.direction === "asc"
                                      ? dateA - dateB
                                      : dateB - dateA;
                                  }
                                  return 0;
                                })
                                .map((folder) => (
                                  <FolderCard
                                    key={folder.id}
                                    view={view}
                                    folder={folder}
                                    onClick={() =>
                                      onFolderClick(
                                        `${selectedFolder}/${folder.name}`
                                      )
                                    }
                                    onDelete={async () =>
                                      setDeleteFolderDialogOpen({
                                        folder: folder,
                                        open: true,
                                      })
                                    }
                                    onRename={() => {
                                      const newName = prompt(
                                        `${t(
                                          "organization-page.newFolderName"
                                        )}:`,
                                        folder.name
                                      );
                                      if (newName && newName !== folder.name) {
                                        handleFolderRename(
                                          folder.id,
                                          newName,
                                          currentFolder.id
                                        );
                                      }
                                    }}
                                    permission={permission}
                                  />
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
                {files.length > 0 && (
                  <div className="mt-2">
                    <div
                      className={
                        view === "grid"
                          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                          : "space-y-2"
                      }
                    >
                      {files.map((file) => (
                        <FileCard
                          key={file.id}
                          file={file}
                          view={view}
                          onClick={() => onFileSelect(file)}
                          onDelete={() =>
                            setDeleteFileDialogOpen({
                              file: file,
                              open: true,
                            })
                          }
                          permission={permission}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Dialogs */}
        <UploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onUploadComplete={onUploadComplete}
          organization_id={organization_id}
          folderId={currentFolder?.id as string}
        />
        <AddPermissionsDialog
          open={addPermissionDialogOpen}
          onOpenChange={setAddPermissionDialogOpen}
          folderId={currentFolder?.id as string}
        />
        <DeleteFolderDialog
          open={deleteFolderDialogOpen.open}
          onOpenChange={(open) =>
            setDeleteFolderDialogOpen({ ...deleteFolderDialogOpen, open })
          }
          onDelete={deleteFolder}
          folder={deleteFolderDialogOpen.folder}
        />
        <DeleteFileDialog
          open={deleteFileDialogOpen.open}
          onOpenChange={(open) =>
            setDeleteFileDialogOpen({ ...deleteFileDialogOpen, open })
          }
          file={deleteFileDialogOpen.file}
          onDelete={deleteFile}
        />

        <CreateFolderDialog
          open={createFolderDialogOpen}
          onOpenChange={setCreateFolderDialogOpen}
          onCreateFolder={async (name) => {
            await onCreateFolder(name, currentFolder?.id);
          }}
        />

        <SearchDialog
          open={searchDialogOpen}
          onOpenChange={setSearchDialogOpen}
          organization_id={organization_id}
          currentFolderId={currentFolder?.id}
          permission={permission}
          onFileSelect={onFileSelect}
          onFolderClick={onFolderClick}
          setDeleteFileDialogOpen={setDeleteFileDialogOpen}
          handleFolderRename={handleFolderRename}
          currentFolder={currentFolder}
          selectedFolder={selectedFolder}
          setDeleteFolderDialogOpen={setDeleteFolderDialogOpen}
        />

        <DeleteSelectedDialog
          open={deleteSelectedDialogOpen}
          onOpenChange={setDeleteSelectedDialogOpen}
        />

        <MoveSelectedDialog
          open={moveSelectedDialogOpen}
          onOpenChange={setMoveSelectedDialogOpen}
          organizationId={organization_id}
        />
      </div>
    </TooltipProvider>
  );
}
