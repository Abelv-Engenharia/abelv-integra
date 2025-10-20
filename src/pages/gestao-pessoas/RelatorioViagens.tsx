import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart, FileSpreadsheet, FileText } from "lucide-react";
import { FaturaIntegra, ReportFilters } from "@/types/gestao-pessoas/travel";
import { ColumnSelector, DEFAULT_COLUMNS } from "@/components/gestao-pessoas/travel/ColumnSelector";
import { ReportFilters as ReportFiltersComponent } from "@/components/gestao-pessoas/travel/ReportFilters";
import { ReportSummary } from "@/components/gestao-pessoas/travel/ReportSummary";
import { DynamicReportTable } from "@/components/gestao-pessoas/travel/DynamicReportTable";
import { exportarRelatorioExcel, exportarRelatorioPDF } from "@/services/DynamicReportExportService";
import { toast } from "sonner";

export default function RelatorioViagens() {
  const [faturas, setFaturas] = useState<FaturaIntegra[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [filters, setFilters] = useState<ReportFilters>({
    dentroPolitica: 'Todas'
  });
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>({
    dentroPolitica: 'Todas'
  });
  const [loading, setLoading] = useState(false);

  // Carregar dados do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("faturas_integra");
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setFaturas(parsedData);
      } catch (error) {
        console.error("Erro ao carregar faturas:", error);
        toast.error("Erro ao carregar dados das faturas");
      }
    }
  }, []);

  // Aplicar filtros aos dados
  const filteredData = useMemo(() => {
    return faturas.filter(fatura => {
      // Filtro de data inicial
      if (appliedFilters.dataInicial && fatura.dataemissaofat < appliedFilters.dataInicial) {
        return false;
      }

      // Filtro de data final
      if (appliedFilters.dataFinal && fatura.dataemissaofat > appliedFilters.dataFinal) {
        return false;
      }

      // Filtro de agência
      if (appliedFilters.agencia && appliedFilters.agencia.length > 0) {
        if (!appliedFilters.agencia.includes(fatura.agencia)) {
          return false;
        }
      }

      // Filtro de tipo
      if (appliedFilters.tipo && appliedFilters.tipo.length > 0) {
        if (!appliedFilters.tipo.includes(fatura.tipo)) {
          return false;
        }
      }

      // Filtro de CCA
      if (appliedFilters.cca && appliedFilters.cca.length > 0) {
        const ccaMatch = appliedFilters.cca.some(cca => 
          fatura.cca?.toLowerCase().includes(cca.toLowerCase())
        );
        if (!ccaMatch) {
          return false;
        }
      }

      // Filtro de viajante
      if (appliedFilters.viajante) {
        if (!fatura.viajante?.toLowerCase().includes(appliedFilters.viajante.toLowerCase())) {
          return false;
        }
      }

      // Filtro de política
      if (appliedFilters.dentroPolitica && appliedFilters.dentroPolitica !== 'Todas') {
        if (fatura.dentrodapolitica !== appliedFilters.dentroPolitica) {
          return false;
        }
      }

      // Filtro de valor mínimo
      if (appliedFilters.valorMinimo !== undefined) {
        if ((fatura.valorpago || 0) < appliedFilters.valorMinimo) {
          return false;
        }
      }

      // Filtro de valor máximo
      if (appliedFilters.valorMaximo !== undefined) {
        if ((fatura.valorpago || 0) > appliedFilters.valorMaximo) {
          return false;
        }
      }

      return true;
    });
  }, [faturas, appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    toast.success("Filtros aplicados com sucesso");
  };

  const handleClearFilters = () => {
    const defaultFilters: ReportFilters = { dentroPolitica: 'Todas' };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    toast.info("Filtros limpos");
  };

  const handleExportExcel = () => {
    if (selectedColumns.length === 0) {
      toast.error("Selecione pelo menos uma coluna para exportar");
      return;
    }

    if (filteredData.length === 0) {
      toast.error("Nenhum dado disponível para exportação");
      return;
    }

    try {
      setLoading(true);
      exportarRelatorioExcel(filteredData, selectedColumns, appliedFilters);
      toast.success("Relatório Excel gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      toast.error("Erro ao gerar relatório Excel");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (selectedColumns.length === 0) {
      toast.error("Selecione pelo menos uma coluna para exportar");
      return;
    }

    if (filteredData.length === 0) {
      toast.error("Nenhum dado disponível para exportação");
      return;
    }

    try {
      setLoading(true);
      exportarRelatorioPDF(filteredData, selectedColumns, appliedFilters);
      toast.success("Relatório PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro ao gerar relatório PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileBarChart className="h-8 w-8" />
          Relatório Dinâmico de Viagens
        </h1>
        <p className="text-muted-foreground mt-1">
          Personalize e exporte relatórios com as informações que você precisa
        </p>
      </div>
      </div>

      {/* Seleção de Colunas */}
      <ColumnSelector
        selectedColumns={selectedColumns}
        onColumnsChange={setSelectedColumns}
      />

      {/* Filtros */}
      <ReportFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Resumo */}
      <ReportSummary
        data={filteredData}
        selectedColumnsCount={selectedColumns.length}
      />

      {/* Preview do Relatório */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preview do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicReportTable
            data={filteredData}
            selectedColumns={selectedColumns}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Botões de Exportação */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={handleExportExcel}
          disabled={loading || selectedColumns.length === 0 || filteredData.length === 0}
          variant="outline"
          size="lg"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar Excel
        </Button>
        <Button
          onClick={handleExportPDF}
          disabled={loading || selectedColumns.length === 0 || filteredData.length === 0}
          variant="outline"
          size="lg"
        >
          <FileText className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
}
