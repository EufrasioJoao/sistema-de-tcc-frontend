"use client";

import { getSessionData } from "@/app/session";
import { api } from "@/lib/api";
import { User } from "@/types/index";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AppContextType {
  user: User | null;
  saveUserData: (data: User | null) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null as User | null);

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
