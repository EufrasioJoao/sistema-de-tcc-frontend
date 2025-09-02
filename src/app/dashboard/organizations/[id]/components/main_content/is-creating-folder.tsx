import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserData } from "@/contexts/app-context";
import { useLanguage } from "@/contexts/language-content";
import { Check, Folder, Plus, X } from "lucide-react";
import { Dispatch, RefObject, SetStateAction } from "react";

export function IsCreatingFolderComponent({
  selectedFolder,
  isCreatingFolder,
  setIsCreatingFolder,
  setAddPermissionDialogOpen,
  inputRef,
  newFolderName,
  setNewFolderName,
  handleKeyDown,
  handleCreateFolder,
}: {
  selectedFolder: string;
  isCreatingFolder: boolean;
  setIsCreatingFolder: Dispatch<SetStateAction<boolean>>;
  setAddPermissionDialogOpen: Dispatch<SetStateAction<boolean>>;
  inputRef: RefObject<HTMLInputElement>;
  newFolderName: string;
  setNewFolderName: Dispatch<SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleCreateFolder: () => void;
}) {
  const { user } = useUserData();
  const { t } = useLanguage();

  return (
    <div className="flex gap-2 md:gap-4 flex-wrap border-b pb-2">
      {isCreatingFolder ? (
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("organization-page.folderName")}
            className="h-9 w-[200px]"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCreateFolder}
            disabled={!newFolderName.trim()}
          >
            <Check className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
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
          {user?.is_admin && (
            <Button variant="outline" onClick={() => setIsCreatingFolder(true)}>
              <Folder className="mr-2 h-4 w-4" />
              {selectedFolder}
              <Plus className="ml-2 h-4 w-4" />
            </Button>
          )}
        </>
      )}
      {user?.is_admin && (
        <Button
          variant="outline"
          onClick={() => setAddPermissionDialogOpen(true)}
        >
          {t("organization-page.assignOrRemovePermissions")}
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
