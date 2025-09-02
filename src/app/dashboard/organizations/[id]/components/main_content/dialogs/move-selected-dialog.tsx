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
import { FolderTree } from "../folder-tree";
import { useState } from "react";

interface MoveSelectedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

export function MoveSelectedDialog({
  open,
  onOpenChange,
  organizationId,
}: MoveSelectedDialogProps) {
  const {
    selectedFileIds,
    selectedFolderIds,
    handleMoveSelected,
    movingSelected,
  } = useFolder();
  const [selectedDestinationFolder, setSelectedDestinationFolder] = useState<
    string | null
  >(null);

  const handleConfirmMove = async () => {
    if (selectedDestinationFolder) {
      await handleMoveSelected(selectedDestinationFolder);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mover Itens</DialogTitle>
          <DialogDescription>
            Selecione a pasta de destino para mover os{" "}
            {selectedFileIds.length > 0 &&
              `${selectedFileIds.length} arquivo(s)`}
            {selectedFileIds.length > 0 &&
              selectedFolderIds.length > 0 &&
              " e "}
            {selectedFolderIds.length > 0 &&
              `${selectedFolderIds.length} pasta(s)`}{" "}
            selecionados.
          </DialogDescription>
        </DialogHeader>
        <div>
          <FolderTree
            selectedFolder={selectedDestinationFolder}
            onSelectFolder={setSelectedDestinationFolder}
            organizationId={organizationId}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={movingSelected}
          >
            Cancelar
          </Button>
          <Button
            disabled={!selectedDestinationFolder || movingSelected}
            onClick={handleConfirmMove}
          >
            {movingSelected ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Movendo...
              </>
            ) : (
              "Mover"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
