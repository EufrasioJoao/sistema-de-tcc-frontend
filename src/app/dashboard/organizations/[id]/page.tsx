"use client";
import { useState, useEffect, use } from "react";
import { FolderSidebar } from "./components/folder_sidebar";
import { MainContent } from "./components/main_content";
import { Organization, User, Payment } from "@/types/index";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab } from "./components/users";
import { Settings } from "./components/settings";
import { Loading } from "@/components/Loading";
import { Header } from "@/components/header";
import {
  fetchOrganization,
  fetchOrganizationPayments,
  fetchOrganizationUsers,
} from "./api";
import { toast } from "sonner";
import { AddNewUserDialog } from "./dialogs/add-new-user";
import { EditOrganizationAccountDialog } from "./dialogs/edit-organization-acount";
import { useUserData } from "@/contexts/app-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { MakePaymentDialog } from "./dialogs/make-payment";
import { useLanguage } from "@/contexts/language-content";
import { DeleteOrganizationDialog } from "./dialogs/delete-organization";
import { useFolder } from "@/contexts/folder-context";

export default function OrganizationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    view,
    setView,
    setSelectedFile,
    expandedFolders,
    setExpandedFolders,
    sortConfig,
    setSortConfig,
    currentFolder,
    folders,
    selectedFolder,
    filteredFiles,
    onUploadComplete,
    handleDeleteFolder,
    handleDeleteFile,
    handleFolderRename,
    handleBreadcrumbClick,
    handleNavigateBack,
    handleCreateFolder,
    handleFolderClick,
    isFolderLoading,
    getFolders,
  } = useFolder();

  const isMobile = useIsMobile();

  const [isEditOrganizaionDialogOpened, setIsEditOrganizaionDialogOpened] =
    useState(false);
  const [newPaymentDialogOpened, setIsNewPaymentDialogOpened] = useState(false);

  const [organization, setOrganization] = useState(null as Organization | null);
  const [users, setUsers] = useState([] as User[]);
  const [payments, setPayments] = useState([] as Payment[]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [
    isDeleteOrganizationDialogOpened,
    setIsDeleteOrganizationDialogOpened,
  ] = useState(false);
  const { user } = useUserData();
  const { t } = useLanguage();

  const getData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [OrganizationData, UsersData, Payments] = await Promise.all([
        fetchOrganization(id as string),
        fetchOrganizationUsers(id as string),
        fetchOrganizationPayments(id as string),
      ]);

      setOrganization(OrganizationData);
      setUsers(UsersData);
      setPayments(Payments);
    } catch (err) {
      console.error("Error getting data:", err);
      toast.error("Ocorreu um error ao carregar os dados...");
    } finally {
      setLoading(false);
    }
  };

  // Refresh function to reset data
  const handleRefresh = async () => {
    await getData();
    await getFolders();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex-1 h-screen w-full">
      <Header currentPage="organizations" />

      <div className="h-full w-full">
        {loading ? (
          <Loading />
        ) : (
          <Tabs defaultValue="storage" className="h-full">
            <TabsList className="p-4 py-8 w-full border-b md:border-none">
              <TabsTrigger value="storage">
                {t("organization-page.storage")}
              </TabsTrigger>
              {user?.is_admin && (
                <>
                  <TabsTrigger value="users">
                    {t("organization-page.users")}
                  </TabsTrigger>
                  <TabsTrigger value="account_details">
                    {t("organization-page.accountStatus")}
                  </TabsTrigger>
                </>
              )}
            </TabsList>
            <TabsContent value="storage" className="h-screen">
              {isMobile ? (
                <div className="h-[calc(100vh-120px)]">
                  <FolderSidebar
                    folders={folders}
                    selectedFolder={selectedFolder}
                    expandedFolders={expandedFolders}
                    onFolderSelect={(folder: string) => {
                      handleFolderClick(folder);
                    }}
                    onFolderToggle={(folder: string) => {
                      setExpandedFolders((current) =>
                        current.includes(folder)
                          ? current.filter((name) => name !== folder)
                          : [...current, folder]
                      );
                    }}
                    onCreateFolder={handleCreateFolder}
                  />

                  <MainContent
                    organization_id={id}
                    organization={organization}
                    selectedFolder={selectedFolder}
                    files={filteredFiles}
                    view={view}
                    sortConfig={sortConfig}
                    onSortChange={setSortConfig}
                    onViewChange={setView}
                    onFileSelect={setSelectedFile}
                    onCreateFolder={handleCreateFolder}
                    onUploadComplete={onUploadComplete}
                    onDeleteFile={handleDeleteFile}
                    onFolderClick={handleFolderClick}
                    currentFolder={currentFolder}
                    onFolderDelete={handleDeleteFolder}
                    handleFolderRename={handleFolderRename}
                    isFolderLoading={isFolderLoading}
                    onNavigateBack={handleNavigateBack}
                    onBreadcrumbClick={handleBreadcrumbClick}
                  />
                </div>
              ) : (
                <ResizablePanelGroup
                  direction="horizontal"
                  className="h-full overflow-y-scroll"
                >
                  <ResizablePanel
                    defaultSize={20}
                    minSize={15}
                    maxSize={30}
                    className="min-w-[300px]"
                  >
                    <FolderSidebar
                      folders={folders}
                      selectedFolder={selectedFolder}
                      expandedFolders={expandedFolders}
                      onFolderSelect={(folder: string) => {
                        handleFolderClick(folder);
                      }}
                      onFolderToggle={(folder: string) => {
                        setExpandedFolders((current) =>
                          current.includes(folder)
                            ? current.filter((name) => name !== folder)
                            : [...current, folder]
                        );
                      }}
                      onCreateFolder={handleCreateFolder}
                    />
                  </ResizablePanel>

                  <ResizableHandle withHandle />

                  <ResizablePanel defaultSize={80}>
                    <MainContent
                      selectedFolder={selectedFolder}
                      organization={organization}
                      organization_id={id}
                      files={filteredFiles}
                      view={view}
                      sortConfig={sortConfig}
                      onSortChange={setSortConfig}
                      onViewChange={setView}
                      onFileSelect={setSelectedFile}
                      onCreateFolder={handleCreateFolder}
                      onUploadComplete={onUploadComplete}
                      onDeleteFile={handleDeleteFile}
                      onFolderClick={handleFolderClick}
                      onFolderDelete={handleDeleteFolder}
                      currentFolder={currentFolder}
                      handleFolderRename={handleFolderRename}
                      isFolderLoading={isFolderLoading}
                      onNavigateBack={handleNavigateBack}
                      onBreadcrumbClick={handleBreadcrumbClick}
                    />
                  </ResizablePanel>
                </ResizablePanelGroup>
              )}
            </TabsContent>

            <TabsContent value="users" className="h-screen  w-full">
              <UsersTab users={users} setIsDialogOpened={setIsDialogOpened} />
            </TabsContent>

            <TabsContent
              value="account_details"
              className="h-screen p-0 sm:p-4  px-4 sm:px-8"
            >
              {organization && (
                <Settings
                  setIsEditOrganizaionDialogOpened={
                    setIsEditOrganizaionDialogOpened
                  }
                  setIsDeleteOrganizationDialogOpened={
                    setIsDeleteOrganizationDialogOpened
                  }
                  setIsNewPaymentDialogOpened={setIsNewPaymentDialogOpened}
                  organization={organization}
                  handleRefresh={handleRefresh}
                  payments={payments}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <AddNewUserDialog
        handleRefresh={handleRefresh}
        open={isDialogOpened}
        onOpenChange={setIsDialogOpened}
        organization_id={id}
      />
      {organization && (
        <>
          <EditOrganizationAccountDialog
            open={isEditOrganizaionDialogOpened}
            onOpenChange={setIsEditOrganizaionDialogOpened}
            organization={organization}
            handleRefresh={handleRefresh}
          />
          <DeleteOrganizationDialog
            open={isDeleteOrganizationDialogOpened}
            onOpenChange={setIsDeleteOrganizationDialogOpened}
            organization={organization}
          />
          {newPaymentDialogOpened && (
            <MakePaymentDialog
              organizationId={organization?.id}
              closeModal={() => setIsNewPaymentDialogOpened(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
