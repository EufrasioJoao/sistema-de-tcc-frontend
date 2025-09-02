import { api } from "@/lib/api";
import { Folder, Organization, User } from "@/types/index";

export async function fetchOrganization(id: string): Promise<Organization> {
  const url = `/api/entities/${id}`;
  const response = await api.get(url);

  if (response.status === 200) {
    return response.data.organization as Organization;
  }
  throw new Error(`Failed to fetch organization data: ${response.statusText}`);
}

export async function fetchOrganizationUsers(id: string): Promise<User[]> {
  const url = `/api/users?organization_id=${id}`;
  const response = await api.get(url);

  if (response.status === 200) {
    return response.data.users as User[];
  }
  throw new Error(`Failed to fetch organization users: ${response.statusText}`);
}

export async function fetchOrganizationFolders(id: string): Promise<Folder[]> {
  const url = `/api/folders/organization/${id}`;
  const response = await api.get(url);

  if (response.status === 200) {
    return response.data.folders as Folder[];
  }
  throw new Error(`Failed to fetch folders: ${response.statusText}`);
}

export async function createFolder(
  organization_id: string,
  name: string,
  parent_folder_id: string | undefined,
  operator_id: string
): Promise<Folder> {
  const url = `/api/folders/create`;
  const body = {
    name,
    parent_folder_id,
    organization_id: organization_id,
    operator_id,
  };

  const response = await api.post(url, body);

  if (response.status === 201) {
    return response.data.folder as Folder;
  }
  throw new Error(`Failed to create folder: ${response.statusText}`);
}

export async function updateFolder(
  folder_id: string,
  name: string
): Promise<Folder> {
  const url = `/api/folders/${folder_id}`;
  const body = { name };

  const response = await api.put(url, body);

  if (response.status === 200) {
    return response.data.folder as Folder;
  }
  throw new Error(`Failed to update folder: ${response.statusText}`);
}

export async function deleteFolder(folder_id: string) {
  const url = `/api/folders/${folder_id}`;

  const response = await api.delete(url);

  if (response.status === 200) {
    const {
      data,
    }: {
      data: {
        success: boolean;
        message: string;
      };
    } = response;
    return data;
  }
  throw new Error(`Failed to delete folder: ${response.statusText}`);
}

export async function deleteFile(file_id: string) {
  const url = `/api/files/${file_id}`;

  const response = await api.delete(url);

  if (response.status === 200) {
    const {
      data,
    }: {
      data: {
        success: boolean;
        message: string;
      };
    } = response;
    return data;
  }
  throw new Error(`Failed to delete file: ${response.statusText}`);
}

export async function moveFile(
  file_id: string,
  new_folder_id: string,
  operator_id: string
) {
  const url = `/api/files/move/${file_id}`;
  const body = { new_folder_id, operator_id };

  const response = await api.put(url, body);

  if (response.status === 200) {
    return response.data;
  }
  throw new Error(`Failed to move file: ${response.statusText}`);
}

export async function moveFolder(
  folder_id: string,
  new_parent_folder_id: string,
  operator_id: string
) {
  const url = `/api/folders/move/${folder_id}`;
  const body = { new_parent_folder_id, operator_id };

  const response = await api.put(url, body);

  if (response.status === 200) {
    return response.data;
  }
  throw new Error(`Failed to move folder: ${response.statusText}`);
}

export async function fetchFolderContent(folderId: string): Promise<Folder> {
  const url = `/api/folders/folder-content/${folderId}`;
  const response = await api.get(url);

  if (response.status === 200) {
    return response.data.folder as Folder;
  }
  throw new Error(`Failed to fetch folder content: ${response.statusText}`);
}
