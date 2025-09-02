"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFolder } from "@/contexts/folder-context";
import { Loader2 } from "lucide-react";

interface DeleteSelectedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSelectedDialog({
  open,
  onOpenChange,
}: DeleteSelectedDialogProps) {
  const {
    handleDeleteSelected,
    deletingSelected,
    selectedFileIds,
    selectedFolderIds,
  } = useFolder();

  const handleConfirmDelete = async () => {
    await handleDeleteSelected();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja deletar os{" "}
            {selectedFileIds.length > 0 &&
              `${selectedFileIds.length} arquivo(s)`}
            {selectedFileIds.length > 0 &&
              selectedFolderIds.length > 0 &&
              " e "}
            {selectedFolderIds.length > 0 &&
              `${selectedFolderIds.length} pasta(s)`}{" "}
            selecionados? Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deletingSelected}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={deletingSelected}
          >
            {deletingSelected ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Deletar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
