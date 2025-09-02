import { getSessionData, deleteSession } from "@/app/session";
import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

api.interceptors.request.use(
  async (config) => {
    const response = await getSessionData();

    if (response?.data?.token) {
      config.headers["Authorization"] = `Bearer ${response?.data.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        await deleteSession();
        localStorage.clear();
        console.error("Unauthorized! Redirecting to login..");
        window.location.href = "/auth/signin";
      }
    }

    return Promise.reject(error);
  }
);
