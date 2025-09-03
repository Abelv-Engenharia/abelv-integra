import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileImage } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { InspecoesByCCAChart } from "@/components/hora-seguranca/InspecoesByCCAChart";
import InspecoesSummaryCards from "@/components/hora-seguranca/InspecoesSummaryCards";
import { DesviosResponsaveisChart } from "@/components/hora-seguranca/DesviosResponsaveisChart";
import { DesviosTipoInspecaoChart } from "@/components/hora-seguranca/DesviosTipoInspecaoChart";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { fetchInspecoesByResponsavel } from "@/services/hora-seguranca/inspecoesByResponsavelService";
import { useToast } from "@/hooks/use-toast";

const RelatoriosHSA = () => {
  const [filterCCA, setFilterCCA] = useState("");
  const [filterResponsavel, setFilterResponsavel] = useState("");
  const [dataInicial, setDataInicial] = useState<Date>();
  const [dataFinal, setDataFinal] = useState<Date>();
  const [responsaveis, setResponsaveis] = useState<string[]>([]);
  const [respData, setRespData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { data: userCCAs = [] } = useUserCCAs();
  const { toast } = useToast();

  // Função para construir filtros aplicados
  const getAppliedFilters = () => {
    return {
      ccaId: filterCCA && filterCCA !== "todos" ? parseInt(filterCCA) : undefined,
      responsavel: filterResponsavel && filterResponsavel !== "todos" ? filterResponsavel : undefined,
      dataInicial: dataInicial ? format(dataInicial, "yyyy-MM-dd") : undefined,
      dataFinal: dataFinal ? format(dataFinal, "yyyy-MM-dd") : undefined,
    };
  };

  // Buscar responsáveis reais da tabela execucao_hsa
  useEffect(() => {
    const fetchResponsaveis = async () => {
      if (userCCAs.length === 0) return;
      const ccaIds = userCCAs.map(cca => cca.id);
      try {
        const { data, error } = await supabase
          .from('execucao_hsa')
          .select('responsavel_inspecao')
          .in('cca_id', ccaIds)
          .not('responsavel_inspecao', 'is', null);
        
        if (error) {
          console.error('Erro ao buscar responsáveis:', error);
          return;
        }

        // Extrair valores únicos e filtrar vazios
        const responsaveisUnicos = [...new Set(data.map(item => item.responsavel_inspecao).filter(Boolean))].sort();
        setResponsaveis(responsaveisUnicos);
      } catch (error) {
        console.error('Erro ao buscar responsáveis:', error);
      }
    };
    fetchResponsaveis();
  }, [userCCAs]);

  // Buscar dados das inspeções por responsável com filtros aplicados
  useEffect(() => {
    const loadRespData = async () => {
      if (userCCAs.length === 0) {
        setRespData([]);
        return;
      }

      try {
        let query = supabase
          .from('execucao_hsa')
          .select('responsavel_inspecao, status')
          .in('cca_id', userCCAs.map(cca => cca.id));

        // Aplicar filtros
        if (filterCCA && filterCCA !== "todos") {
          query = query.eq('cca_id', parseInt(filterCCA));
        }
        
        if (filterResponsavel && filterResponsavel !== "todos") {
          query = query.eq('responsavel_inspecao', filterResponsavel);
        }
        
        if (dataInicial) {
          query = query.gte('data', format(dataInicial, "yyyy-MM-dd"));
        }
        
        if (dataFinal) {
          query = query.lte('data', format(dataFinal, "yyyy-MM-dd"));
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Erro ao buscar dados:', error);
          return;
        }

        // Processar dados por responsável
        const processedData: { [key: string]: any } = {};
        
        data?.forEach(item => {
          const responsavel = item.responsavel_inspecao;
          if (!responsavel) return;
          
          if (!processedData[responsavel]) {
            processedData[responsavel] = {
              "A Realizar": 0,
              "Realizada": 0,
              "Não Realizada": 0,
              "Realizada (Não Programada)": 0,
              "Cancelada": 0
            };
          }
          
          const status = (item.status || '').toUpperCase();
          switch (status) {
            case 'A REALIZAR':
              processedData[responsavel]["A Realizar"]++;
              break;
            case 'REALIZADA':
              processedData[responsavel]["Realizada"]++;
              break;
            case 'NÃO REALIZADA':
              processedData[responsavel]["Não Realizada"]++;
              break;
            case 'REALIZADA (NÃO PROGRAMADA)':
              processedData[responsavel]["Realizada (Não Programada)"]++;
              break;
            case 'CANCELADA':
              processedData[responsavel]["Cancelada"]++;
              break;
          }
        });

        // Converter para formato do gráfico
        const chartData = Object.keys(processedData).map(responsavel => ({
          name: responsavel.split(' ')[0], // Mostrar apenas o primeiro nome
          nomeCompleto: responsavel, // Manter nome completo para tooltip
          ...processedData[responsavel]
        }));

        setRespData(chartData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    
    loadRespData();
  }, [userCCAs, filterCCA, filterResponsavel, dataInicial, dataFinal]);

  // Função para gerar PDF
  const generatePDF = async () => {
    try {
      toast({
        title: "Gerando PDF...",
        description: "Por favor, aguarde enquanto o relatório é gerado.",
      });

      // Aguardar que todos os dados sejam carregados
      const maxWaitTime = 15000; // 15 segundos máximo
      const startTime = Date.now();
      
      while (Date.now() - startTime < maxWaitTime) {
        // Verificar elementos com atributo data-loading
        const loadingElements = document.querySelectorAll('[data-loading="true"]');
        
        // Verificar spinners e elementos de carregamento
        const spinnerElements = document.querySelectorAll('.animate-spin, [role="progressbar"], .loading');
        
        // Verificar textos de carregamento mais específicos
        const carregandoTexts = Array.from(document.querySelectorAll('*')).filter(el => {
          const text = el.textContent?.toLowerCase() || '';
          return text.includes('carregando') || 
                 text.includes('loading') || 
                 text.includes('aguarde') ||
                 text === '' && el.classList.contains('animate-pulse');
        });
        
        // Verificar se existem tabelas vazias ou com dados não carregados
        const emptyTables = Array.from(document.querySelectorAll('table tbody')).filter(tbody => 
          tbody.children.length === 0 || 
          Array.from(tbody.querySelectorAll('td')).some(td => 
            td.textContent?.includes('Nenhum') || td.textContent?.trim() === ''
          )
        );
        
        if (loadingElements.length === 0 && 
            spinnerElements.length === 0 && 
            carregandoTexts.length === 0 && 
            emptyTables.length === 0) {
          break;
        }
        
        // Aguardar 1 segundo antes de verificar novamente
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      
      // Esconder os filtros temporariamente
      const filtersElement = document.querySelector('.grid.gap-4.md\\:grid-cols-2.lg\\:grid-cols-4') as HTMLElement;
      if (filtersElement) {
        filtersElement.style.display = 'none';
      }

      // Criar cabeçalho temporário com logo
      const headerElement = document.createElement('div');
      headerElement.style.padding = '20px';
      headerElement.style.backgroundColor = '#ffffff';
      headerElement.style.borderBottom = '2px solid #e2e8f0';
      headerElement.style.marginBottom = '20px';
      headerElement.style.display = 'flex';
      headerElement.style.alignItems = 'center';
      headerElement.style.justifyContent = 'space-between';
      
      const currentDate = new Date().toLocaleDateString('pt-BR');
      const periodText = dataInicial && dataFinal ? 
        `${format(dataInicial, "dd/MM/yyyy")} a ${format(dataFinal, "dd/MM/yyyy")}` : 
        'Todos os períodos';
      
      headerElement.innerHTML = `
        <div style="display: flex; align-items: center; gap: 20px;">
          <img src="/lovable-uploads/15c114e2-30c1-4767-9fe8-4ee84cc11daf.png" 
               alt="Logo ABELV" 
               style="height: 60px; width: auto;" />
        </div>
        <div style="text-align: center; flex: 1;">
          <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #1e293b;">RELATÓRIO - EXECUÇÃO DA HSA</h1>
          <p style="font-size: 14px; color: #64748b; margin: 10px 0 0 0;">
            Período: ${periodText} | Gerado em: ${currentDate}
          </p>
        </div>
        <div style="width: 80px;"></div>
      `;
      
      // Inserir cabeçalho no início do conteúdo
      const reportContent = reportRef.current;
      if (!reportContent) {
        throw new Error('Conteúdo não encontrado');
      }
      
      reportContent.insertBefore(headerElement, reportContent.firstChild);

      // Aguardar um pouco mais para garantir que tudo foi renderizado
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(reportContent, {
        backgroundColor: '#ffffff',
        scale: 1.5,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: reportContent.scrollWidth,
        height: reportContent.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      // Remover cabeçalho temporário e restaurar filtros
      reportContent.removeChild(headerElement);
      if (filtersElement) {
        filtersElement.style.display = '';
      }

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

      const nomeArquivo = `relatorio-hsa-${new Date().toISOString().split('T')[0]}.pdf`;
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

  // Função para gerar JPEG
  const generateJPEG = async () => {
    try {
      toast({
        title: "Gerando JPEG...",
        description: "Por favor, aguarde enquanto a imagem é gerada.",
      });

      // Aguardar que todos os dados sejam carregados (mesmo código do PDF)
      const maxWaitTime = 15000; // 15 segundos máximo
      const startTime = Date.now();
      
      while (Date.now() - startTime < maxWaitTime) {
        const loadingElements = document.querySelectorAll('[data-loading="true"]');
        const spinnerElements = document.querySelectorAll('.animate-spin, [role="progressbar"], .loading');
        const carregandoTexts = Array.from(document.querySelectorAll('*')).filter(el => {
          const text = el.textContent?.toLowerCase() || '';
          return text.includes('carregando') || 
                 text.includes('loading') || 
                 text.includes('aguarde') ||
                 text === '' && el.classList.contains('animate-pulse');
        });
        
        const emptyTables = Array.from(document.querySelectorAll('table tbody')).filter(tbody => 
          tbody.children.length === 0 || 
          Array.from(tbody.querySelectorAll('td')).some(td => 
            td.textContent?.includes('Nenhum') || td.textContent?.trim() === ''
          )
        );
        
        if (loadingElements.length === 0 && 
            spinnerElements.length === 0 && 
            carregandoTexts.length === 0 && 
            emptyTables.length === 0) {
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const html2canvas = (await import('html2canvas')).default;
      
      // Esconder os filtros temporariamente
      const filtersElement = document.querySelector('.grid.gap-4.md\\:grid-cols-2.lg\\:grid-cols-4') as HTMLElement;
      if (filtersElement) {
        filtersElement.style.display = 'none';
      }

      const content = reportRef.current;
      
      if (!content) {
        throw new Error('Conteúdo não encontrado');
      }

      // Aguardar um pouco mais para garantir que tudo foi renderizado
      await new Promise(resolve => setTimeout(resolve, 1000));

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

      // Restaurar filtros
      if (filtersElement) {
        filtersElement.style.display = '';
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const nomeArquivo = `relatorio-hsa-${new Date().toISOString().split('T')[0]}.jpg`;
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Relatório - Execução da HSA</h2>
          <p className="text-muted-foreground">
            Relatório completo de acompanhamento de inspeções de segurança
          </p>
          {userCCAs.length === 0 && (
            <p className="text-yellow-600">
              Você não possui permissão para visualizar dados de nenhum CCA.
            </p>
          )}
        </div>

        <div className="space-y-4">
          {userCCAs.length > 0 && (
            <div className="flex flex-col space-y-4">
              <div className="flex justify-end gap-2">
                <Button 
                  onClick={generatePDF}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isGenerating ? "Gerando..." : "Gerar PDF"}
                </Button>
                <Button 
                  onClick={generateJPEG}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  {isGenerating ? "Gerando..." : "Gerar JPEG"}
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Select value={filterCCA} onValueChange={setFilterCCA}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por CCA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {userCCAs.map(cca => (
                      <SelectItem key={cca.id} value={cca.id.toString()}>
                        {cca.codigo} - {cca.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterResponsavel} onValueChange={setFilterResponsavel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por Responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {responsaveis.map(responsavel => (
                      <SelectItem key={responsavel} value={responsavel}>
                        {responsavel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal",
                        !dataInicial && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataInicial ? format(dataInicial, "dd/MM/yyyy") : "Data Inicial"}
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

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal",
                        !dataFinal && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataFinal ? format(dataFinal, "dd/MM/yyyy") : "Data Final"}
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
            </div>
          )}

          <div ref={reportRef}>
            {userCCAs.length > 0 && (
              <>
                <InspecoesSummaryCards filters={getAppliedFilters()} />

                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>Inspeções por CCA</CardTitle>
                    <CardDescription>
                      Distribuição de inspeções por centro de custo e status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <InspecoesByCCAChart filters={getAppliedFilters()} />
                  </CardContent>
                </Card>

                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>Inspeções por Responsável</CardTitle>
                    <CardDescription>
                      Distribuição de inspeções por responsável
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2 pb-8">
                    <div className="h-[600px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart
                          data={respData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 160 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            
                            <XAxis
                              type="category"
                              dataKey="name"
                              interval={0}
                              angle={-90}
                              textAnchor="end"
                              height={140}
                              tick={{
                                fontSize: 12,
                              }}
                            />
                        
                            <YAxis type="number" />
                            <Tooltip />
                        
                            <Legend 
                              verticalAlign="bottom" 
                              height={36}
                              wrapperStyle={{
                                paddingTop: '20px'
                              }}
                            />
                        
                            <Bar dataKey="A Realizar" stackId="a" fill="#4285F4" />
                            <Bar dataKey="Realizada" stackId="a" fill="#34A853" />
                            <Bar dataKey="Não Realizada" stackId="a" fill="#EA4335" />
                            <Bar dataKey="Realizada (Não Programada)" stackId="a" fill="#FBBC05" />
                            <Bar dataKey="Cancelada" stackId="a" fill="#9E9E9E" />
                          </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>Desvios por Responsável</CardTitle>
                    <CardDescription>
                      Quantidade de desvios identificados por responsável
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <DesviosResponsaveisChart filters={getAppliedFilters()} />
                  </CardContent>
                </Card>

                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>Desvios por Tipo de Inspeção</CardTitle>
                    <CardDescription>
                      Quantidade de desvios identificados por tipo de inspeção
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2 py-[200px]">
                    <DesviosTipoInspecaoChart filters={getAppliedFilters()} />
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosHSA;