import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Camera, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { 
  fetchDashboardStats, 
  fetchFilteredDashboardStats,
  DashboardStats,
  FilterParams
} from "@/services/desvios/dashboardStatsService";

// Import chart components from the dashboard
import DesviosPieChart from "@/components/desvios/DesviosPieChart";
import DesviosByCompanyChart from "@/components/desvios/DesviosByCompanyChart";
import DesviosClassificationChart from "@/components/desvios/DesviosClassificationChart";
import DesviosByDisciplineChart from "@/components/desvios/DesviosByDisciplineChart";
import DesviosByEventChart from "@/components/desvios/DesviosByEventChart";
import DesviosByProcessoChart from "@/components/desvios/DesviosByProcessoChart";
import DesviosByBaseLegalChart from "@/components/desvios/DesviosByBaseLegalChart";
import { DesviosFiltersProvider } from "@/components/desvios/DesviosFiltersProvider";

// Import filters from dashboard
import DesviosDashboardFilters from "@/components/desvios/DesviosDashboardFilters";
import DesviosDashboardStats from "@/components/desvios/DesviosDashboardStats";

const RelatoriosDesvios = () => {
  const { toast } = useToast();
  const { data: userCCAs = [] } = useUserCCAs();
  
  // Filter states (same as dashboard)
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [ccaId, setCcaId] = useState<string>("");
  const [disciplinaId, setDisciplinaId] = useState<string>("");
  const [empresaId, setEmpresaId] = useState<string>("");
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);
  
  // Stats state
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    indiceDesvios: 0,
    indiceDesviosStatus: 'negativo',
    totalDesvios: 0,
    acoesCompletas: 0,
    acoesAndamento: 0,
    acoesPendentes: 0,
    percentualCompletas: 0,
    percentualAndamento: 0,
    percentualPendentes: 0,
    riskLevel: "Baixo",
  });
  const [loading, setLoading] = useState(true);

  // Function to update dashboard stats
  const updateDashboardStats = async (filters?: FilterParams) => {
    setLoading(true);
    try {
      console.log('Atualizando estatísticas do relatório com filtros:', filters);
      
      if (userCCAs.length === 0) {
        setDashboardStats({
          indiceDesvios: 0,
          indiceDesviosStatus: 'negativo',
          totalDesvios: 0,
          acoesCompletas: 0,
          acoesAndamento: 0,
          acoesPendentes: 0,
          percentualCompletas: 0,
          percentualAndamento: 0,
          percentualPendentes: 0,
          riskLevel: "Baixo",
        });
        return;
      }

      const allowedCcaIds = userCCAs.map(cca => cca.id.toString());
      const finalFilters: FilterParams = {
        ccaIds: allowedCcaIds,
        ...filters
      };
      
      const stats = await fetchFilteredDashboardStats(finalFilters);
      console.log('Estatísticas do relatório atualizadas:', stats);
      setDashboardStats(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas do relatório:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro ao buscar as estatísticas do relatório.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load initial stats
  useEffect(() => {
    updateDashboardStats();
  }, [userCCAs]);

  // Auto-apply filters when they change
  useEffect(() => {
    const applyFiltersAutomatically = async () => {
      try {
        console.log('Aplicando filtros automaticamente no relatório...');
        
        const filters: FilterParams = {};
        
        if (year && year !== "todos") filters.year = year;
        if (month && month !== "todos") filters.month = month;
        if (ccaId && ccaId !== "todos") {
          const allowedCcaIds = userCCAs.map(cca => cca.id.toString());
          if (allowedCcaIds.includes(ccaId)) {
            filters.ccaIds = [ccaId];
          }
        }
        if (disciplinaId && disciplinaId !== "todos") filters.disciplinaId = disciplinaId;
        if (empresaId && empresaId !== "todos") filters.empresaId = empresaId;

        await updateDashboardStats(filters);
        
        const hasFilters = year !== "" || month !== "" || ccaId !== "" || disciplinaId !== "" || empresaId !== "";
        setFiltersApplied(hasFilters);
      } catch (error) {
        console.error('Erro ao aplicar filtros automaticamente no relatório:', error);
      }
    };

    if (userCCAs.length > 0) {
      applyFiltersAutomatically();
    }
  }, [year, month, ccaId, disciplinaId, empresaId, userCCAs]);

  // Clear filters function
  const handleClearFilters = async () => {
    setYear("");
    setMonth("");
    setCcaId("");
    setDisciplinaId("");
    setEmpresaId("");
    setFiltersApplied(false);
    
    try {
      await updateDashboardStats();
      
      toast({
        title: "Filtros limpos",
        description: "Os dados foram restaurados para o estado original.",
      });
    } catch (error) {
      console.error('Erro ao limpar filtros no relatório:', error);
    }
  };

  // Export functions
  const exportToPDF = async () => {
    toast({
      title: "Gerando PDF",
      description: "O relatório está sendo gerado..."
    });

    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      // Get the content to print
      const content = document.getElementById('relatorio-content');
      if (!content) return;

      // Write the content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Relatório de Desvios</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .print-header { text-align: center; margin-bottom: 30px; }
              .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
              .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
              .chart-container { margin-bottom: 30px; page-break-inside: avoid; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>Relatório de Desvios</h1>
              <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            ${content.innerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      
      // Wait a bit then trigger print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        
        toast({
          title: "PDF gerado com sucesso",
          description: "O relatório foi enviado para impressão/download."
        });
      }, 1000);

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o relatório em PDF.",
        variant: "destructive"
      });
    }
  };

  const exportToJPEG = async () => {
    if (loading) {
      toast({
        title: "Aguarde os dados carregarem",
        description: "Por favor, aguarde os gráficos terminarem de carregar antes de exportar.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Gerando JPEG",
      description: "Aguardando gráficos carregarem..."
    });

    try {
      // Wait for charts to fully load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if charts are still loading
      const loadingElements = document.querySelectorAll('[data-loading="true"], .loading');
      if (loadingElements.length > 0) {
        toast({
          title: "Gráficos ainda carregando",
          description: "Aguarde mais um momento e tente novamente.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Capturando imagem",
        description: "Gerando a imagem do relatório..."
      });

      const html2canvas = (await import('html2canvas')).default;
      const content = document.getElementById('relatorio-content');
      
      if (!content) {
        throw new Error('Conteúdo não encontrado');
      }

      const canvas = await html2canvas(content, {
        backgroundColor: '#ffffff',
        scale: 1.2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        height: content.scrollHeight,
        width: content.scrollWidth,
        scrollX: 0,
        scrollY: 0
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `relatorio-desvios-${new Date().toISOString().split('T')[0]}.jpeg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "JPEG gerado com sucesso",
        description: "A imagem foi baixada com sucesso."
      });

    } catch (error) {
      console.error('Erro ao gerar JPEG:', error);
      toast({
        title: "Erro ao gerar JPEG",
        description: "Ocorreu um erro ao gerar a imagem. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const exportToExcel = async () => {
    toast({
      title: "Gerando Excel",
      description: "A planilha está sendo gerada..."
    });

    try {
      // Import XLSX library
      const XLSX = await import('xlsx');
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Create stats worksheet
      const statsData = [
        ['Relatório de Desvios - Estatísticas'],
        [''],
        ['Métrica', 'Valor'],
        ['Total de Desvios', dashboardStats.totalDesvios],
        ['Ações Completas', dashboardStats.acoesCompletas],
        ['Ações em Andamento', dashboardStats.acoesAndamento],
        ['Ações Pendentes', dashboardStats.acoesPendentes],
        ['% Completas', `${dashboardStats.percentualCompletas}%`],
        ['% Em Andamento', `${dashboardStats.percentualAndamento}%`],
        ['% Pendentes', `${dashboardStats.percentualPendentes}%`],
        ['Nível de Risco', dashboardStats.riskLevel],
        [''],
        ['Filtros Aplicados:'],
        ['Ano', year || 'Todos'],
        ['Mês', month || 'Todos'],
        ['CCA', ccaId || 'Todos'],
        ['Disciplina', disciplinaId || 'Todas'],
        ['Empresa', empresaId || 'Todas'],
        [''],
        ['Relatório gerado em:', new Date().toLocaleString('pt-BR')]
      ];
      
      const ws = XLSX.utils.aoa_to_sheet(statsData);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 25 }, // Column A
        { wch: 15 }  // Column B
      ];
      
      XLSX.utils.book_append_sheet(wb, ws, 'Estatísticas');
      
      // Save file
      const fileName = `relatorio-desvios-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast({
        title: "Excel gerado com sucesso",
        description: "A planilha foi baixada com sucesso."
      });

    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
      toast({
        title: "Erro ao gerar Excel",
        description: "Ocorreu um erro ao gerar a planilha. Verifique se a biblioteca está instalada.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/relatorios/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Relatório de Desvios</h2>
        </div>
        
        {/* Export buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={exportToPDF} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button 
            onClick={exportToJPEG} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <Camera className="h-4 w-4 mr-1" />
            JPEG
          </Button>
          <Button 
            onClick={exportToExcel} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            Excel
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <DesviosDashboardFilters 
        year={year} 
        month={month} 
        ccaId={ccaId}
        disciplinaId={disciplinaId}
        empresaId={empresaId}
        setYear={setYear} 
        setMonth={setMonth} 
        setCcaId={setCcaId}
        setDisciplinaId={setDisciplinaId}
        setEmpresaId={setEmpresaId}
        onClearFilters={handleClearFilters}
      />

      {/* Content for export */}
      <div id="relatorio-content">
        {/* Stats cards */}
        <DesviosDashboardStats loading={loading} stats={dashboardStats} />
        
        {/* Charts */}
        <DesviosFiltersProvider
          year={year}
          month={month}
          ccaId={ccaId}
          disciplinaId={disciplinaId}
          empresaId={empresaId}
          userCCAs={userCCAs}
          filtersApplied={filtersApplied}
        >
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <DesviosPieChart />
              <DesviosByDisciplineChart />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <DesviosClassificationChart />
              <DesviosByCompanyChart />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <DesviosByEventChart />
              <DesviosByProcessoChart />
            </div>
            <div className="w-full">
              <DesviosByBaseLegalChart />
            </div>
          </div>
        </DesviosFiltersProvider>
      </div>
      
      {/* Generation info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Relatório gerado em: {new Date().toLocaleString('pt-BR')}</p>
            <p>Dados baseados nos filtros aplicados e CCAs permitidos para o usuário</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosDesvios;