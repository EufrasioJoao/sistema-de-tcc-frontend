"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/main_sidebar";
import { Loading } from "@/components/Loading";
import { Header } from "@/components/header";
import { AddNewOrganizationDialog } from "./dialogs/add_new_organization";
import { DataTableDemo } from "./components/table";
import { Cards } from "./components/Cards";
import { OrganizationCreationHistoryChart } from "./charts/OrganizationCreationHistory";
import { Building2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Organization } from "@/types/index";
import { Alert } from "@/components/ui/alert";
import { fetchOrganizationCreationHistory, fetchOrganizations } from "./api";
import { useUserData } from "@/contexts/app-context";
import { useLanguage } from "@/contexts/language-content";

export default function OrganizationsPage() {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationsCreationHistory, setOrganizationsCreationHistory] =
    useState([] as { date: string; created: number }[]);
  const router = useRouter();
  const { user } = useUserData();
  const { t } = useLanguage();
  const [hasPermission, setHasPermission] = useState(false);

  async function checkPermission() {
    if (user?.is_admin) {
      setHasPermission(true);
      return;
    }
  }

  useEffect(() => {
    checkPermission();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const [OrganizationsData, OrganizationsCreationHistoryData] =
        await Promise.all([
          fetchOrganizations(),
          fetchOrganizationCreationHistory(),
        ]);

      setOrganizations(OrganizationsData);
      setOrganizationsCreationHistory(OrganizationsCreationHistoryData);
    } catch (err) {
      console.error("Error getting data:", err);
      toast.error("Ocorreu um error ao carregar os dados");
    } finally {
      setLoading(false);
    }
  };

  async function handleRefresh() {
    await getData();
  }
  function countOrganizationsCreatedThisMonth(
    org: typeof organizations
  ): number {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based (Jan = 0, Dec = 11)

    return org.filter((organization) => {
      const createdDate = new Date(organization.created_at);
      return (
        createdDate.getFullYear() === currentYear &&
        createdDate.getMonth() === currentMonth
      );
    }).length;
  }

  function countOrganizationsCreatedLastMonth(
    org: typeof organizations
  ): number {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based (Jan = 0, Dec = 11)

    // Calculate the last month and its year
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    return org.filter((organization) => {
      const createdDate = new Date(organization.created_at);
      return (
        createdDate.getFullYear() === lastMonthYear &&
        createdDate.getMonth() === lastMonth
      );
    }).length;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("add-org") === "true") {
        setIsDialogOpened(true);
      }
    }

    getData();
  }, []);

  return (
    <SidebarProvider>
      <MainSidebar currentPage="organizations" />
      <div className="w-full min-h-screen bg-background overflow-y-scroll">
        <Header currentPage="organizations" />

        {loading ? (
          <Loading />
        ) : (
          <div className="flex-1 space-y-8 p-5 sm:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2 gap-4 flex-wrap">
              <div>
                <h2 className="text-xl  font-bold tracking-tight flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  {t("organizations-page.title")}
                </h2>
                <p className="text-muted-foreground">
                  {t("organizations-page.manageDescription")}
                </p>
              </div>
              {hasPermission && (
                <Button
                  onClick={() => setIsDialogOpened(true)}
                  className="text-sm gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t("organizations-page.addClient")}
                </Button>
              )}
            </div>

            {/* Cards Section */}
            <Cards
              organizations={organizations?.length}
              organizations_created_on_this_month={countOrganizationsCreatedThisMonth(
                organizations
              )}
              organizations_created_on_last_month={countOrganizationsCreatedLastMonth(
                organizations
              )}
            />

            {/* Main Content */}
            <div className="gap-6">
              {organizations.length > 0 ? (
                <div className="rounded-xl sm:border bg-card sm:p-6">
                  <DataTableDemo
                    router={router}
                    organizations={organizations}
                  />
                </div>
              ) : (
                <Alert variant="info">
                  {t("organizations-page.no-clients-warning")}
                </Alert>
              )}
              {organizationsCreationHistory?.length > 0 && (
                <div className="my-8 w-full rounded-xl sm:border bg-card sm:p-6 ">
                  <h3 className="text-lg font-medium">
                    {t("organizations-page.history")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("organizations-page.historyDescription")}
                  </p>
                  <OrganizationCreationHistoryChart
                    data={organizationsCreationHistory}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {isDialogOpened && (
          <AddNewOrganizationDialog
            handleRefresh={handleRefresh}
            closeModal={() => setIsDialogOpened(false)}
          />
        )}
      </div>
    </SidebarProvider>
  );
}
