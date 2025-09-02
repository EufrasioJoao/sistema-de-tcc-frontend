"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { User } from "@/types/index";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { useLanguage } from "@/contexts/language-content";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function EditUserDialog({ open, onOpenChange, user }: IProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    first_name: z.string().min(2, t("validation.firstNameRequired")),
    last_name: z.string().min(1, t("validation.lastNameRequired")),
    phone_number: z
      .string()
      .regex(/^\d{5,15}$/, t("validation.phoneInvalid")),
    role: z.enum(["ADMIN", "EMPLOYEE"]).default("EMPLOYEE"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone_number: user?.phone_number || "",
      role: (user?.role as "ADMIN" | "EMPLOYEE") || "EMPLOYEE",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        role: (user.role as "ADMIN" | "EMPLOYEE") || "EMPLOYEE",
      });
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const url = `/api/users/${user?.id}`;
      const response = await api.put(url, values);

      if (response.status === 200) {
        toast.success(t("toast.userUpdatedSuccess"), {
          description: t("toast.userUpdatedSuccessDesc"),
        });
        location.reload();
      } else {
        toast.error(response.data?.message || t("toast.userUpdatedError"), {
          description: t("toast.userUpdatedErrorDesc"),
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const displayMessage =
          error?.response?.data?.message || t("toast.genericError");
        toast.error(displayMessage, {
          description: t("toast.genericErrorDesc"),
        });
      }
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-4 sm:px-6 rounded-xl flex flex-col max-h-[85vh] w-[315px] sm:min-w-[450px]  overflow-y-scroll">
        <DialogHeader className="shrink-0 mb-4">
          <DialogTitle className="text-lg font-medium">
            {t("user-page.editData")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("user-page.firstName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("user-page.firstNamePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("user-page.lastName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("user-page.lastNamePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("user-page.phone")}</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder={t("user-page.phonePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("user-page.role")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("user-page.role")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EMPLOYEE">Usuario</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="destructive"
              className="w-full rounded-lg active:opacity-[0.6] mt-4"
            >
              {loading ? (
                <PulseLoader color="white" size={10} />
              ) : (
                t("user-page.save")
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
