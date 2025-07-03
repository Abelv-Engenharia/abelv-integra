
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Mail, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface HSAFiltersCardProps {
  dataInicial?: Date;
  dataFinal?: Date;
  filterCCA: string;
  filterResponsavel: string;
  onDataInicialChange: (date: Date | undefined) => void;
  onDataFinalChange: (date: Date | undefined) => void;
  onFilterCCAChange: (value: string) => void;
  onFilterResponsavelChange: (value: string) => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onSendEmail: () => void;
}

export function HSAFiltersCard({
  dataInicial,
  dataFinal,
  filterCCA,
  filterResponsavel,
  onDataInicialChange,
  onDataFinalChange,
  onFilterCCAChange,
  onFilterResponsavelChange,
  onExportPDF,
  onExportExcel,
  onSendEmail,
}: HSAFiltersCardProps) {
  const { data: userCCAs = [] } = useUserCCAs();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros do Relatório</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataInicial && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataInicial ? format(dataInicial, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataInicial}
                  onSelect={onDataInicialChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data Final</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataFinal && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataFinal ? format(dataFinal, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataFinal}
                  onSelect={onDataFinalChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">CCA</label>
            <Select value={filterCCA} onValueChange={onFilterCCAChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os CCAs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {userCCAs.map(cca => (
                  <SelectItem key={cca.id} value={cca.id.toString()}>
                    {cca.codigo} - {cca.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Responsável</label>
            <Select value={filterResponsavel} onValueChange={onFilterResponsavelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={onExportPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={onExportExcel} variant="outline" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Exportar Excel
          </Button>
          <Button onClick={onSendEmail} variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Enviar por Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
