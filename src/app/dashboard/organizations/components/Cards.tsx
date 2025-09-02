"use client";

import { useLanguage } from "@/contexts/language-content";
import { GalleryVerticalEnd } from "lucide-react";

export const Cards = ({
  organizations,
  organizations_created_on_this_month,
  organizations_created_on_last_month,
}: {
  organizations: number;
  organizations_created_on_this_month: number;
  organizations_created_on_last_month: number;
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-4 mb-6 flex-col md:flex-row">
      <Card
        title={t("organizations-page.total")}
        value={organizations}
        unit={t("organizations-page.title")}
        description={t("organizations-page.totalNumber")}
        icon={GalleryVerticalEnd}
      />
      <Card
        title={t("organizations-page.createdThisMonth")}
        value={organizations_created_on_this_month}
        unit={t("organizations-page.title")}
        description={t("organizations-page.createdThisMonthDescription")}
        icon={GalleryVerticalEnd}
      />
      <Card
        title={t("organizations-page.createdLastMonth")}
        value={organizations_created_on_last_month}
        unit={t("organizations-page.title")}
        description={t("organizations-page.createdLastMonthDescription")}
        icon={GalleryVerticalEnd}
      />
    </div>
  );
};

interface CardProps {
  title: string;
  value: number;
  unit: string;
  description: string;
  icon: React.ElementType;
}

const Card = ({ title, value, unit, description, icon: Icon }: CardProps) => {
  return (
    <div className="relative flex-1  lg:min-w-[240px] lg:max-w-[320px] overflow-hidden rounded-lg border bg-background p-4 shadow-xs transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold tracking-tight">
            {value}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        <div className="flex items-center gap-1">
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};
