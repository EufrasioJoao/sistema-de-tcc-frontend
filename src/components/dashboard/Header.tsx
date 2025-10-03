"use client";
import React from "react";
import { Menu, User } from "lucide-react";
import { useUserData } from "@/contexts/app-context";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useSidebar } from "@/components/ui/sidebar";

/**
 * Header component for the dashboard
 * Displays user info and navigation options
 * Becomes sticky with background when scrolling
 * Shows a dropdown on user icon click with profile and signout options
 */
const Header: React.FC<{ titleDiv?: React.ReactNode }> = ({ titleDiv }) => {
  const { user } = useUserData();

  // Returns the user's display name (first and last, or just first)
  function userName() {
    if (!user?.first_name) return "Usuário";
    const parts = user.first_name.split(" ");
    return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0];
  }

  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <div className="md:hidden fixed bg-white md:bg-transparent px-5 md:px-0 shadow-sm md:shadow-none md:sticky left-0 top-0 z-50 w-full transition-all duration-300 py-4">
      <div className="flex justify-between">

        <Button
          variant={"secondary"}
          className="border inline-block"
          onClick={() => setOpenMobile(!openMobile)}
        >
          <Menu />
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden lg:flex flex-col items-end">
                <span className="font-medium">{userName()}</span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
            )}
            {/* User dropdown menu using shadcnui */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-10 w-10 rounded-lg overflow-hidden border-2 border-orange-500 flex items-center justify-center cursor-pointer bg-white focus:outline-hidden"
                  aria-label="Abrir menu do usuário"
                  type="button"
                >
                  <User size={20} className="text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard/account" className="w-full">
                    Minha Conta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-primary cursor-pointer ">
                  <Link href="/auth/logout" className="w-full cursor-pointer">
                    Sair
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
