"use client";

import { getSessionData } from "@/app/session";
import { api } from "@/lib/api";
import { User, UserRoles, TCC } from "@/types/index";
import React, { createContext, useContext, useEffect, useState } from "react";

interface PermissionHelpers {
  canViewTCC: (tcc?: TCC) => boolean;
  canModifyTCC: (tcc?: TCC) => boolean;
  canDeleteTCC: (tcc?: TCC) => boolean;
  canDownloadFile: (tcc?: TCC) => boolean;
  canCreateTCC: () => boolean;
  canManageUsers: () => boolean;
  canManageOrganization: () => boolean;
  isAdmin: () => boolean;
  isSystemManager: () => boolean;
  isCourseCoordinator: () => boolean;
  isAcademicRegister: () => boolean;
}

interface AppContextType {
  user: User | null;
  saveUserData: (data: User | null) => Promise<void>;
  permissions: PermissionHelpers;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null as User | null);

  // Permission helper functions
  const permissions: PermissionHelpers = {
    canViewTCC: (tcc?: TCC) => {
      if (!user) return false;
      
      // ADMIN and SISTEM_MANAGER can view all TCCs
      if (user.role === UserRoles.ADMIN || user.role === UserRoles.SISTEM_MANAGER) {
        return true;
      }
      
      // COURSE_COORDENATOR can view TCCs from their coordinated courses
      if (user.role === UserRoles.COURSE_COORDENATOR && tcc?.course?.coordinatorId === user.id) {
        return true;
      }
      
      // ACADEMIC_REGISTER can view all TCCs in their organization
      if (user.role === UserRoles.ACADEMIC_REGISTER) {
        return true;
      }
      
      return false;
    },

    canModifyTCC: (tcc?: TCC) => {
      if (!user) return false;
      
      // ADMIN and SISTEM_MANAGER can modify all TCCs
      if (user.role === UserRoles.ADMIN || user.role === UserRoles.SISTEM_MANAGER) {
        return true;
      }
      
      // COURSE_COORDENATOR can modify TCCs from their coordinated courses
      if (user.role === UserRoles.COURSE_COORDENATOR && tcc?.course?.coordinatorId === user.id) {
        return true;
      }
      
      return false;
    },

    canDeleteTCC: (tcc?: TCC) => {
      if (!user) return false;
      
      // Only ADMIN and SISTEM_MANAGER can delete TCCs
      return user.role === UserRoles.ADMIN || user.role === UserRoles.SISTEM_MANAGER;
    },

    canDownloadFile: (tcc?: TCC) => {
      if (!user) return false;
      
      // All authenticated users can download files (backend will check specific permissions)
      return true;
    },

    canCreateTCC: () => {
      if (!user) return false;
      
      // All authenticated users can create TCCs
      return true;
    },

    canManageUsers: () => {
      if (!user) return false;
      
      // Only ADMIN and SISTEM_MANAGER can manage users
      return user.role === UserRoles.ADMIN || user.role === UserRoles.SISTEM_MANAGER;
    },

    canManageOrganization: () => {
      if (!user) return false;
      
      // Only ADMIN can manage organization
      return user.role === UserRoles.ADMIN;
    },

    isAdmin: () => user?.role === UserRoles.ADMIN,
    isSystemManager: () => user?.role === UserRoles.SISTEM_MANAGER,
    isCourseCoordinator: () => user?.role === UserRoles.COURSE_COORDENATOR,
    isAcademicRegister: () => user?.role === UserRoles.ACADEMIC_REGISTER,
  };

  async function saveUserData(data: User | null) {
    if (data) {
      let _user = { ...user } as unknown as User;
      _user = { ...data };
      setUser(_user);
    }
  }

  async function getUserData() {
    const result = await getSessionData();
    if (!result?.data?.userId) return;

    try {
      const url = `/api/users/${result?.data?.userId}`;
      const response = await api(url);

      if (response.status == 200) {
        const data = response.data?.user as User;
        setUser(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        saveUserData,
        permissions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a AppProvider.");
  }
  return context;
}
