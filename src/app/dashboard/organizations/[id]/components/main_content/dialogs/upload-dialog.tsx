"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  FileArchive,
  X,
  Upload as UploadIcon,
  Video,
  Music,
  Table,
  ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { File as CustomFile } from "@/types/index";
import { format } from "date-fns";

import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/language-content";

interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  customName?: string;
  lastModified: number;
  webkitRelativePath: string;
  originalFile: unknown;
  setExpiration?: boolean;
  expirationDate?: string;
  expirationDescription?: string;
}

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (files: CustomFile[]) => Promise<void>;
  folderId: string;
  organization_id: string;
}

export function UploadDialog({
  open,
  onOpenChange,
  onUploadComplete,
  folderId,
  organization_id,
}: UploadDialogProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [currentStep, setCurrentStep] = useState<"drop" | "rename" | "upload">(
    "drop"
  );
  const { t } = useLanguage();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const parsed = acceptedFiles as unknown as {
      id: string;
      name: string;
      size: string | number;
      type: string | number;
      lastModified: string | number;
      webkitRelativePath: string;
      relativePath: string;
      path: string;
      progress: string | number;
      customName: string | number;
      originalFile: typeof File;
    }[];

    const filteredFiles = parsed.filter(
      (file) => Number(file.size) <= MAX_FILE_SIZE
    );

    if (filteredFiles.length < parsed.length) {
      toast.error("Some files exceed the size limit of 10 MB.");
    }

    const newFiles = filteredFiles.map((file) => ({
      id: Math.random().toString(36).substring(7), // Generate a unique ID
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      webkitRelativePath:
        file.webkitRelativePath || file.path || file.relativePath || "", // Use relevant paths
      progress: 0,
      customName: file.name,
      originalFile: file, // Include the File object here
      setExpiration: false,
      expirationDate: "",
      expirationDescription: "",
    })) as unknown as UploadFile[];

    setFiles(newFiles);
    setCurrentStep("rename");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  const getFileIcon = (type: string = "") => {
    if (type.includes("pdf")) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    if (type.includes("spreadsheet") || type.includes("excel")) {
      return <Table className="h-8 w-8 text-emerald-500" />;
    }
    if (type.includes("document") || type.includes("word")) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    }
    return <FileArchive className="h-8 w-8 text-gray-500" />;
  };

  const handleNameChange = (id: string, name: string) => {
    setFiles(
      files.map((file) =>
        file.id === id ? { ...file, customName: name } : file
      )
    );
  };

  const toggleExpiration = (id: string) => {
    setFiles(
      files.map((file) =>
        file.id === id ? { ...file, setExpiration: !file.setExpiration } : file
      )
    );
  };

  const handleExpirationDateChange = (id: string, date: string) => {
    setFiles(
      files.map((file) =>
        file.id === id ? { ...file, expirationDate: date } : file
      )
    );
  };

  const handleExpirationDescriptionChange = (
    id: string,
    description: string
  ) => {
    setFiles(
      files.map((file) =>
        file.id === id ? { ...file, expirationDescription: description } : file
      )
    );
  };

  const handleUpload = async () => {
    setCurrentStep("upload");

    const formData = new FormData();
    files.forEach((file) => {
      if (file.originalFile) {
        const __originalFile = file.originalFile as BlobPart;
        const formFile = new File(
          [__originalFile],
          file.customName || file.name,
          {
            type: file.type,
          }
        );
        formData.append("files", formFile);
      }
    });

    formData.append("folder_id", folderId);
    formData.append("organization_id", organization_id);

    try {
      const { data } = await api.post(
        `/api/files/upload/${folderId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.success) {
        const { files: uploadedFiles }: { files: CustomFile[] } = data;

        // Create expiration alerts for files that need them
        const expirationPromises: Promise<any>[] = [];

        // Create a map of our local files with expiration settings
        const fileExpirationMap = new Map();
        files.forEach((file) => {
          if (file.setExpiration && file.expirationDate) {
            // Store by the custom name we set (which will match the server's displayName)
            fileExpirationMap.set(file.customName || file.name, {
              expirationDate: file.expirationDate,
              expirationDescription: file.expirationDescription || "",
            });
          }
        });

        // Match uploaded files with their expiration settings by displayName
        uploadedFiles.forEach((uploadedFile) => {
          // The server preserves the original filename as displayName
          const expirationSettings = fileExpirationMap.get(
            uploadedFile.displayName
          );

          if (expirationSettings) {
            expirationPromises.push(
              api.post("/api/expiration-alerts/create", {
                documentId: uploadedFile.id,
                description: expirationSettings.expirationDescription,
                expirationDate: expirationSettings.expirationDate,
              })
            );
          }
        });

        if (expirationPromises.length > 0) {
          await Promise.all(expirationPromises);
        }

        toast.success("Files uploaded successfully!");
        await onUploadComplete(uploadedFiles);
        onOpenChange(false);
        setFiles([]);
        setCurrentStep("drop");
      } else {
        toast.error("Error uploading files!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during the upload.");
      setCurrentStep("drop");
    }
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
    if (files.length === 1) setCurrentStep("drop");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-4 sm:px-6 rounded-xl flex flex-col max-h-[85vh] w-[315px] sm:min-w-[450px] overflow-y-scroll">
        <DialogHeader className="shrink-0 mb-4">
          <DialogTitle>{t("organization-page.uploadFiles")}</DialogTitle>
        </DialogHeader>

        {currentStep === "drop" && (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
            )}
          >
            <input {...getInputProps()} />
            <UploadIcon className="h-10 w-10 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600">
              {t("organization-page.dragAndDrop")}
            </p>
          </div>
        )}

        {(currentStep === "rename" || currentStep === "upload") && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0">{getFileIcon(file.type)}</div>
                    <div className="flex-1 min-w-0">
                      {currentStep === "rename" ? (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground truncate">
                            {t("organization-page.originalName")}: {file.name}
                          </p>
                          <Input
                            defaultValue={file.name}
                            onChange={(e) =>
                              handleNameChange(file.id, e.target.value)
                            }
                            placeholder={t("organization-page.enterNewName")}
                            className="mb-2"
                          />

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`expiration-${file.id}`}
                              checked={file.setExpiration}
                              onCheckedChange={() => toggleExpiration(file.id)}
                            />
                            <Label
                              htmlFor={`expiration-${file.id}`}
                              className="flex items-center text-sm font-medium"
                            >
                              <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                              Criar alerta de expiração
                            </Label>
                          </div>

                          {file.setExpiration && (
                            <div className="space-y-2 pl-6 mt-2 border-l-2 border-yellow-200">
                              <div className="grid gap-1.5">
                                <Label htmlFor={`exp-date-${file.id}`}>
                                  Data de expiração
                                </Label>
                                <Input
                                  id={`exp-date-${file.id}`}
                                  type="date"
                                  value={file.expirationDate}
                                  onChange={(e) =>
                                    handleExpirationDateChange(
                                      file.id,
                                      e.target.value
                                    )
                                  }
                                  className="w-full cursor-pointer"
                                  onClick={(e) => {
                                    e.currentTarget.showPicker();
                                  }}
                                />
                              </div>

                              <div className="grid gap-1.5">
                                <Label htmlFor={`exp-desc-${file.id}`}>
                                  Descrição
                                </Label>
                                <Textarea
                                  id={`exp-desc-${file.id}`}
                                  placeholder="Descreva o motivo da expiração..."
                                  value={file.expirationDescription || ""}
                                  onChange={(e) =>
                                    handleExpirationDescriptionChange(
                                      file.id,
                                      e.target.value
                                    )
                                  }
                                  className="resize-none h-20"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="font-medium text-sm mb-1 truncate">
                          {file.customName || file.name}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                        <span className="truncate max-w-[150px]">
                          {file.type || "File"}
                        </span>
                        <span>•</span>
                        <span className="shrink-0">
                          {file.size < 1024 * 1024
                            ? `${(file.size / 1024).toFixed(2)} KB`
                            : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                        </span>
                      </div>
                      {currentStep === "upload" && (
                        <Progress value={file.progress} className="h-1 mt-2" />
                      )}
                    </div>
                    {currentStep === "rename" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {currentStep === "rename" && (
              <div className="shrink-0 mt-4 pt-4 border-t bg-background">
                <Button
                  className="w-full shadow-xs"
                  onClick={handleUpload}
                  disabled={files.length === 0}
                >
                  {t("organization-page.proceedWithUpload")}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
