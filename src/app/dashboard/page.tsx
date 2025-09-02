"use client";

import { TopBar } from "./components/TopBar";
import { StatCards } from "./components/StatCards";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loading } from "@/components/Loading";
import { api } from "@/lib/api";

interface Metrics {
  card_data: {
    total_entities: number;
    total_users: number;
    total_operators: number;
  };
  activity_data: {
    activity_of_this_month: {
      date: string;
      foldersCreated: number;
      filesCreated: number;
    }[];
  };
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({} as Metrics);

  async function getDashboardData() {
    setLoading(true);

    try {
      const url = `/api/users/get-dashboard-data`;

      const response = await api(url);

      if (response.status == 200) {
        const data = response.data?.data as Metrics;
        setMetrics(data);
      }
    } catch (error) {
      console.error("Error getting data:", error);
      toast.error("Ocorreu um error ao carregar os dados");
    }

    setLoading(false);
  }

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-lg pb-4">
          <TopBar />
          <div className="">
            <StatCards
              organizations={metrics?.card_data?.total_entities}
              users={metrics?.card_data?.total_users}
              employees={metrics?.card_data?.total_operators}
            />
          </div>
        </div>
      )}
    </>
  );
}
