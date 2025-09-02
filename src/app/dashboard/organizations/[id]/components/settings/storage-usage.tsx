"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import {
  CircleCheckBig,
  HardDrive,
  Database,
  AlertTriangle,
} from "lucide-react";
import { Organization } from "@/types/index";

interface StorageUsageProps {
  organization: Organization | null;
}

export function StorageUsage({ organization }: StorageUsageProps) {
  // Calculate storage usage
  const usedStorageBytes = organization?.UsedStorage || 0;

  // Format storage size properly
  const formatStorageSize = (bytes: number) => {
    if (bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);
    // Use 4 decimal places for GB to ensure precision for small usage
    const precision = units[i] === "GB" ? 3 : 2;
    return `${size.toFixed(precision)} ${units[i]}`;
  };
  // Calculate in GB for percentage
  const usedStorageGB = usedStorageBytes / (1024 * 1024 * 1024);
  const totalStorageGB = organization?.plan?.gigabytes || 0;
  const usedStoragePercentage =
    totalStorageGB > 0 ? (usedStorageGB / totalStorageGB) * 100 : 0;
  const remainingStorageGB = Math.max(0, totalStorageGB - usedStorageGB);

  // Format GB values for display
  const formatGBValue = (gb: number) => {
    if (gb < 0.01) {
      return formatStorageSize(gb * 1024 * 1024 * 1024);
    }
    return `${gb.toFixed(2)} GB`;
  };

  // Get color based on usage percentage
  const getUsageColor = () => {
    if (usedStoragePercentage > 90) return "#ef4444"; // Red
    if (usedStoragePercentage > 75) return "#f59e0b"; // Orange
    return "#3b82f6"; // Blue
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-xs overflow-hidden">
      <div className="bg-primary/10 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <HardDrive className="mr-2 h-5 w-5" />
            Armazenamento
          </h3>
          <span className="text-sm text-muted-foreground">
            Plano: {organization?.plan?.name}
          </span>
        </div>
      </div>

      <div className="p-6 pt-4">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="relative h-48 flex items-center justify-center">
            <div
              className="absolute w-36 h-36 rounded-full bg-gray-200"
              style={{
                background: `conic-gradient(${getUsageColor()} ${usedStoragePercentage}%, #e2e8f0 0)`,
              }}
            ></div>
            <div className="relative w-28 h-28 rounded-full bg-background flex flex-col items-center justify-center shadow-inner">
              <span className="text-3xl font-bold text-gray-800">
                {usedStoragePercentage > 0 && usedStoragePercentage < 1
                  ? usedStoragePercentage.toFixed(2)
                  : Math.min(Math.round(usedStoragePercentage), 100)}
                %
              </span>
              <span className="text-sm text-muted-foreground">Utilizado</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Utilizado</span>
              </div>
              <span className="font-semibold">
                {formatStorageSize(usedStorageBytes)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
              <div className="flex items-center gap-3">
                <CircleCheckBig className="h-5 w-5 text-green-500" />
                <span className="font-medium">Disponível</span>
              </div>
              <span className="font-semibold">
                {formatStorageSize(remainingStorageGB * 1024 * 1024 * 1024)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
              <div className="flex items-center gap-3">
                <HardDrive className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Total</span>
              </div>
              <span className="font-semibold">
                {formatGBValue(totalStorageGB)}
              </span>
            </div>

            <div className="pt-2">
              <Progress value={usedStoragePercentage} className="h-2" />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>{formatStorageSize(usedStorageBytes)}</span>
                <span>{formatGBValue(totalStorageGB)}</span>
              </div>
            </div>
          </div>
        </div>

        {usedStoragePercentage > 90 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            <p className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Seu armazenamento está quase cheio. Considere fazer upgrade do seu
              plano.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
