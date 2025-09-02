import { api } from "@/lib/api";
import { Organization } from "@/types/index";

export async function fetchOrganizations(): Promise<Organization[]> {
  const url = `/api/entities`;
  const response = await api.get(url);

  if (response.status === 200) {
    return response.data.entities as Organization[];
  }
  throw new Error(`Failed to fetch organization data: ${response.statusText}`);
}

export async function fetchOrganizationCreationHistory(): Promise<
  { date: string; created: number }[]
> {
  const url = `/api/entities/get-organization-creation-history`;
  const response = await api.get(url);

  if (response.status === 200) {
    return response.data.history as { date: string; created: number }[];
  }
  throw new Error(
    `Failed to fetch organization creation history users: ${response.statusText}`
  );
}
