import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileText, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { idsmsService } from "@/services/idsms/idsmsService";
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

const RelatoriosIDSMS = () => {
  const { toast } = useToast();
  const [selectedCCA, setSelectedCCA] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { data: filterOptions = { ccas: [], anos: [], meses: [] } } = useQuery({
    queryKey: ['idsms-filter-options'],
    queryFn: idsmsService.getFilterOptions,
    refetchOnWindowFocus: false,
  });

  const { data: dashboardData = [] } = useQuery({
    queryKey: ['idsms-dashboard', selectedCCA, selectedYear, selectedMonth],
    queryFn: () => idsmsService.getDashboardData({
      cca_id: selectedCCA,
      ano: selectedYear,
      mes: selectedMonth
    }),
    refetchOnWindowFocus: false,
  });

  const mesesNomes = {
    1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril',
    5: 'Maio', 6: 'Junho', 7: 'Julho', 8: 'Agosto',
    9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro'
  };

  // Filtrar dados baseado nos filtros selecionados
  const filteredData = dashboardData.filter(item => {
    if (selectedCCA !== "all" && item.cca_id.toString() !== selectedCCA) return false;
    return true;
  });

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Título do relatório
      doc.setFontSize(16);
      doc.text('Relatório IDSMS', 20, 20);
      
      // Informações do filtro
      doc.setFontSize(10);
      let yPosition = 35;
      doc.text(`Data de geração: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}`, 20, yPosition);
      yPosition += 7;
      doc.text(`CCA: ${selectedCCA !== "all" ? filterOptions.ccas.find(c => c.id.toString() === selectedCCA)?.codigo + " - " + filterOptions.ccas.find(c => c.id.toString() === selectedCCA)?.nome : "Todos"}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Ano: ${selectedYear !== "all" ? selectedYear : "Todos os anos"}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Mês: ${selectedMonth !== "all" ? mesesNomes[parseInt(selectedMonth) as keyof typeof mesesNomes] : "Todos os meses"}`, 20, yPosition);
      
      // Resumo
      yPosition += 15;
      doc.setFontSize(12);
      doc.text('Resumo:', 20, yPosition);
      yPosition += 10;
      doc.setFontSize(10);
      doc.text(`Total de CCAs: ${filteredData.length}`, 20, yPosition);
      yPosition += 7;
      doc.text(`IDSMS Médio: ${filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.idsms_total, 0) / filteredData.length).toFixed(1) : "0.0"}%`, 20, yPosition);
      yPosition += 7;
      doc.text(`Melhor IDSMS: ${filteredData.length > 0 ? Math.max(...filteredData.map(item => item.idsms_total)).toFixed(1) : "0.0"}%`, 20, yPosition);
      yPosition += 7;
      doc.text(`CCAs acima de 75%: ${filteredData.filter(item => item.idsms_total > 75).length}`, 20, yPosition);
      
      // Dados detalhados (sem tabela, apenas texto)
      if (filteredData.length > 0) {
        yPosition += 15;
        doc.setFontSize(12);
        doc.text('Dados Detalhados:', 20, yPosition);
        yPosition += 10;
        doc.setFontSize(8);
        
        filteredData.forEach((item, index) => {
          if (yPosition > 270) { // Nova página se necessário
            doc.addPage();
            yPosition = 20;
          }
          
          doc.text(`${index + 1}. ${item.cca_codigo} - ${item.cca_nome}`, 20, yPosition);
          yPosition += 5;
          doc.text(`   IDSMS: ${item.idsms_total.toFixed(1)}% | IID: ${item.iid.toFixed(1)}% | HSA: ${item.hsa.toFixed(1)}% | HT: ${item.ht.toFixed(1)}% | IPOM: ${item.ipom.toFixed(1)}%`, 20, yPosition);
          yPosition += 8;
        });
      }
      
      doc.save(`relatorio-idsms-${format(new Date(), "dd-MM-yyyy")}.pdf`);
      
      toast({
        title: "PDF exportado com sucesso!",
        description: "O relatório foi baixado para seu dispositivo.",
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast({
        title: "Erro ao exportar PDF",
        description: "Ocorreu um erro durante a exportação.",
        variant: "destructive"
      });
    }
  };

  const handleExportExcel = () => {
    try {
      // Criar workbook
      const wb = XLSX.utils.book_new();
      
      // Dados de resumo
      const resumoData = [
        ['Relatório IDSMS'],
        [''],
        ['Data de geração:', format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })],
        ['CCA:', selectedCCA !== "all" ? filterOptions.ccas.find(c => c.id.toString() === selectedCCA)?.codigo + " - " + filterOptions.ccas.find(c => c.id.toString() === selectedCCA)?.nome : "Todos"],
        ['Ano:', selectedYear !== "all" ? selectedYear : "Todos os anos"],
        ['Mês:', selectedMonth !== "all" ? mesesNomes[parseInt(selectedMonth) as keyof typeof mesesNomes] : "Todos os meses"],
        [''],
        ['Resumo:'],
        ['Total de CCAs:', filteredData.length],
        ['IDSMS Médio:', filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.idsms_total, 0) / filteredData.length).toFixed(1) + '%' : "0.0%"],
        ['Melhor IDSMS:', filteredData.length > 0 ? Math.max(...filteredData.map(item => item.idsms_total)).toFixed(1) + '%' : "0.0%"],
        ['CCAs acima de 75%:', filteredData.filter(item => item.idsms_total > 75).length],
        [''],
        ['Dados Detalhados:'],
        ['CCA', 'IDSMS Total (%)', 'IID (%)', 'HSA (%)', 'HT (%)', 'IPOM (%)']
      ];
      
      // Adicionar dados detalhados
      filteredData.forEach(item => {
        resumoData.push([
          `${item.cca_codigo} - ${item.cca_nome}`,
          item.idsms_total.toFixed(1),
          item.iid.toFixed(1),
          item.hsa.toFixed(1),
          item.ht.toFixed(1),
          item.ipom.toFixed(1)
        ]);
      });
      
      const ws = XLSX.utils.aoa_to_sheet(resumoData);
      XLSX.utils.book_append_sheet(wb, ws, 'Relatório IDSMS');
      
      // Exportar arquivo
      XLSX.writeFile(wb, `relatorio-idsms-${format(new Date(), "dd-MM-yyyy")}.xlsx`);
      
      toast({
        title: "Excel exportado com sucesso!",
        description: "O relatório foi baixado para seu dispositivo.",
      });
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      toast({
        title: "Erro ao exportar Excel",
        description: "Ocorreu um erro durante a exportação.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios IDSMS</h2>
          <p className="text-muted-foreground">
            Análise de indicadores IDSMS por período, CCA e tipo de indicador
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">CCA</label>
              <Select value={selectedCCA} onValueChange={setSelectedCCA}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os CCAs</SelectItem>
                  {filterOptions.ccas.map(cca => (
                    <SelectItem key={cca.id} value={cca.id.toString()}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ano</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os anos</SelectItem>
                  {filterOptions.anos.map(ano => (
                    <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mês</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os meses</SelectItem>
                  {filterOptions.meses.map(mes => (
                    <SelectItem key={mes} value={mes.toString()}>
                      {mesesNomes[mes as keyof typeof mesesNomes]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data Início</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data Fim</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo dos Dados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de CCAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
            <p className="text-xs text-gray-500">com dados IDSMS</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">IDSMS Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.length > 0 
                ? (filteredData.reduce((sum, item) => sum + item.idsms_total, 0) / filteredData.length).toFixed(1)
                : "0.0"
              }%
            </div>
            <p className="text-xs text-gray-500">média geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Melhor IDSMS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredData.length > 0 
                ? Math.max(...filteredData.map(item => item.idsms_total)).toFixed(1)
                : "0.0"
              }%
            </div>
            <p className="text-xs text-gray-500">maior indicador</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">CCAs acima de 75%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredData.filter(item => item.idsms_total > 75).length}
            </div>
            <p className="text-xs text-gray-500">acima da meta</p>
          </CardContent>
        </Card>
      </div>

      {/* Opções de Exportação */}
      <Card>
        <CardHeader>
          <CardTitle>Exportar Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleExportPDF}
              className="flex items-center gap-2"
              variant="outline"
            >
              <FileText className="h-4 w-4" />
              Exportar PDF
            </Button>
            
            <Button 
              onClick={handleExportExcel}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Informações do Relatório</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Dados filtrados: {filteredData.length} CCA(s)</li>
              <li>• Período: {selectedYear !== "all" ? selectedYear : "Todos os anos"}</li>
              <li>• CCA: {selectedCCA !== "all" ? filterOptions.ccas.find(c => c.id.toString() === selectedCCA)?.codigo : "Todos"}</li>
              <li>• Inclui todos os indicadores IDSMS (IID, HSA, HT, IPOM, Inspeções, Índice Reativo)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Preview dos Dados */}
      {filteredData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview dos Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">CCA</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">IDSMS Total</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">IID</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">HSA</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">HT</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">IPOM</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, 10).map((item) => (
                    <tr key={item.cca_id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.cca_codigo} - {item.cca_nome}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right font-bold">
                        {item.idsms_total.toFixed(1)}%
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {item.iid.toFixed(1)}%
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {item.hsa.toFixed(1)}%
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {item.ht.toFixed(1)}%
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {item.ipom.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length > 10 && (
                <p className="mt-2 text-sm text-gray-500">
                  Mostrando primeiros 10 registros de {filteredData.length} total.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RelatoriosIDSMS;
