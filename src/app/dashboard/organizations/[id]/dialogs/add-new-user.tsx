"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
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
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/language-content";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleRefresh: () => Promise<void>;
  organization_id: string;
}

export function AddNewUserDialog({
  open,
  onOpenChange,
  handleRefresh,
  organization_id,
}: IProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const formSchema = z.object({
    first_name: z.string().min(2, t("validation.firstNameRequired")),
    last_name: z.string().min(1, t("validation.lastNameRequired")),
    email: z.string().email(t("validation.emailInvalid")),
    phone_number: z.string().regex(/^\d{5,15}$/, t("validation.phoneInvalid")),
    role: z.enum(["ADMIN", "EMPLOYEE"]).default("EMPLOYEE"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      role: "EMPLOYEE",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setGeneratedPassword("");

    try {
      const url = `/api/users/register`;
      const body = {
        ...values,
        employee_organization_id: Number(organization_id),
      };

      const response = await api.post(url, body);

      if (response.status === 201) {
        setGeneratedPassword(response.data?.password);
        toast.success(t("toast.userCreatedSuccess"), {
          description: t("toast.userCreatedSuccessDesc"),
        });
        await handleRefresh();
        form.reset();
      } else {
        toast.error(response.data?.message || t("toast.userCreatedError"), {
          description: t("toast.userCreatedErrorDesc"),
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const displayMessage =
          error?.response?.data?.message || t("toast.genericError");
        setGeneratedPassword("");
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
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-lg font-medium">
            {t("users-page.addNewUser")}
          </DialogTitle>
          <DialogDescription sr-only={true}></DialogDescription>
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
                  <FormLabel>{t("users-page.firstName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("users-page.firstNamePlaceholder")}
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
                  <FormLabel>{t("users-page.lastName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("users-page.lastNamePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("users-page.email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("users-page.emailPlaceholder")}
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
                  <FormLabel>{t("users-page.phone")}</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder={t("users-page.phonePlaceholder")}
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
                  <FormLabel>{t("users-page.role")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("users-page.role")} />
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

            {generatedPassword && (
              <div className="mt-4 w-full bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-lg">
                <span className="font-semibold">
                  {t("toast.userCreatedSuccess")}
                </span>
                <p>
                  {t("users-page.passwordIs")}{" "}
                  <span className="text-primary text-lg">
                    {generatedPassword}
                  </span>
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="destructive"
              className="w-full rounded-lg active:opacity-[0.6] mt-4"
            >
              {loading ? (
                <PulseLoader color="white" size={10} />
              ) : (
                t("users-page.create")
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
