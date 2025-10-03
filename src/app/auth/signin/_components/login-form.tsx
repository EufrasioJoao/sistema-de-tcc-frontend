"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { PulseLoader } from "react-spinners";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createSession } from "@/app/session";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { User } from "@/types/index";
import { useUserData } from "@/contexts/app-context";
import { AxiosError } from "axios";

const formSchema = z.object({
  email: z.string().email("Insira um email"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { saveUserData } = useUserData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }: z.infer<typeof formSchema>) {
    if (loading) return;
    setLoading(true);

    try {
      const body = { email, password };

      const response = await api.post(`/api/users/login`, body);

      if (response.status == 200) {
        const user = response.data?.user as User;

        saveUserData(user);
        await createSession({
          token: response.data?.token,
          userId: response.data?.user?.id,
        });

        router.push("/dashboard");
      } else {
        toast.error(response.data?.message, {
          action: {
            label: "Ok",
            onClick: () => { },
          },
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message
          ? error.response?.data?.message
          : error.message;
        console.error(error);
        toast.error(errorMessage, {
          description: "ocorreu um erro.",
          action: {
            label: "Ok",
            onClick: () => { },
          },
        });
      } else {
        console.error(error);
      }
    }

    setLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center gap-1">
                  <h1 className="text-xl font-bold">Bem-vindo de volta</h1>
                  <p className="text-balance text-muted-foreground">
                    Insira seu e-mail e senha para acessar sua conta.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                          required
                          className="rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex items-center">
                        <FormLabel>Senha</FormLabel>

                        <Link
                          href="/auth/forgot-password"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          Esqueceu a senha?
                        </Link>
                      </div>

                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          {...field}
                          required
                          placeholder="*********"
                          className="rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className={`w-full rounded-xl ${loading ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                >
                  {loading ? <PulseLoader color="white" size={10} /> : "Entrar"}
                </Button>
              </div>
            </form>
          </Form>


        </CardContent>
      </Card>
    </div>
  );
}
