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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from "sonner";

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
          name: responsavel,
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
    if (!reportRef.current) return;

    setIsGenerating(true);
    toast.info("Gerando relatório PDF...");

    try {
      const element = reportRef.current;
      
      // Criar canvas do elemento
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        removeContainer: true,
        imageTimeout: 30000,
        logging: false,
      });

      // Calcular dimensões para PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Adicionar primeira página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Adicionar páginas adicionais se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Salvar PDF
      const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm");
      pdf.save(`relatorio-hsa_${timestamp}.pdf`);
      
      toast.success("Relatório PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar relatório PDF. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para gerar JPEG
  const generateJPEG = async () => {
    if (!reportRef.current) return;

    setIsGenerating(true);
    toast.info("Gerando relatório JPEG...");

    try {
      const element = reportRef.current;
      
      // Criar canvas do elemento
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        removeContainer: true,
        imageTimeout: 30000,
        logging: false,
      });

      // Converter para JPEG e fazer download
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const timestamp = format(new Date(), "dd-MM-yyyy_HH-mm");
        link.download = `relatorio-hsa_${timestamp}.jpeg`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        toast.success("Relatório JPEG gerado com sucesso!");
      }, 'image/jpeg', 0.95);
      
    } catch (error) {
      console.error("Erro ao gerar JPEG:", error);
      toast.error("Erro ao gerar relatório JPEG. Tente novamente.");
    } finally {
      setIsGenerating(false);
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
                              angle={-45}
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