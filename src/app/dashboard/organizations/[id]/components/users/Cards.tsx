import React from "react";
import { Info } from "lucide-react";
import { useLanguage } from "@/contexts/language-content";

export const Cards = ({
  total_users,
  total_non_admins,
  total_admins,
}: {
  total_users: number;
  total_non_admins: number;
  total_admins: number;
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-4 mb-6 flex-col md:flex-row">
      <Card
        title={t("users-page.total")}
        value={`${total_users}`}
        period={t("users-page.registered")}
      />
      <Card
        title={t("users-page.totalAdmins")}
        value={`${total_admins}`}
        period={t("users-page.admins")}
      />
      <Card
        title={t("users-page.totalNonAdmins")}
        value={`${total_non_admins}`}
        period={t("users-page.totalNonAdmins")}
      />
    </div>
  );
};

const Card = ({
  title,
  value,
  period,
}: {
  title: string;
  value: string;
  period: string;
}) => {
  return (
    <div className="relative flex-1  lg:min-w-[240px] lg:max-w-[320px] overflow-hidden rounded-lg border bg-background p-4 shadow-xs transition-all hover:shadow-md">
      <div className="flex mb-8 items-start justify-between">
        <div>
          <h3 className="text-stone-500 mb-2 text-sm">{title}</h3>
          <p className="text-3xl font-semibold">{value}</p>
        </div>

        <span className="text-xs flex items-center gap-1 font-medium px-2 py-1 rounded-lg bg-green-100 text-green-700">
          <Info className="w-4 h-4" /> {value}
        </span>
      </div>

      <p className="text-xs text-stone-500">{period}</p>
    </div>
  );
};
