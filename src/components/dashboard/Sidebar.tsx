"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserData } from "@/contexts/app-context";
import {
  ChevronLeft,
  ChevronRight,
  AreaChart,
  LogOut,
  Users,
  ChevronsUpDown,
  User,
  Settings2,
  MoreHorizontal,
  Eye,
  Home,
  BookCopy,
  GraduationCap,
  FileText,
  UserCog,
} from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarMenuAction,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserRoles } from "@/types/index";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Sidebar component
 */
const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useUserData();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { setSidebarWidth } = useSidebar();
  const [isExpanded, setIsExpanded] = useState(true);
  const allLinks = [
    {
      title: "Painel",
      name: "painel",
      url: "/dashboard",
      icon: Home,
      roles: [
        UserRoles.ADMIN,
        UserRoles.SISTEM_MANAGER,
        UserRoles.COURSE_COORDENATOR,
        UserRoles.ACADEMIC_REGISTER,
      ],
    },
    {
      title: "TCCs",
      name: "tccs",
      url: "/dashboard/tccs",
      icon: FileText,
      roles: [
        UserRoles.ADMIN,
        UserRoles.SISTEM_MANAGER,
        UserRoles.COURSE_COORDENATOR,
        UserRoles.ACADEMIC_REGISTER,
      ],
    },
    {
      title: "Cursos",
      name: "courses",
      url: "/dashboard/courses",
      icon: BookCopy,
      roles: [UserRoles.ADMIN, UserRoles.SISTEM_MANAGER],
    },
    {
      title: "Estudantes",
      name: "students",
      url: "/dashboard/students",
      icon: GraduationCap,
      roles: [
        UserRoles.ADMIN,
        UserRoles.SISTEM_MANAGER,
        UserRoles.ACADEMIC_REGISTER,
      ],
    },
    {
      title: "Usuários",
      name: "users",
      url: "/dashboard/users",
      icon: UserCog,
      roles: [UserRoles.ADMIN],
    },
    {
      title: "Relatórios",
      name: "reports",
      url: "/dashboard/reports",
      icon: AreaChart,
      roles: [UserRoles.ADMIN, UserRoles.SISTEM_MANAGER],
    },
    {
      title: "Configurações",
      name: "settings",
      url: "/dashboard/settings",
      icon: Settings2,
      roles: [
        UserRoles.ADMIN,
        UserRoles.SISTEM_MANAGER,
        UserRoles.COURSE_COORDENATOR,
        UserRoles.ACADEMIC_REGISTER,
      ],
    },
  ];

  const data = {
    user: {
      name: user?.first_name,
      email: user?.email,
      avatar: "/user.png",
    },
    links: allLinks.filter(
      (link) => user?.role && link.roles.includes(user.role)
    ),
  };

  // Set initial sidebar width
  useEffect(() => {
    setSidebarWidth(isExpanded ? "16rem" : "70px");
  }, [isExpanded, setSidebarWidth]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    setSidebarWidth(!isExpanded ? "16rem" : "70px");
  };

  return (
    <ShadcnSidebar className={`border-r-0 flex flex-col`}>
      {/* Sidebar Header */}
      <SidebarHeader className="flex items-center justify-between p-4">
        {isExpanded && (
          <Link href="/dashboard" className="font-bold text-white">
            Arquivo Digital UCM
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:text-sidebar-accent-foreground rounded-full p-1 transition-colors"
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </SidebarHeader>

      {/* Navigation links */}
      {user?.id ? (
        <SidebarContent className="flex-1 py-4 overscroll-none px-3">
          <SidebarGroup>
            <SidebarMenu>
              {data.links.map((item) => {
                const isActive =
                  item.url === "/dashboard"
                    ? pathname === item.url
                    : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.name} className="relative">
                    {isActive && (
                      <div className="absolute left-0 top-0 h-full w-1.5 bg-sidebar-primary rounded-r-lg" />
                    )}
                    <SidebarMenuButton
                      asChild
                      className={`rounded-lg mb-1 font-medium transition-colors ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <Link
                        href={item.url}
                        className={`flex items-center gap-3 p-3 ${
                          !isExpanded ? "justify-center" : ""
                        }`}
                      >
                        <item.icon className="flex-shrink-0" />
                        {isExpanded && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      ) : (
        <div className="flex-1"></div>
      )}
      <SidebarFooter className="px-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={"/user.png"} alt={user?.first_name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.first_name}
                    </span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "left" : "right"}
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={"/user.png"} alt={user?.first_name} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.first_name}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/settings")}
                  >
                    <Settings2 className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/account")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Minha Conta</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/auth/logout")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
