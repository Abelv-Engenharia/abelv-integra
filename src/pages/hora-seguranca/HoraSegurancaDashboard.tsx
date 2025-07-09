
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { InspecoesBarChart } from "@/components/hora-seguranca/InspecoesBarChart";
import { InspecoesByCCAChart } from "@/components/hora-seguranca/InspecoesByCCAChart";
import InspecoesSummaryCards from "@/components/hora-seguranca/InspecoesSummaryCards";
import { RecentInspectionsList } from "@/components/hora-seguranca/RecentInspectionsList";
import { DesviosResponsaveisChart } from "@/components/hora-seguranca/DesviosResponsaveisChart";
import { DesviosTipoInspecaoChart } from "@/components/hora-seguranca/DesviosTipoInspecaoChart";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { fetchInspecoesByResponsavel } from "@/services/hora-seguranca/inspecoesByResponsavelService";

const HoraSegurancaDashboard = () => {
  const [tab, setTab] = useState("overview");
  const [filterCCA, setFilterCCA] = useState("");
  const [filterResponsavel, setFilterResponsavel] = useState("");
  const [dataInicial, setDataInicial] = useState<Date>();
  const [dataFinal, setDataFinal] = useState<Date>();
  const [responsaveis, setResponsaveis] = useState<string[]>([]);
  const [respData, setRespData] = useState<any[]>([]);
  const { data: userCCAs = [] } = useUserCCAs();

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

  // Buscar dados das inspeções por responsável
  useEffect(() => {
    const loadRespData = async () => {
      if (userCCAs.length === 0) {
        setRespData([]);
        return;
      }

      const ccaIds = userCCAs.map(cca => cca.id);
      const responsaveis = await fetchInspecoesByResponsavel(ccaIds);
      
      setRespData(
        responsaveis.map((d: any) => ({
          name: d.responsavel,
          "A Realizar": d["A Realizar"] ?? 0,
          "Realizada": d.realizada ?? 0,
          "Não Realizada": d.nao_realizada ?? 0,
          "Realizada (Não Programada)": d["realizada (não programada)"] ?? 0,
          "Cancelada": d.cancelada ?? 0,
        }))
      );
    };
    loadRespData();
  }, [userCCAs]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Hora da Segurança</h2>
          <p className="text-muted-foreground">
            Dashboard de acompanhamento de inspeções de segurança
          </p>
          {userCCAs.length === 0 && (
            <p className="text-yellow-600">
              Você não possui permissão para visualizar dados de nenhum CCA.
            </p>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-4" value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {userCCAs.length > 0 && (
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
            )}

            {userCCAs.length > 0 && (
              <>
                <InspecoesSummaryCards />

                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>Inspeções por CCA</CardTitle>
                    <CardDescription>
                      Distribuição de inspeções por centro de custo e status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <InspecoesByCCAChart />
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
                    <div className="h-[500px]">
                      <ResponsiveContainer width="100%" height={400}>
                        <ReBarChart
                          data={respData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 100 }} // espaço extra no bottom
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            
                            {/* Nomes no eixo X, rotacionados suavemente */}
                            <XAxis
                              type="category"
                              dataKey="name"
                              tick={{ angle: -25, textAnchor: 'end', fontSize: 12, fill: '#555' }}
                              interval={0}
                              height={80}
                            />
                        
                            <YAxis type="number" />
                            <Tooltip />
                        
                            {/* Agora a legenda vai para baixo */}
                            <Legend verticalAlign="bottom" height={50} />
                        
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
                    <DesviosResponsaveisChart />
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
                    <DesviosTipoInspecaoChart />
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HoraSegurancaDashboard;
