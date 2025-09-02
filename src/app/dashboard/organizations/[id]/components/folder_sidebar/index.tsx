"use client";
import React, { useEffect, useRef, useState } from "react";

import type { Folder } from "@/types/index";
import { Mobile } from "./mobile";
import { useIsMobile } from "@/hooks/use-mobile";
import { Desktop } from "./desktop.";

interface FolderSidebarProps {
  folders: Folder[];
  selectedFolder: string;
  expandedFolders: string[];
  onFolderSelect: (folder: string) => void;
  onFolderToggle: (folder: string) => void;
  onCreateFolder: (
    name: string,
    parent_folder_id: string | undefined
  ) => Promise<void>;
}

export function FolderSidebar({
  folders,
  selectedFolder,
  expandedFolders,
  onFolderSelect,
  onFolderToggle,
  onCreateFolder,
}: FolderSidebarProps) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null!);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isCreatingFolder && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreatingFolder]);

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      await onCreateFolder(newFolderName.trim(), undefined);
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  if (!mounted) {
    return null; // ou um placeholder
  }

  return (
    <>
      {isMobile ? (
        <Mobile
          selectedFolder={selectedFolder}
          expandedFolders={expandedFolders}
          onFolderSelect={onFolderSelect}
          onFolderToggle={onFolderToggle}
          folders={folders}
          handleCreateFolder={handleCreateFolder}
          inputRef={inputRef}
          isCreatingFolder={isCreatingFolder}
          newFolderName={newFolderName}
          setIsCreatingFolder={setIsCreatingFolder}
          setNewFolderName={setNewFolderName}
        />
      ) : (
        <Desktop
          selectedFolder={selectedFolder}
          expandedFolders={expandedFolders}
          onFolderSelect={onFolderSelect}
          onFolderToggle={onFolderToggle}
          folders={folders}
          handleCreateFolder={handleCreateFolder}
          inputRef={inputRef}
          isCreatingFolder={isCreatingFolder}
          newFolderName={newFolderName}
          setIsCreatingFolder={setIsCreatingFolder}
          setNewFolderName={setNewFolderName}
        />
      )}
    </>
  );
}
