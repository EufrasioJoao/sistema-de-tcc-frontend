"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-content";
import { File } from "@/types/index";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (file: File) => Promise<void>;
  file: File;
}

export function DeleteFileDialog({
  open,
  onOpenChange,
  onDelete,
  file,
}: IProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-4 sm:px-6 rounded-xl flex flex-col max-h-[85vh] w-[315px] sm:min-w-[450px]  overflow-y-scroll">
        <DialogHeader className="shrink-0 mb-4">
          <DialogTitle className="text-lg font-medium">
            {t("organization-page.deleteFile")}
          </DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            onDelete(file);
          }}
        >
          <p className="text-l mb-2 font-medium">
            {t("organization-page.deleteFileConfirmation")}
          </p>
          <p>{t("organization-page.deleteFileWarning")}</p>

          <Button
            type="submit"
            variant="destructive"
            className="w-full rounded-lg active:opacity-[0.6] mt-4"
          >
            {t("organization-page.delete")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
