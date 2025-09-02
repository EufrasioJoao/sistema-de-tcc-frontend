"use client";

import {
  createFolder,
  deleteFile,
  deleteFolder,
  fetchFolderContent,
  fetchOrganizationFolders,
  updateFolder,
  moveFile,
  moveFolder,
} from "@/app/organizations/[id]/api";
import { File, Folder } from "@/types/index";
import { AxiosError } from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { useUserData } from "./app-context";

interface AppContextType {
  view: "list" | "grid";
  setView: React.Dispatch<React.SetStateAction<"list" | "grid">>;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  expandedFolders: string[];
  setExpandedFolders: React.Dispatch<React.SetStateAction<string[]>>;

  sortConfig: {
    key: string;
    direction: string;
  };
  setSortConfig: React.Dispatch<
    React.SetStateAction<{
      key: string;
      direction: string;
    }>
  >;

  transformFolderData: (folder: any) => Folder;

  currentFolder: Folder | null;
  setCurrentFolder: React.Dispatch<React.SetStateAction<Folder | null>>;
  sortFiles: (
    files: File[],
    config: {
      key: string;
      direction: string;
    }
  ) => File[];
  initialFolders: Folder[];
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  displayedFolders: Folder[];
  setDisplayedFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  selectedFolder: string;
  setSelectedFolder: React.Dispatch<React.SetStateAction<string>>;
  findFolder: (folders: Folder[], pathParts: string[]) => Folder | undefined;
  sortedFolders: Folder[];
  filteredFiles: File[];
  deletingSelected: boolean;
  setDeletingSelected: React.Dispatch<React.SetStateAction<boolean>>;
  movingSelected: boolean;
  handleMoveSelected: (destinationFolderId: string) => Promise<void>;

  onUploadComplete: (newFiles: File[]) => Promise<void>;
  updateSubFolderFiles: (
    subfolders: Folder[],
    pathParts: string[],
    newFiles: File[]
  ) => Folder[];
  handleDeleteFolder: (path: string, folder_id: string) => Promise<void>;
  handleDeleteFile: (fileName: string, fileId: string) => Promise<void>;
  selectedFileIds: string[];
  setSelectedFileIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFolderIds: string[];
  setSelectedFolderIds: React.Dispatch<React.SetStateAction<string[]>>;
  handleSelectFile: (fileId: string) => void;
  handleSelectFolder: (folderId: string) => void;
  handleDeleteSelected: () => Promise<void>;
  updateFolderFiles: (
    folder: Folder,
    pathParts: string[],
    updateFn: (files: File[]) => File[]
  ) => Folder;
  handleFolderRename: (
    folder_id: string,
    newName: string,
    currentFolderId: string
  ) => Promise<void>;
  handleBreadcrumbClick: (index: number) => void;
  handleNavigateBack: () => void;
  handleCreateFolder: (
    name: string,
    parent_folder_id: string | undefined
  ) => Promise<void>;
  handleFolderClick: (path: string) => void;

  isFolderLoading: boolean;
  setIsFolderLoading: React.Dispatch<React.SetStateAction<boolean>>;

  getFolders: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function FolderProvider({
  children,
  pageId,
}: {
  children: React.ReactNode;
  pageId: string;
}) {
  // Initialize all states from sessionStorage using the passed pageId
  const [view, setView] = useState<"list" | "grid">(() => {
    if (typeof window !== "undefined") {
      const savedView = sessionStorage.getItem(`folderView-${pageId}`);
      return savedView ? (savedView as "list" | "grid") : "list";
    }
    return "list";
  });

  const { user } = useUserData();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deletingSelected, setDeletingSelected] = useState(false);
  const [movingSelected, setMovingSelected] = useState(false);

