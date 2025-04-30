
import { useState } from "react";
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface DesviosDashboardFiltersProps {
  year: string;
  month: string;
  setYear: (year: string) => void;
  setMonth: (month: string) => void;
  onFilterChange: () => void;
}

const DesviosDashboardFilters = ({
  year,
  month,
  setYear,
  setMonth,
  onFilterChange
}: DesviosDashboardFiltersProps) => {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Filtros</CardTitle>
        <CardDescription>
          Selecione o período para visualizar os dados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid gap-1">
            <label htmlFor="year" className="text-sm font-medium">
              Ano
            </label>
            <Select
              value={year}
              onValueChange={setYear}
            >
              <SelectTrigger id="year" className="w-[120px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={(new Date().getFullYear() - 2).toString()}>{new Date().getFullYear() - 2}</SelectItem>
                <SelectItem value={(new Date().getFullYear() - 1).toString()}>{new Date().getFullYear() - 1}</SelectItem>
                <SelectItem value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <label htmlFor="month" className="text-sm font-medium">
              Mês
            </label>
            <Select
              value={month}
              onValueChange={setMonth}
            >
              <SelectTrigger id="month" className="w-[120px]">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Janeiro</SelectItem>
                <SelectItem value="2">Fevereiro</SelectItem>
                <SelectItem value="3">Março</SelectItem>
                <SelectItem value="4">Abril</SelectItem>
                <SelectItem value="5">Maio</SelectItem>
                <SelectItem value="6">Junho</SelectItem>
                <SelectItem value="7">Julho</SelectItem>
                <SelectItem value="8">Agosto</SelectItem>
                <SelectItem value="9">Setembro</SelectItem>
                <SelectItem value="10">Outubro</SelectItem>
                <SelectItem value="11">Novembro</SelectItem>
                <SelectItem value="12">Dezembro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto">
            <Button onClick={onFilterChange}>
              <Filter className="mr-2 h-4 w-4" />
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesviosDashboardFilters;
