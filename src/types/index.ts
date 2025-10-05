// --- Enums from Prisma Schema ---
export enum UserRoles {
  ADMIN = "ADMIN",
  SISTEM_MANAGER = "SISTEM_MANAGER",
  COURSE_COORDENATOR = "COURSE_COORDENATOR",
  ACADEMIC_REGISTER = "ACADEMIC_REGISTER",
}

export enum FileType {
  PDF = "PDF",
  SPREADSHEET = "SPREADSHEET",
  DOCUMENT = "DOCUMENT",
}

export enum AccessHistoryAction {
  VIEW_FILE = "VIEW_FILE",
  DOWNLOAD_FILE = "DOWNLOAD_FILE",
  EDIT_FILE = "EDIT_FILE",
  UPLOAD_FILE = "UPLOAD_FILE",
}

export enum TccType {
  BACHELOR = "BACHELOR",
  MASTER = "MASTER",
  DOCTORATE = "DOCTORATE",
}

export enum PermissionAccessLevel {
  VIEW_ONLY = "VIEW_ONLY",
  DOWNLOAD = "DOWNLOAD",
  VIEW_AND_DOWNLOAD = "VIEW_AND_DOWNLOAD",
  UPLOAD = "UPLOAD",
  MANAGE = "MANAGE",
  NO_ACCESS = "NO_ACCESS",
}

// --- Interfaces based on Prisma Models ---

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  password?: string; // Usually not exposed to frontend
  role: UserRoles;
  is_active: boolean;
  last_login_at?: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at?: Date | string | null;
  files?: File[];
  file_access_history?: AccessHistory[];
  permissions?: FilePermission[];
  supervised_tccs?: TCC[];
  coordinated_courses?: Course[];
  organization_id: string;
  organization?: Organization;
}

export interface Organization {
  id: string;
  name: string;
  email?: string | null;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at?: Date | string | null;
  city?: string | null;
  state?: string | null;
  UsedStorage?: number | null;
  files?: File[];
  users?: User[];
}

export interface FilePermission {
  id: string;
  fileId: string;
  userId?: string | null;
  accessLevel: PermissionAccessLevel;
  createdAt: Date | string;
  updatedAt: Date | string;
  file?: File;
  user?: User | null;
}

export interface File {
  id: string;
  filename: string;
  displayName: string;
  size: string;
  type: FileType;
  path?: string | null;
  organization_id: string;
  uploaded_by: string;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at?: Date | string | null;
  access_history?: AccessHistory[];
  permissions?: FilePermission[];
  organization?: Organization;
  uploader?: User;
  tcc?: TCC | null;
  defenseRecordForTcc?: TCC | null;
  // custom fields for UI
  accessLevel?: PermissionAccessLevel;
}

export interface AccessHistory {
  id: string;
  accessed_by: string;
  file_id?: string | null;
  accessed_at?: Date | string | null;
  action_performed: AccessHistoryAction;
  created_at: Date | string;
  updated_at: Date | string;
  user?: User;
  file?: File | null;
}

export interface Course {
  id: string;
  name: string;
  coordinatorId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | null;
  coordinator?: User | null;
  students?: Student[];
  tccs?: TCC[];
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  courseId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | null;
  course?: Course;
  tccs?: TCC[];
}

export interface TCC {
  id: string;
  title: string;
  year: number;
  keywords?: string | null;
  type: TccType;
  authorId: string;
  supervisorId: string;
  courseId: string;
  fileId: string;
  defenseRecordFileId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | null;
  author?: Student;
  supervisor?: User;
  course?: Course;
  file?: File;
  defenseRecordFile?: File | null;
}

// --- Custom Interfaces for UI --- 

export interface Backup {
  id: string;
  filename: string;
  s3_key: string;
  s3_url?: string | null;
  file_size?: number | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  error_message?: string | null;
  started_at: Date | string;
  completed_at?: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
}
