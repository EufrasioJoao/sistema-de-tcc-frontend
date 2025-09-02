"use client";
import { MainSidebar } from "@/components/main_sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FolderProvider } from "@/contexts/folder-context";
import { use } from "react";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <SidebarProvider>
      <MainSidebar currentPage="organizations" />

      <FolderProvider pageId={id}>
        <div className="w-full h-screen overflow-y-scroll">{children}</div>
      </FolderProvider>
    </SidebarProvider>
  );
}