  const [expandedFolders, setExpandedFolders] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const savedFolders = sessionStorage.getItem(`expandedFolders-${pageId}`);
      return savedFolders ? JSON.parse(savedFolders) : ["Todas as Pastas"];
    }
    return ["Todas as Pastas"];
  });

  const [currentFolder, setCurrentFolder] = useState<Folder | null>(() => {
    if (typeof window !== "undefined") {
      const savedFolder = sessionStorage.getItem(`currentFolder-${pageId}`);
      return savedFolder ? JSON.parse(savedFolder) : null;
    }
    return null;
  });

  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);

  const [selectedFolder, setSelectedFolder] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const savedFolder = sessionStorage.getItem(`selectedFolder-${pageId}`);
      return savedFolder || "Todas as Pastas";
    }
    return "Todas as Pastas";
  });

  const [sortConfig, setSortConfig] = useState(() => {
    if (typeof window !== "undefined") {
      const savedSort = sessionStorage.getItem(`sortConfig-${pageId}`);
      return savedSort
        ? JSON.parse(savedSort)
        : { key: "name", direction: "asc" };
    }
    return { key: "name", direction: "asc" };
  });

  // Helper function to recursively transform folder data
  const transformFolderData = (folder: any): Folder => {
    const subfolders = folder.folders || folder.subfolders || [];
    return {
      ...folder,
      subfolders: subfolders.map(transformFolderData),
    };
  };

  const sortFiles = (
    files: File[],
    config: { key: string; direction: string }
  ) => {
    return [...files].sort((a, b) => {
      const dir = config.direction === "asc" ? 1 : -1;

      switch (config.key) {
        case "name":
          return a.filename.localeCompare(b.filename) * dir;
        case "created_at":
          return (
            (new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()) *
            dir
          );
        case "size":
          return (
            (parseInt(String(a.size)) - parseInt(String(b?.size || "0"))) * dir
          );
        default:
          return 0;
      }
    });
  };

  // Initialize with empty state and update after mount
  const initialFolders = useMemo<Folder[]>(() => [], []);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [displayedFolders, setDisplayedFolders] = useState<Folder[]>([]);

  const [isFolderLoading, setIsFolderLoading] = useState(false);

  // Save all states to sessionStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`folderView-${pageId}`, view);
    }
  }, [view]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        `expandedFolders-${pageId}`,
        JSON.stringify(expandedFolders)
      );
    }
  }, [expandedFolders]);

  useEffect(() => {
    if (currentFolder && typeof window !== "undefined") {
      sessionStorage.setItem(
        `currentFolder-${pageId}`,
        JSON.stringify(currentFolder)
      );
    }
  }, [currentFolder]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`selectedFolder-${pageId}`, selectedFolder);
    }
  }, [selectedFolder]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        `sortConfig-${pageId}`,
        JSON.stringify(sortConfig)
      );
    }
  }, [sortConfig]);

  const findFolder = (
    folders: Folder[],
    pathParts: string[]
  ): Folder | undefined => {
    if (!pathParts.length) return undefined;

    let current = folders.find((folder) => folder.name === pathParts[0]);
    for (let i = 1; i < pathParts.length && current; i++) {
      current = current.subfolders?.find((sub) => sub.name === pathParts[i]);
    }

    return current; // Return `undefined` if not found
  };

  const sortedFolders = useMemo(() => {
    return [...displayedFolders].sort((a, b) => {
      if (sortConfig.key === "name") {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return sortConfig.direction === "asc" ? -1 : 1;
        if (nameA > nameB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });
  }, [displayedFolders, sortConfig]);

  const filteredFiles: File[] = useMemo(() => {
    let filesToProcess: File[] = [];

    if (selectedFolder === "Todas as Pastas") {
      filesToProcess = folders.reduce((acc: File[], folder) => {
        return [...acc, ...(folder.files || [])];
      }, []);
    } else if (currentFolder) {
      filesToProcess = currentFolder.files || [];
    } else {
      // While loading, there's no current folder, so no files to process
      filesToProcess = [];
    }

    const filtered = filesToProcess;

    return sortFiles(filtered, sortConfig);
  }, [selectedFolder, folders, currentFolder, sortConfig]);

  const onUploadComplete = async (newFiles: File[]) => {
    const pathParts = selectedFolder.split("/");

    setFolders((current) =>
      current.map((folder) => {
        if (pathParts.length === 1 && folder.name === selectedFolder) {
          // Upload in root folder
          return {
            ...folder,
            files: [...(folder.files || []), ...newFiles],
          };
        } else if (pathParts[0] === folder.name) {
          // Upload in subfolder
          return {
            ...folder,
            subfolders: updateSubFolderFiles(
              folder.subfolders || [],
              pathParts.slice(1),
              newFiles
            ),
          };
        }
        return folder;
      })
    );
  };

  const updateSubFolderFiles = (
    subfolders: Folder[], // Your folder type
    pathParts: string[], // Path split into parts (e.g., ["folder", "subfolder"])
    newFiles: File[] // The new files to add
  ): Folder[] => {
    if (pathParts.length === 0) return subfolders; // Base case

    const currentFolder = pathParts[0];
    const remainingPath = pathParts.slice(1);

    return subfolders.map((subfolder) => {
      if (subfolder.name === currentFolder) {
        // Found the subfolder, now check if we need to recurse or add files
        if (remainingPath.length === 0) {
          // No more subfolder levels, just add the files
          return {
            ...subfolder,
            files: [...(subfolder.files || []), ...newFiles],
          };
        } else {
          // Recursively call for deeper subfolders
          return {
            ...subfolder,
            subfolders: updateSubFolderFiles(
              subfolder.subfolders || [],
              remainingPath,
              newFiles
            ),
          };
        }
      }
      return subfolder;
    });
  };

  const handleDeleteFolder: (
    path: string,
    folder_id: string
  ) => Promise<void> = async (path: string, folder_id: string) => {
    if (!user?.is_admin) {
      toast.warning("Apenas administradores podem deletar pastas!");
      return;
    }

    const pathParts = path.split("/");

    try {
      await deleteFolder(folder_id);

      if (pathParts.length === 1) {
        setFolders((current) =>
          current.filter((folder) => folder.name !== pathParts[0])
        );
      } else {
        setFolders((current) =>
          current.map((folder) => {
            if (folder.name === pathParts[0]) {
              return {
                ...folder,
                subfolders: folder.subfolders?.filter(
                  (sf) => sf.name !== pathParts[1]
                ),
              };
            }
            return folder;
          })
        );
      }

      if (selectedFolder === path) {
        handleFolderClick("Todas as Pastas");
      }

      toast.success("Pasta deletada com sucesso");
    } catch (err) {
      console.error("Erro ao deletar a pasta:", err);
      if (err instanceof AxiosError) {
        const message =
          err.response?.data?.message || "Erro ao deletar a pasta";
        toast.error(message);
      }
    }
  };

  const handleDeleteFile = async (fileName: string, fileId: string) => {
    const pathParts = selectedFolder.split("/");

    try {
      await deleteFile(fileId);

      setFolders((current) =>
        current.map((folder) =>
          updateFolderFiles(folder, pathParts, (files) =>
            files.filter((f) => f.filename !== fileName)
          )
        )
      );

      toast.success("Arquivo deletada com sucesso");
    } catch (err) {
      console.error("Erro ao deletar a arquivo:", err);
      if (err instanceof AxiosError) {
        const message =
          err.response?.data?.message || "Erro ao deletar a arquivo";
        toast.error(message);
      }
    }
  };

  const updateFolderFiles = (
    folder: Folder,
    pathParts: string[],
    updateFn: (files: File[]) => File[]
  ): Folder => {
    if (pathParts.length === 1 && folder.name === pathParts[0]) {
      return {
        ...folder,
        files: updateFn(folder.files || []),
      };
    }

    if (pathParts[0] === folder.name) {
      return {
        ...folder,
        subfolders: updateSubFolderFiles(
          folder.subfolders || [],
          pathParts.slice(1),
          updateFn(folder.files || [])
        ),
      };
    }

    return folder;
  };

  const handleFolderRename = async (
    folder_id: string,
    newName: string,
    currentFolderId: string // only pass the ID of the current folder
  ) => {
    try {
      // Perform the update
      await updateFolder(folder_id, newName);

      setFolders((current) =>
        current.map((folder) =>
          folder.id === folder_id
            ? { ...folder, name: newName } // Update the folder's name
            : {
                ...folder,
                subfolders: folder.subfolders?.map((subFolder) =>
                  subFolder.id === folder_id
                    ? { ...subFolder, name: newName } // Update the subfolder's name
                    : subFolder
                ),
              }
        )
      );

      // Only update selectedFolder if the renamed folder affects the current path
      setSelectedFolder((prev: string) =>
        prev.includes(currentFolderId)
          ? prev.replace(new RegExp(`(^|/)${folder_id}($|/)`), `$1${newName}$2`)
          : prev
      );

      // Update currentFolder here
      if (currentFolderId === currentFolder?.id) {
        setCurrentFolder({ ...currentFolder, name: newName });
      }

      toast.success("Pasta renomeada com sucesso");
    } catch (err) {
      console.error("Erro ao renomear a pasta:", err);
      if (err instanceof AxiosError) {
        const message =
          err.response?.data?.message || "Erro ao atualizar a pasta";
        toast.error(message);
      }
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index < 0) {
      handleFolderClick("Todas as Pastas");
      return;
    }
    const pathParts = selectedFolder.split("/");
    const newPath = pathParts.slice(0, index + 1).join("/");
    handleFolderClick(newPath);
  };

  const handleNavigateBack = () => {
    console.log(selectedFolder);
    if (selectedFolder === "Todas as Pastas") {
      return; // Already at the root, do nothing
    }

    const pathParts = selectedFolder.split("/");
    pathParts.pop(); // Go up one level
    const newPath = pathParts.join("/");

    handleFolderClick(newPath.length > 0 ? newPath : "Todas as Pastas");
  };

  const handleCreateFolder = async (
    name: string,
    parent_folder_id: string | undefined
  ) => {
    try {
      const invalidCharsRegex = /[\\\/:\*\?"<>\|]/;
      if (
        invalidCharsRegex.test(name) ||
        name.endsWith(" ") ||
        name.endsWith(".")
      ) {
        toast.error(
          "O nome da pasta contém caracteres inválidos para o Windows."
        );
        return;
      }

      await createFolder(
        pageId,
        name,
        parent_folder_id,
        user?.id as unknown as string
      );
      toast.success("Pasta criada com sucesso!");
      await getFolders(); // Refresh folder list
    } catch (err) {
      console.error("Erro ao criar pasta:", err);
      if (err instanceof AxiosError) {
        const message = err.response?.data?.message || "Erro ao criar a pasta";
        toast.error(message);
      }
    }
  };

  const handleFolderClick = (path: string) => {
    if (path !== selectedFolder) {
      setIsFolderLoading(true);
      setCurrentFolder(null); // Clear current folder to show loading state
      setSelectedFolder(path);
      setSelectedFileIds([]);
      setSelectedFolderIds([]);
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      if (selectedFolder === "Todas as Pastas") {
        setCurrentFolder(null);
        setDisplayedFolders(folders);
        return;
      }

      setIsFolderLoading(true);
      try {
        const pathParts = selectedFolder.split("/");
        const foundFolder = findFolder(folders, pathParts);

        if (foundFolder?.id) {
          const folderContent = await fetchFolderContent(foundFolder.id);
          const transformedFolder = transformFolderData(folderContent);
          setCurrentFolder(transformedFolder);
          setDisplayedFolders(transformedFolder.subfolders || []);
        }
      } catch (error) {
        console.error("Error fetching folder content:", error);
        toast.error("Erro ao carregar o conteúdo da pasta.");
      } finally {
        setIsFolderLoading(false);
      }
    };

    fetchContent();
  }, [selectedFolder, folders]);

  useEffect(() => {
    if (selectedFolder === "Todas as Pastas") {
      setDisplayedFolders(folders);
    }
  }, [folders]);

  const getFolders = async () => {
    if (!pageId) return;

    try {
      const [organizationFolders] = await Promise.all([
        fetchOrganizationFolders(pageId as string),
      ]);

      setFolders(organizationFolders.map(transformFolderData));
    } catch (err) {
      console.error("Error getting data:", err);
      toast.error("Ocorreu um error ao carregar os dados...");
    }
  };

  useEffect(() => {
    getFolders();
  }, [pageId]);

  const handleSelectFile = (fileId: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolderIds((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleMoveSelected = async (destinationFolderId: string) => {
    if (!user?.id) {
      toast.error("Você precisa estar logado para mover arquivos.");
      return;
    }

    setMovingSelected(true);
    try {
      const fileMovePromises = selectedFileIds.map((fileId) =>
        moveFile(fileId, destinationFolderId, user.id.toString())
      );
      const folderMovePromises = selectedFolderIds.map((folderId) =>
        moveFolder(folderId, destinationFolderId, user.id.toString())
      );

      await Promise.all([...fileMovePromises, ...folderMovePromises]);

      toast.success("Itens selecionados foram movidos com sucesso!");

      setSelectedFileIds([]);
      setSelectedFolderIds([]);

      await getFolders();
      if (currentFolder?.id) {
        const folderContent = await fetchFolderContent(currentFolder.id);
        const transformedFolder = transformFolderData(folderContent);
        setCurrentFolder(transformedFolder);
        setDisplayedFolders(transformedFolder.subfolders || []);
      }
    } catch (err) {
      console.error("Erro ao mover itens selecionados:", err);
      toast.error("Ocorreu um erro ao mover os itens selecionados.");
    } finally {
      setMovingSelected(false);
    }
  };

  const handleDeleteSelected = async () => {
    const fileDeletePromises = selectedFileIds.map((fileId) =>
      deleteFile(fileId)
    );
    const folderDeletePromises = selectedFolderIds.map((folderId) =>
      deleteFolder(folderId)
    );

    setDeletingSelected(true);
    try {
      await Promise.all([...fileDeletePromises, ...folderDeletePromises]);

      toast.success("Itens selecionados foram deletados com sucesso!");

      // Clear selections
      setSelectedFileIds([]);
      setSelectedFolderIds([]);

      // Refetch folders to update the UI
      await getFolders();
      if (currentFolder?.id) {
        const folderContent = await fetchFolderContent(currentFolder.id);
        const transformedFolder = transformFolderData(folderContent);
        setCurrentFolder(transformedFolder);
        setDisplayedFolders(transformedFolder.subfolders || []);
      }
    } catch (err) {
      console.error("Erro ao deletar itens selecionados:", err);
      toast.error("Ocorreu um erro ao deletar os itens selecionados.");
    }
    setDeletingSelected(false);
  };

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        getFolders,
        selectedFile,
        setSelectedFile,
        expandedFolders,
        setExpandedFolders,
        deletingSelected,
        setDeletingSelected,
        movingSelected,
        handleMoveSelected,

        sortConfig,
        setSortConfig,

        transformFolderData,

        currentFolder,
        setCurrentFolder,
        sortFiles,
        initialFolders,
        folders,
        setFolders,
        displayedFolders,
        setDisplayedFolders,
        selectedFolder,
        setSelectedFolder,
        findFolder,
        sortedFolders,
        filteredFiles,

        onUploadComplete,
        updateSubFolderFiles,
        handleDeleteFolder,
        handleDeleteFile,
        selectedFileIds,
        setSelectedFileIds,
        selectedFolderIds,
        setSelectedFolderIds,
        handleSelectFile,
        handleSelectFolder,
        handleDeleteSelected,
        updateFolderFiles,
        handleFolderRename,
        handleBreadcrumbClick,
        handleNavigateBack,
        handleCreateFolder,
        handleFolderClick,
        isFolderLoading,
        setIsFolderLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useFolder() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useFolder must be used within a FolderProvider.");
  }
  return context;
}
