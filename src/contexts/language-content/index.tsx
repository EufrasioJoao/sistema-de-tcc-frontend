"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { storage } from "@/lib/storage";
import { settingsPage } from "./pages/settings";
import { signInPage } from "./pages/sign-in";
import { logoutPage } from "./pages/logoutPage";
import { dashboardPage } from "./pages/dashboardPage";
import { subscriptionsPage } from "./pages/subscriptionsPage";
import { passwordRecoveryRequestsPage } from "./pages/passwordRecoveryRequestsPage";
import { employeesPage } from "./pages/employeesPage";
import { employeePage } from "./pages/employeePage";
import { sidebar } from "./pages/sidebar";
import { organizationsPage } from "./pages/organizationsPage";
import { organizationPage } from "./pages/organizationPage";
import { usersPage } from "./pages/usersPage";
import { userPage } from "./pages/userPage";
import { addPermissionsDialog } from "./pages/addPermissionsDialog";
import { forgotPasswordPage } from "./pages/forgotPasswordPage";

const translations = {
  pt: {
    ...settingsPage.pt,
    ...signInPage.pt,
    ...logoutPage.pt,
    ...dashboardPage.pt,
    ...subscriptionsPage.pt,
    ...passwordRecoveryRequestsPage.pt,
    ...employeesPage.pt,
    ...employeePage.pt,
    ...sidebar.pt,
    ...organizationsPage.pt,
    ...organizationPage.pt,
    ...usersPage.pt,
    ...userPage.pt,
    ...addPermissionsDialog.pt,
    ...forgotPasswordPage.pt,
    "all-pages.no-result-found": "Nenhum resultado encontrado.",
    "all-pages.folders": "Pastas",

    // Table
    "table.recentTransactions": "Transações Recentes",
    "table.recentTransactionsDescription": "Gerencie suas transações recentes",
    "table.filterById": "Filtrar por ID...",
    "table.filterByPlan": "Filtrar por Plano...",
    "table.columns": "Colunas",
    "table.actions": "Ações",
    "table.copyId": "Copiar ID",
    "table.viewDetails": "Ver detalhes",
    "table.edit": "Editar",
    "table.print": "Imprimir",
    "table.delete": "Excluir",
    "table.plan": "Plano",
    "table.column.id": "ID",
    "table.column.plan": "Plano",
    "table.column.date": "Data",
    "table.column.price": "Preço",
  },
  en: {
    ...settingsPage.en,
    ...signInPage.en,
    ...logoutPage.en,
    ...dashboardPage.en,
    ...subscriptionsPage.en,
    ...passwordRecoveryRequestsPage.en,
    ...employeesPage.en,
    ...employeePage.en,
    ...sidebar.en,
    ...organizationsPage.en,
    ...organizationPage.en,
    ...usersPage.en,
    ...userPage.en,
    ...addPermissionsDialog.en,
    ...forgotPasswordPage.en,
    "all-pages.no-result-found": "No data found.",
    "all-pages.folders": "Folders",

    // Table
    "table.recentTransactions": "Recent Transactions",
    "table.recentTransactionsDescription": "Manage your recent transactions",
    "table.filterById": "Filter by ID...",
    "table.filterByPlan": "Filter by Plan...",
    "table.columns": "Columns",
    "table.actions": "Actions",
    "table.copyId": "Copy ID",
    "table.viewDetails": "View details",
    "table.edit": "Edit",
    "table.print": "Print",
    "table.delete": "Delete",
    "table.plan": "Plan",
    "table.column.id": "ID",
    "table.column.plan": "Plan",
    "table.column.date": "Date",
    "table.column.price": "Price",
  },
};

type Language = "pt" | "en";

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");

  useEffect(() => {
    const savedLanguage = storage.get("language", "pt") as Language;
    setLanguage(savedLanguage);
  }, []);

  const value = {
    language,
    setLanguage: (lang: Language) => {
      setLanguage(lang);
      storage.set("language", lang);
    },
    t: (key: TranslationKey) => translations[language][key] || key,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
