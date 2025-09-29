"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter, RefreshCw, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AuditFiltersProps {
  filters: {
    userId?: string;
    fileId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  };
  onFiltersChange: (filters: any) => void;
  onRefresh: () => void;
}

export function AuditFilters({ filters, onFiltersChange, onRefresh }: AuditFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined
  );

  const actionOptions = [
    { value: "VIEW_FILE", label: "Visualização" },
    { value: "DOWNLOAD_FILE", label: "Download" },
    { value: "UPLOAD_FILE", label: "Upload" },
    { value: "EDIT_FILE", label: "Edição" },
  ];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleDateChange = (type: 'start' | 'end', date: Date | undefined) => {
    if (type === 'start') {
      setStartDate(date);
      const newFilters = { 
        ...localFilters, 
        startDate: date ? date.toISOString() : undefined 
      };
      setLocalFilters(newFilters);
    } else {
      setEndDate(date);
      const newFilters = { 
        ...localFilters, 
        endDate: date ? date.toISOString() : undefined 
      };
      setLocalFilters(newFilters);
    }
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    setStartDate(undefined);
    setEndDate(undefined);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* User ID Filter */}
          <div className="space-y-2">
            <Label htmlFor="userId">ID do Usuário</Label>
            <Input
              id="userId"
              placeholder="ID do usuário..."
              value={localFilters.userId || ""}
              onChange={(e) => handleFilterChange("userId", e.target.value)}
            />
          </div>

          {/* File ID Filter */}
          <div className="space-y-2">
            <Label htmlFor="fileId">ID do Arquivo</Label>
            <Input
              id="fileId"
              placeholder="ID do arquivo..."
              value={localFilters.fileId || ""}
              onChange={(e) => handleFilterChange("fileId", e.target.value)}
            />
          </div>

          {/* Action Filter */}
          <div className="space-y-2">
            <Label>Tipo de Ação</Label>
            <Select
              value={localFilters.action || ""}
              onValueChange={(value) => handleFilterChange("action", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma ação..." />
              </SelectTrigger>
              <SelectContent>
                {actionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Período</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Início"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => handleDateChange('start', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Fim"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => handleDateChange('end', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-4 border-t">
          <Button onClick={applyFilters} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Aplicar Filtros
          </Button>
          
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
          
          <Button variant="outline" onClick={onRefresh} className="flex items-center gap-2 ml-auto">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
