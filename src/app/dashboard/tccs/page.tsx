"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TCCTable } from "./_components/TCCTable";
import { TCCCards } from "./_components/TCCCards";
import { AddTCCDialog } from "./_components/AddTCCDialog";
import { EditTCCDialog } from "./_components/EditTCCDialog";
import { ViewTCCDialog } from "./_components/ViewTCCDialog";
import { DeleteTCCDialog } from "./_components/DeleteTCCDialog";
import { IntelligentSearchDialog } from "./_components/IntelligentSearchDialog";
import { PermissionGuard } from "@/components/PermissionGuard";
import { TCC } from "@/types/index";
import { TCCCharts } from "./_components/TCCCharts";

export default function TCCsPage() {
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [selectedTCC, setSelectedTCC] = useState<TCC | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddTCC = () => {
    setAddDialogOpen(true);
  };

  const handleEditTCC = (tcc: TCC) => {
    setSelectedTCC(tcc);
    setEditDialogOpen(true);
  };

  const handleDeleteTCC = (tcc: TCC) => {
    setSelectedTCC(tcc);
    setDeleteDialogOpen(true);
  };

  const handleViewTCC = (tcc: TCC) => {
    setSelectedTCC(tcc);
    setViewDialogOpen(true);
  };

  const handleSelectTCCFromSearch = (searchResult: any) => {
    // Convert search result to TCC format and open view dialog
    const tcc: TCC = {
      id: searchResult.id,
      title: searchResult.title,
      year: searchResult.year,
      keywords: searchResult.keywords,
      type: searchResult.type,
      authorId: searchResult.authorId || searchResult.author?.id || "",
      supervisorId:
        searchResult.supervisorId || searchResult.supervisor?.id || "",
      courseId: searchResult.courseId || searchResult.course?.id || "",
      fileId: searchResult.fileId || searchResult.file?.id || null,
      defenseRecordFileId:
        searchResult.defenseRecordFileId ||
        searchResult.defenseRecordFile?.id ||
        null,
      createdAt: searchResult.createdAt || new Date().toISOString(),
      updatedAt: searchResult.updatedAt || new Date().toISOString(),
      deletedAt: searchResult.deletedAt || null,
      author: {
        id: searchResult.author.id || "",
        firstName: searchResult.author.firstName,
        lastName: searchResult.author.lastName,
        email: searchResult.author.email || "",
        studentNumber: searchResult.author.studentNumber || "",
        courseId: searchResult.author.courseId || "",
        createdAt: searchResult.author.createdAt || new Date().toISOString(),
        updatedAt: searchResult.author.updatedAt || new Date().toISOString(),
        deletedAt: searchResult.author.deletedAt || null,
      },
      supervisor: searchResult.supervisor,
      course: searchResult.course,
      file: searchResult.file || {
        id: "",
        filename: "",
        displayName: "",
        size: "",
        created_at: new Date().toISOString(),
      },
      defenseRecordFile: searchResult.defenseRecordFile || null,
    };

    setSelectedTCC(tcc);
    setSearchDialogOpen(false);
    setViewDialogOpen(true);
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleTCCAdded = () => {
    triggerRefresh();
    setAddDialogOpen(false);
    toast.success("TCC adicionado com sucesso!");
  };

  const handleTCCUpdated = () => {
    triggerRefresh();
    setEditDialogOpen(false);
    setSelectedTCC(null);
    toast.success("TCC atualizado com sucesso!");
  };

  const handleTCCDeleted = () => {
    triggerRefresh();
    setDeleteDialogOpen(false);
    setSelectedTCC(null);
    toast.success("TCC removido com sucesso!");
  };

  return (
    <motion.div
      className="mx-auto py-6 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full pb-6 border-b border-gray-200 dark:border-slate-700"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Sistema de Gestão de TCCs
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Gerencie trabalhos de conclusão de curso, dissertações e teses
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-wrap">
            <Button
              onClick={() => setSearchDialogOpen(true)}
              variant="outline"
              size="sm"
              className="border-slate-200 dark:border-slate-700   dark:hover:bg-slate-800"
            >
              <Search className="mr-2 h-4 w-4" />
              Busca Inteligente
            </Button>
            <PermissionGuard requireCreateTCC>
              <Button
                onClick={handleAddTCC}
                size="sm"
                className="border-slate-200 dark:border-slate-700   dark:hover:bg-slate-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar TCC
              </Button>
            </PermissionGuard>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <TCCCards refreshTrigger={refreshTrigger} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <TCCCharts refreshTrigger={refreshTrigger} />
      </motion.div>

      {/* TCCs Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <TCCTable
          refreshTrigger={refreshTrigger}
          onEdit={handleEditTCC}
          onDelete={handleDeleteTCC}
          onView={handleViewTCC}
          onAdd={handleAddTCC}
        />
      </motion.div>

      {/* Dialogs */}
      <AddTCCDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onTCCAdded={handleTCCAdded}
      />

      {selectedTCC && (
        <>
          <EditTCCDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            tcc={selectedTCC}
            onTCCUpdated={handleTCCUpdated}
          />

          <DeleteTCCDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            tcc={selectedTCC}
            onTCCDeleted={handleTCCDeleted}
          />

          <ViewTCCDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            tcc={selectedTCC}
          />
        </>
      )}

      {/* Intelligent Search Dialog */}
      <IntelligentSearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        onSelectTCC={handleSelectTCCFromSearch}
      />
    </motion.div>
  );
}
