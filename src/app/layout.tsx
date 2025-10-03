import type { Metadata } from "next";
import { geist, poppins, roboto, spaceGrotesk } from "@/fonts";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-content";
import { FontProvider } from "@/contexts/font-context";
import { AppProvider } from "@/contexts/app-context";
import { Providers } from "@/components/providers";

import PWAInstallPrompt from "@/components/pwa-install";

export const metadata: Metadata = {
  title: "Sistema de Gestão de TCCs",
  description: "Sistema de gerenciamento moderno de TCCs.",

  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon512_rounded.png",
    apple: "/icon512_maskable.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html translate="no" lang="pt-br">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body
        className={`
          ${geist.variable} 
          ${roboto.variable}
          ${poppins.variable}
          ${spaceGrotesk.variable}
        `}
      >
        <Providers>
          <AppProvider>
            <LanguageProvider>
              <FontProvider>
                {children}
                <Toaster />
              </FontProvider>
            </LanguageProvider>
          </AppProvider>
        </Providers>
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
