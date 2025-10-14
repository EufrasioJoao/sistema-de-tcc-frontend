"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserData } from "@/contexts/app-context";
import {
  Home,
  FileText,
  BookCopy,
  GraduationCap,
  UserCog,
  AreaChart,
  Shield,
  Database,
} from "lucide-react";
import { UserRoles } from "@/types/index";
import { cn } from "@/lib/utils";

/**
 * Mobile Bottom Navigation Component
 * Displays navigation tabs at the bottom for mobile devices
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useUserData();

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
      roles: [
        UserRoles.ADMIN,
        UserRoles.SISTEM_MANAGER,
        UserRoles.COURSE_COORDENATOR,
        UserRoles.ACADEMIC_REGISTER,
      ],
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
      roles: [
        UserRoles.ADMIN,
        UserRoles.SISTEM_MANAGER,
        UserRoles.ACADEMIC_REGISTER,
      ],
    },
    {
      title: "Relatórios",
      name: "reports",
      url: "/dashboard/reports",
      icon: AreaChart,
      roles: [
        UserRoles.ADMIN,
        UserRoles.SISTEM_MANAGER,
        UserRoles.COURSE_COORDENATOR,
        UserRoles.ACADEMIC_REGISTER,
      ],
    },
    {
      title: "Auditoria",
      name: "audit",
      url: "/dashboard/audit",
      icon: Shield,
      roles: [UserRoles.ADMIN, UserRoles.SISTEM_MANAGER],
    },
    {
      title: "Backup",
      name: "backup",
      url: "/dashboard/backup",
      icon: Database,
      roles: [UserRoles.ADMIN, UserRoles.SISTEM_MANAGER],
    },
  ];

  // Filter links based on user role
  const visibleLinks = allLinks.filter(
    (link) => user?.role && link.roles.includes(user.role)
  );

  // Show only first 4 links on mobile for better UX
  const mobileLinks = visibleLinks.slice(0, 4);

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === url;
    }
    return pathname.startsWith(url);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.url);

          return (
            <Link
              key={link.name}
              href={link.url}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                active
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all",
                  active && "scale-110"
                )}
              />
              <span className="text-xs font-medium truncate max-w-[60px]">
                {link.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
