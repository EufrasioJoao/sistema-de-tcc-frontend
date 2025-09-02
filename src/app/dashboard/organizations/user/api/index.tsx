import { api } from "@/lib/api";
import { User } from "@/types/index";

export async function fetchUser(id: string): Promise<User> {
  const url = `/api/users/${id}`;
  const response = await api.get(url);

  if (response.status === 200) {
    return response.data.user as User;
  }
  throw new Error(`Failed to fetch organization users: ${response.statusText}`);
}
