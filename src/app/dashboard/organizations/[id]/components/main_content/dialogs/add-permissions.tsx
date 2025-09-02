"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Employee } from "@/types/index";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { PulseLoader } from "react-spinners";
import { useLanguage } from "@/contexts/language-content";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
}

const permissionTranslationMap: {
  [key: string]:
    | "add-permissions-dialog.access-level-view"
    | "add-permissions-dialog.access-level-download"
    | "add-permissions-dialog.access-level-upload"
    | "add-permissions-dialog.access-level-manage"
    | "add-permissions-dialog.access-level-no-access";
} = {
  VIEW_ONLY: "add-permissions-dialog.access-level-view",
  VIEW_DOWNLOAD: "add-permissions-dialog.access-level-download",
  UPLOAD: "add-permissions-dialog.access-level-upload",
  MANAGE: "add-permissions-dialog.access-level-manage",
  NO_ACCESS: "add-permissions-dialog.access-level-no-access",
};

export function AddPermissionsDialog({ open, onOpenChange, folderId }: IProps) {
  const [operators, setOperators] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<string | null>(
    null
  );
  const [isPermissionLoading, setIsPermissionLoading] = useState(false);
  const { t } = useLanguage();

  const fetchOperators = async () => {
    try {
      const response = await api.get(`/api/users`);
      if (response.status == 200) {
        setOperators(response.data.operators);
      }
    } catch (error: unknown) {
      console.error("Erro ao buscar operadores:", error);
      if (error instanceof AxiosError) {
        toast.error(t("add-permissions-dialog.failed-to-fetch-operators"));
      }
    }
  };

  const formSchema = z.object({
    targetId: z
      .string()
      .nonempty(t("add-permissions-dialog.operator-is-required")),
    accessLevel: z.enum([
      "VIEW_ONLY",
      "VIEW_DOWNLOAD",
      "UPLOAD",
      "MANAGE",
      "NO_ACCESS",
    ]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessLevel: "VIEW_ONLY",
    },
  });

  const selectedTargetId = form.watch("targetId");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedOperator = operators.find(
      (op) => op.id === Number(values.targetId)
    );

    if (selectedOperator?.is_admin) {
      toast.error(t("add-permissions-dialog.admin-permission-error"));
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/users/create-or-update-permission", {
        operatorId: Number(values.targetId),
        folderId: folderId,
        accessLevel: values.accessLevel,
        targetType: "OPERATOR",
      });
      toast.success(t("add-permissions-dialog.success-toast"));
      onOpenChange(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error(t("add-permissions-dialog.error-toast"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      setCurrentPermission(null);
    }
    onOpenChange(isOpen);
  };

  useEffect(() => {
    if (open) {
      fetchOperators();
    } else {
      form.reset();
      setCurrentPermission(null);
    }
  }, [open]);

  useEffect(() => {
    if (selectedTargetId && open) {
      const fetchPermission = async () => {
        setIsPermissionLoading(true);
        try {
          const response = await api.get(
            `/api/users/get-folder-or-file-permission?operatorId=${selectedTargetId}&folderId=${folderId}&targetType=OPERATOR`
          );
          const permission = response.data.permission.accessLevel;
          setCurrentPermission(permission);
          form.setValue("accessLevel", permission);
        } catch (error) {
          setCurrentPermission(null);
          form.setValue("accessLevel", "" as any);
        } finally {
          setIsPermissionLoading(false);
        }
      };
      fetchPermission();
    } else {
      setCurrentPermission(null);
    }
  }, [selectedTargetId, open, folderId, form]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="px-4 sm:px-6 rounded-xl flex flex-col max-h-[85vh] w-[315px] sm:min-w-[450px]  overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{t("add-permissions-dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("add-permissions-dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>
            {t("add-permissions-dialog.inheritance-title")}
          </AlertTitle>
          <AlertDescription>
            {t("add-permissions-dialog.inheritance-description")}
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="targetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("add-permissions-dialog.operator-label")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "add-permissions-dialog.operator-placeholder"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {operators.map((operator) => (
                        <SelectItem
                          key={operator.id}
                          value={String(operator.id)}
                        >
                          {operator.first_name} {operator.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {isPermissionLoading && (
                    <p className="text-sm text-muted-foreground">
                      {t("add-permissions-dialog.loading-permission")}
                    </p>
                  )}
                  {currentPermission && !isPermissionLoading && (
                    <p className="text-sm text-muted-foreground">
                      {t("add-permissions-dialog.current-permission")}{" "}
                      <span className="font-semibold">
                        {t(
                          permissionTranslationMap[currentPermission] ||
                            currentPermission
                        )}
                      </span>
                    </p>
                  )}
                  {!currentPermission &&
                    !isPermissionLoading &&
                    selectedTargetId && (
                      <p className="text-sm text-muted-foreground">
                        {t("add-permissions-dialog.no-permission-set")}
                      </p>
                    )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accessLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("add-permissions-dialog.access-level-label")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "add-permissions-dialog.access-level-placeholder"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="VIEW_ONLY">
                        {t("add-permissions-dialog.access-level-view")}
                      </SelectItem>
                      <SelectItem value="VIEW_DOWNLOAD">
                        {t("add-permissions-dialog.access-level-download")}
                      </SelectItem>
                      <SelectItem value="UPLOAD">
                        {t("add-permissions-dialog.access-level-upload")}
                      </SelectItem>
                      <SelectItem value="MANAGE">
                        {t("add-permissions-dialog.access-level-manage")}
                      </SelectItem>
                      <SelectItem value="NO_ACCESS">
                        {t("add-permissions-dialog.access-level-no-access")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <PulseLoader size={8} color="#fff" />
              ) : (
                t("add-permissions-dialog.save-button")
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
