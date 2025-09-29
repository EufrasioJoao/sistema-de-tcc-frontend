"use client";

import { useUserData } from "@/contexts/app-context";
import { TCC } from "@/types/index";
import React from "react";

interface PermissionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  tcc?: TCC;
  // Permission checks
  requireViewTCC?: boolean;
  requireModifyTCC?: boolean;
  requireDeleteTCC?: boolean;
  requireDownloadFile?: boolean;
  requireCreateTCC?: boolean;
  requireManageUsers?: boolean;
  requireManageOrganization?: boolean;
  requireAdmin?: boolean;
  requireSystemManager?: boolean;
  requireCourseCoordinator?: boolean;
  requireAcademicRegister?: boolean;
}

/**
 * PermissionGuard component that conditionally renders children based on user permissions
 * 
 * @param children - Content to render if permission check passes
 * @param fallback - Optional content to render if permission check fails
 * @param tcc - TCC object for TCC-specific permission checks
 * @param require* - Various permission requirements (only one should be true)
 */
export function PermissionGuard({
  children,
  fallback = null,
  tcc,
  requireViewTCC = false,
  requireModifyTCC = false,
  requireDeleteTCC = false,
  requireDownloadFile = false,
  requireCreateTCC = false,
  requireManageUsers = false,
  requireManageOrganization = false,
  requireAdmin = false,
  requireSystemManager = false,
  requireCourseCoordinator = false,
  requireAcademicRegister = false,
}: PermissionGuardProps) {
  const { permissions } = useUserData();

  // Check permissions based on props
  let hasPermission = false;

  if (requireViewTCC) {
    hasPermission = permissions.canViewTCC(tcc);
  } else if (requireModifyTCC) {
    hasPermission = permissions.canModifyTCC(tcc);
  } else if (requireDeleteTCC) {
    hasPermission = permissions.canDeleteTCC(tcc);
  } else if (requireDownloadFile) {
    hasPermission = permissions.canDownloadFile(tcc);
  } else if (requireCreateTCC) {
    hasPermission = permissions.canCreateTCC();
  } else if (requireManageUsers) {
    hasPermission = permissions.canManageUsers();
  } else if (requireManageOrganization) {
    hasPermission = permissions.canManageOrganization();
  } else if (requireAdmin) {
    hasPermission = permissions.isAdmin();
  } else if (requireSystemManager) {
    hasPermission = permissions.isSystemManager();
  } else if (requireCourseCoordinator) {
    hasPermission = permissions.isCourseCoordinator();
  } else if (requireAcademicRegister) {
    hasPermission = permissions.isAcademicRegister();
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

/**
 * Hook to access permission helpers directly in components
 */
export function usePermissions() {
  const { permissions } = useUserData();
  return permissions;
}
