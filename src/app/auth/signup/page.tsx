"use client";

import { SignupForm } from "./_components/signup-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  return (
    <div className="grid h-screen w-full grid-cols-1 lg:grid-cols-2">
      <div
        className="relative bg-cover bg-center lg:block"
        style={{
          backgroundImage: "url(/images/auth/signup/bg.avif)",
        }}
      >
        <div className="relative z-10 flex h-full flex-col justify-end bg-black/50 p-10 text-white">
          <h2 className="text-4xl font-bold">
            Gestão de TCCs para Instituições
          </h2>
          <p className="mt-4 text-lg">
            Sua plataforma completa para gestão de TCCs.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <Button variant="ghost" className="" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="w-full max-w-md border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold">Crie sua conta</h1>
            <p className="text-sm text-muted-foreground">
              Preencha o formulário para se cadastrar na plataforma.
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
