import { SidebarProvider } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main_sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aquivar - Usuario",
  other: {
    google: "notranslate",
    translate: "no",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <MainSidebar currentPage="organizations" />

      {children}
    </SidebarProvider>
  );
}
