
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileImage } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { TreinamentosNormativosChart } from "@/components/treinamentos/TreinamentosNormativosChart";
import { TreinamentosSummaryCards } from "@/components/treinamentos/TreinamentosSummaryCards";
import { TreinamentosPorProcessoTable } from "@/components/treinamentos/TreinamentosPorProcessoTable";
import TreinamentosDashboardFilters from "@/components/treinamentos/TreinamentosDashboardFilters";
import ProcessoGeralPieChart from "@/components/treinamentos/ProcessoGeralPieChart";
import { TabelaTreinamentosNormativosVencidos } from "@/components/treinamentos/TabelaTreinamentosNormativosVencidos";
import { useUserCCAs } from "@/hooks/useUserCCAs";

const RelatoriosTreinamentos = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Inicializar com ano atual por padrão
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState<string>(currentYear);
  const [month, setMonth] = useState<string>("todos");
  const [ccaId, setCcaId] = useState<string>("todos");
  const { data: userCCAs = [] } = useUserCCAs();

  // Criar objeto de filtros para passar aos componentes
  const filters = { year, month, ccaId };

  const exportToPDF = async () => {
    try {
      toast({
        title: "Gerando PDF...",
        description: "Por favor, aguarde enquanto o relatório é gerado.",
      });

      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      
      // Criar um elemento temporário com o conteúdo do relatório formatado
      const reportElement = document.createElement('div');
      reportElement.style.backgroundColor = '#ffffff';
      reportElement.style.padding = '20px';
      reportElement.style.fontFamily = 'Arial, sans-serif';
      reportElement.style.width = '794px'; // Largura A4 em px (210mm)
      reportElement.style.position = 'absolute';
      reportElement.style.left = '-9999px';
      
      // Cabeçalho do relatório
      const currentDate = new Date().toLocaleDateString('pt-BR');
      const monthName = month === 'todos' ? 'Todos os meses' : new Date(2024, parseInt(month) - 1).toLocaleDateString('pt-BR', { month: 'long' });
      
      reportElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
          <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #1e293b;">RELATÓRIO DE TREINAMENTOS</h1>
          <p style="font-size: 14px; color: #64748b; margin: 10px 0 0 0;">
            Período: ${monthName} de ${year} | Gerado em: ${currentDate}
          </p>
        </div>
      `;
      
      // Clonar o conteúdo do relatório (sem filtros)
      const reportContent = reportRef.current;
      if (!reportContent) {
        throw new Error('Conteúdo não encontrado');
      }

      // Clonar apenas os componentes que devem aparecer no PDF
      const summaryCards = reportContent.querySelector('[data-summary-cards]');
      const processTable = reportContent.querySelector('[data-process-table]');
      const tabsContent = reportContent.querySelector('[data-tabs-content]');
      
      if (summaryCards) {
        reportElement.appendChild(summaryCards.cloneNode(true));
      }
      if (processTable) {
        reportElement.appendChild(processTable.cloneNode(true));
      }
      if (tabsContent) {
        reportElement.appendChild(tabsContent.cloneNode(true));
      }
      
      document.body.appendChild(reportElement);

      const canvas = await html2canvas(reportElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: 794,
        height: reportElement.scrollHeight
      });

      // Remover o elemento temporário
      document.body.removeChild(reportElement);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10;
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = margin;

      // Primeira página
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - margin * 2);

      // Páginas adicionais se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);
      }

      const nomeArquivo = `relatorio-treinamentos-${year}-${month}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(nomeArquivo);

      toast({
        title: "PDF gerado com sucesso!",
        description: `O arquivo ${nomeArquivo} foi baixado.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o relatório em PDF.",
        variant: "destructive",
      });
    }
  };

  const exportToJPEG = async () => {
    try {
      toast({
        title: "Gerando JPEG...",
        description: "Por favor, aguarde enquanto a imagem é gerada.",
      });

      const html2canvas = (await import('html2canvas')).default;
      const content = reportRef.current;
      
      if (!content) {
        throw new Error('Conteúdo não encontrado');
      }

      const canvas = await html2canvas(content, {
        backgroundColor: '#ffffff',
        scale: 1.5,
        logging: false,
        useCORS: true,
        allowTaint: true,
        height: content.scrollHeight,
        width: content.scrollWidth,
        scrollX: 0,
        scrollY: 0
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const nomeArquivo = `relatorio-treinamentos-${year}-${month}-${new Date().toISOString().split('T')[0]}.jpg`;
        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "JPEG gerado com sucesso!",
          description: `O arquivo ${nomeArquivo} foi baixado.`,
          variant: "default",
        });
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Erro ao gerar JPEG:', error);
      toast({
        title: "Erro ao gerar JPEG",
        description: "Ocorreu um erro ao gerar o relatório em JPEG.",
        variant: "destructive",
      });
    }
  };

  if (userCCAs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Você não possui acesso a nenhum CCA.</p>
        </div>
      </div>
    );
  }

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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Treinamentos</h1>
            <p className="text-muted-foreground">
              Relatório completo com todas as informações sobre os treinamentos da sua organização
            </p>
          </div>
        </div>
        
        {/* Export buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={exportToPDF} 
            variant="outline" 
            size="sm"
            className="hidden sm:flex"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button 
            onClick={exportToJPEG} 
            variant="outline" 
            size="sm"
            className="hidden sm:flex"
          >
            <FileImage className="h-4 w-4 mr-2" />
            JPEG
          </Button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-6">
        <TreinamentosDashboardFilters 
          year={year} 
          setYear={setYear} 
          month={month} 
          setMonth={setMonth} 
          ccaId={ccaId} 
          setCcaId={setCcaId} 
        />

        <div data-summary-cards>
          <TreinamentosSummaryCards filters={filters} />
        </div>

        <div data-process-table>
          <TreinamentosPorProcessoTable filters={filters} />
        </div>

        <div data-tabs-content>
          <Tabs defaultValue="execucao" className="space-y-4">
            <TabsList>
              <TabsTrigger value="execucao">Registros de Execução</TabsTrigger>
              <TabsTrigger value="normativos">Treinamentos Normativos</TabsTrigger>
            </TabsList>

            <TabsContent value="execucao" className="space-y-4">
              <div className="flex flex-col gap-4">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>PROCESSO - GERAL</CardTitle>
                    <CardDescription>
                      Distribuição geral dos processos de treinamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] flex items-center justify-center">
                    <ProcessoGeralPieChart filters={filters} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="normativos" className="w-full px-0">
              <div className="w-full overflow-x-auto">
                <div className="flex flex-col w-full gap-4 min-w-[700px] max-w-full">
                  {/* Card do gráfico */}
                  <Card className="w-full max-w-full">
                    <CardHeader>
                      <CardTitle>Status dos Treinamentos Normativos</CardTitle>
                      <CardDescription>
                        Visão geral do status dos treinamentos normativos
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[320px]">
                      <TreinamentosNormativosChart filters={filters} />
                    </CardContent>
                  </Card>
                  {/* Card da tabela vencidos */}
                  <Card className="w-full max-w-full">
                    <CardContent className="p-0">
                      <TabelaTreinamentosNormativosVencidos />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosTreinamentos;
