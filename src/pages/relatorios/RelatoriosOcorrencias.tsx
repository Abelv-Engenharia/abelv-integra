
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileImage } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import OcorrenciasSummaryCards from "@/components/ocorrencias/OcorrenciasSummaryCards";
import OcorrenciasByTipoChart from "@/components/ocorrencias/OcorrenciasByTipoChart";
import OcorrenciasByEmpresaChart from "@/components/ocorrencias/OcorrenciasByEmpresaChart";
import OcorrenciasTimelineChart from "@/components/ocorrencias/OcorrenciasTimelineChart";
import TaxaFrequenciaAcCpdChart from "@/components/ocorrencias/TaxaFrequenciaAcCpdChart";
import TaxaFrequenciaAcSpdChart from "@/components/ocorrencias/TaxaFrequenciaAcSpdChart";
import TaxaGravidadeChart from "@/components/ocorrencias/TaxaGravidadeChart";
import OcorrenciasTable from "@/components/ocorrencias/OcorrenciasTable";
import OcorrenciasSimpleFilters from "@/components/ocorrencias/OcorrenciasSimpleFilters";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { OcorrenciasFilterProvider, useOcorrenciasFilter } from "@/contexts/OcorrenciasFilterContext";

const RelatoriosOcorrenciasContent = () => {
  const { data: userCCAs = [] } = useUserCCAs();
  const { year, month, ccaId, clearFilters } = useOcorrenciasFilter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const hasActiveFilters = year !== 'todos' || month !== 'todos' || ccaId !== 'todos';

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
            <title>Relatório de Ocorrências</title>
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
              <h1>Relatório de Ocorrências</h1>
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
        description: "Preparando download..."
      });

      const element = document.getElementById('relatorio-content');
      if (!element) {
        throw new Error('Elemento do relatório não encontrado');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `relatorio-ocorrencias-${new Date().toISOString().split('T')[0]}.jpeg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          toast({
            title: "JPEG gerado com sucesso",
            description: "O download do relatório foi iniciado."
          });
        }
      }, 'image/jpeg', 0.9);

    } catch (error) {
      console.error('Erro ao gerar JPEG:', error);
      toast({
        title: "Erro ao gerar JPEG",
        description: "Ocorreu um erro ao gerar o relatório em JPEG. Tente novamente.",
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
          <h2 className="text-3xl font-bold tracking-tight">Relatório de Ocorrências</h2>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={exportToPDF}
            variant="outline"
            disabled={loading}
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button 
            onClick={exportToJPEG}
            variant="outline"
            disabled={loading}
            size="sm"
          >
            <FileImage className="h-4 w-4 mr-2" />
            JPEG
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        {userCCAs.length > 0 && <OcorrenciasSimpleFilters />}
      </div>
      
      {hasActiveFilters && (
        <div className="bg-slate-50 p-2 rounded-md border border-slate-200">
          <p className="text-sm text-muted-foreground">
            Filtros aplicados - <button className="text-primary underline" onClick={clearFilters}>Limpar filtros</button>
          </p>
        </div>
      )}

      {userCCAs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-yellow-600">Você não possui acesso a nenhum CCA.</p>
        </div>
      ) : (
        <div id="relatorio-content" className="space-y-6">
          <ReportHeader title="RELATÓRIO DE OCORRÊNCIAS" />
          <OcorrenciasSummaryCards />

          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="charts">Gráficos</TabsTrigger>
              <TabsTrigger value="table">Ocorrências Recentes</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ocorrências por Tipo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OcorrenciasByTipoChart />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Ocorrências por Classificação de Risco</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OcorrenciasByEmpresaChart />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Ocorrências por CCA</CardTitle>
                </CardHeader>
                <CardContent>
                  <OcorrenciasTimelineChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Frequência AC CPD</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxaFrequenciaAcCpdChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Frequência AC SPD</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxaFrequenciaAcSpdChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Gravidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxaGravidadeChart />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="table">
              <Card>
                <CardContent className="p-0">
                  <OcorrenciasTable />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>Relatório gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const RelatoriosOcorrencias = () => {
  return (
    <OcorrenciasFilterProvider>
      <RelatoriosOcorrenciasContent />
    </OcorrenciasFilterProvider>
  );
};

export default RelatoriosOcorrencias;
