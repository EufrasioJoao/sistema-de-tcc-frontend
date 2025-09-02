"use client";

import { api } from "@/lib/api";
import { Folder } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import {
  Folder as FolderIcon,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface FolderTreeProps {
  selectedFolder: string | null;
  onSelectFolder: (folderId: string | null) => void;
  currentFolderId?: string | null;
  organizationId: string;
}

interface FolderNodeProps {
  folder: Folder;
  selectedFolder: string | null;
  onSelectFolder: (folderId: string | null) => void;
  level: number;
  currentFolderId?: string | null;
}

const FolderNode: React.FC<FolderNodeProps> = ({
  folder,
  selectedFolder,
  onSelectFolder,
  level,
  currentFolderId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: content, isLoading } = useQuery<{
    folder: { folders: Folder[] };
  }>({
    queryKey: ["subfolders", folder.id],
    queryFn: async () => {
      const response = await api.get(
        `/api/folders/folder-content/${folder.id}`
      );
      return response.data;
    },
    enabled: isOpen,
  });

  const subFolders = content?.folder.folders;
  const isCurrentFolder = folder.id === currentFolderId;

  if (isCurrentFolder) {
    return null;
  }

  return (
    <div>
      <div
        className={`flex items-center p-2 rounded-md cursor-pointer ${
          selectedFolder === folder.id
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={() => onSelectFolder(folder.id)}
      >
        <div
          className="flex items-center grow"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {subFolders && subFolders.length > 0 ? (
            isOpen ? (
              <ChevronDown size={16} className="mr-2" />
            ) : (
              <ChevronRight size={16} className="mr-2" />
            )
          ) : (
            <div className="w-4 mr-2"></div>
          )}
          <FolderIcon className="mr-2" size={16} />
          <span>{folder.name}</span>
        </div>
      </div>
      {isOpen && (
        <div className="pl-4">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin my-2" />}
          {subFolders?.map((subFolder) => (
            <FolderNode
              key={subFolder.id}
              folder={subFolder}
              selectedFolder={selectedFolder}
              onSelectFolder={onSelectFolder}
              level={level + 1}
              currentFolderId={currentFolderId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  selectedFolder,
  onSelectFolder,
  currentFolderId,
  organizationId,
}) => {
  const { data, isLoading } = useQuery<{ folders: Folder[] }>({
    queryKey: ["organization-folders", organizationId],
    queryFn: async () => {
      const response = await api.get(
        `/api/folders/organization/${organizationId}`
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-2 border rounded-md max-h-64 overflow-y-auto">
      <div
        className={`flex items-center p-2 rounded-md cursor-pointer ${
          selectedFolder === null
            ? "bg-gray-200 dark:bg-gray-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        onClick={() => onSelectFolder(null)}
      >
        <FolderIcon className="mr-2" size={16} />
        <span>Raiz</span>
      </div>
      {data?.folders.map((folder) => (
        <FolderNode
          key={folder.id}
          folder={folder}
          selectedFolder={selectedFolder}
          onSelectFolder={onSelectFolder}
          level={0}
          currentFolderId={currentFolderId}
        />
      ))}
    </div>
  );
};
