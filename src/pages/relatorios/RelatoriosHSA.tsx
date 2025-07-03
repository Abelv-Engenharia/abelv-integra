
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Mail, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import InspecoesSummaryCards from "@/components/hora-seguranca/InspecoesSummaryCards";
import { InspecoesByCCAChart } from "@/components/hora-seguranca/InspecoesByCCAChart";
import { InspecoesBarChart } from "@/components/hora-seguranca/InspecoesBarChart";
import { DesviosResponsaveisChart } from "@/components/hora-seguranca/DesviosResponsaveisChart";
import { DesviosTipoInspecaoChart } from "@/components/hora-seguranca/DesviosTipoInspecaoChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { toast } from "@/hooks/use-toast";

const RelatoriosHSA = () => {
  const [dataInicial, setDataInicial] = useState<Date>();
  const [dataFinal, setDataFinal] = useState<Date>();
  const [filterCCA, setFilterCCA] = useState("");
  const [filterResponsavel, setFilterResponsavel] = useState("");
  const { data: userCCAs = [] } = useUserCCAs();

  const handleExportPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "O relatório HSA está sendo gerado em PDF...",
    });
    // TODO: Implementar exportação para PDF
  };

  const handleExportExcel = () => {
    toast({
      title: "Exportando Excel", 
      description: "O relatório HSA está sendo gerado em Excel...",
    });
    // TODO: Implementar exportação para Excel
  };

  const handleSendEmail = () => {
    toast({
      title: "Enviando por Email",
      description: "O relatório HSA está sendo enviado por email...",
    });
    // TODO: Implementar envio por email
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Relatório HSA</h2>
          <p className="text-muted-foreground">
            Relatório completo das inspeções de Hora da Segurança
          </p>
        </div>

        {/* Filtros */}
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
                      onSelect={setDataInicial}
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
                      onSelect={setDataFinal}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CCA</label>
                <Select value={filterCCA} onValueChange={setFilterCCA}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os CCAs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
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
                <Select value={filterResponsavel} onValueChange={setFilterResponsavel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleExportPDF} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar PDF
              </Button>
              <Button onClick={handleExportExcel} variant="outline" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Exportar Excel
              </Button>
              <Button onClick={handleSendEmail} variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Enviar por Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo do Relatório */}
        <div className="space-y-6">
          <InspecoesSummaryCards />

          <Card>
            <CardHeader>
              <CardTitle>Inspeções por CCA</CardTitle>
            </CardHeader>
            <CardContent>
              <InspecoesByCCAChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inspeções por Responsável</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <InspecoesBarChart dataType="responsible" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Desvios por Responsável</CardTitle>
            </CardHeader>
            <CardContent>
              <DesviosResponsaveisChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Desvios por Tipo de Inspeção</CardTitle>
            </CardHeader>
            <CardContent>
              <DesviosTipoInspecaoChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosHSA;
