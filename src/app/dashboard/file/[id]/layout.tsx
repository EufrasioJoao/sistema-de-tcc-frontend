import { Header } from "@/components/header";
import { MainSidebar } from "@/components/main_sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex">
      <MainSidebar currentPage="organizations" />

      <div className="flex-1 w-full overflow-x-hidden">
        <div className="max-w-full overflow-x-hidden">
          <div className=" w-full overflow-x-auto overscroll-x-none">
            <Header currentPage="organizations" />
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
