/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share2, Download, X, Smartphone, Clock } from "lucide-react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstall, setShowIOSInstall] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsOpen(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as any
    );

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInStandaloneMode =
      "standalone" in window.navigator && (window.navigator as any).standalone;

    if (isIOS && !isInStandaloneMode) {
      setShowIOSInstall(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as any
      );
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("Usuário aceitou o pedido de instalação");
      } else {
        console.log("Usuário rejeitou o pedido de instalação");
      }
      setDeferredPrompt(null);
    }
    setIsOpen(false);
  };

  const handleIOSInstall = () => {
    alert(
      "Para instalar o app no seu dispositivo iOS:\n1. Toque no botão de Compartilhar no seu navegador.\n2. Role para baixo e toque em 'Adicionar à Tela de Início'.\n3. Dê um nome ao atalho e toque em 'Adicionar'."
    );
  };

  const features = [
    {
      icon: Smartphone,
      title: "Experiência Nativa",
      description: "Use como um aplicativo nativo no seu dispositivo",
    },

    {
      icon: Clock,
      title: "Acesso Rápido",
      description: "Abra instantaneamente direto da sua tela inicial",
    },
  ];

  if (!deferredPrompt && !showIOSInstall) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto  sm:mx-auto">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Image src="/logo.png" alt="Logo" width={64} height={64} />
            </div>
            <DialogTitle className="text-center text-primary">
              Sistema de Gestão de TCCs
            </DialogTitle>
            <DialogTitle className="text-center">Instale nosso App</DialogTitle>
            <DialogDescription className="text-center space-y-2 text-muted-foreground text-sm">
              Aproveite uma experiência melhor instalando nosso aplicativo no
              seu dispositivo
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto"
            >
              Agora Não
            </Button>
            <Button onClick={handleInstall} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Instalar App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showIOSInstall && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2 bg-background">
          <Button
            size="lg"
            className="shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleIOSInstall}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Adicionar à Tela de Início
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => setShowIOSInstall(false)}
          >
            <X className="mr-1 h-3 w-3" />
            Não mostrar novamente
          </Button>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;
