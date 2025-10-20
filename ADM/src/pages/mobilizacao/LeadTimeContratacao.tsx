import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Clock, TrendingDown, TrendingUp, Users, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { differenceInDays, format } from "date-fns";

interface LeadTimeData {
  colaborador_nome: string;
  obra_nome: string;
  primeiro_contato: string;
  envio_docs: string | null;
  cadastro_nydhus: string | null;
  aso_liberado: string | null;
  admissao_realizada: string | null;
  lead_time_total: number;
  status: string;
}

export default function LeadTimeContratacao() {
  const { toast } = useToast();
  const [obraFiltro, setObraFiltro] = useState("todas");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [responsavelFiltro, setResponsavelFiltro] = useState("");
  
  const [dados, setDados] = useState<LeadTimeData[]>([]);
  const [obras, setObras] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const { data, error } = await supabase
        .from("validacao_admissao")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const dadosProcessados: LeadTimeData[] = data.map((item) => {
        const primeiroContato = new Date(item.created_at);
        const admissao = item.data_admissao ? new Date(item.data_admissao) : null;
        
        return {
          colaborador_nome: item.nome_completo,
          obra_nome: item.cca_nome || "Sem obra",
          primeiro_contato: item.created_at,
          envio_docs: item.data_envio,
          cadastro_nydhus: item.nydhus_sync_at,
          aso_liberado: item.data_aso_liberado || null,
          admissao_realizada: item.data_admissao,
          lead_time_total: admissao ? differenceInDays(admissao, primeiroContato) : 0,
          status: item.data_admissao ? "Concluído" : "Em andamento"
        };
      });

      setDados(dadosProcessados);
      
      const obrasUnicas = Array.from(new Set(dadosProcessados.map(d => d.obra_nome)));
      setObras(obrasUnicas);
      
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados de lead time.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const dadosFiltrados = dados.filter(item => {
    if (obraFiltro && obraFiltro !== "todas" && item.obra_nome !== obraFiltro) return false;
    if (statusFiltro && statusFiltro !== "todos" && item.status !== statusFiltro) return false;
    if (dataInicio && new Date(item.primeiro_contato) < new Date(dataInicio)) return false;
    if (dataFim && new Date(item.primeiro_contato) > new Date(dataFim)) return false;
    return true;
  });

  const leadTimeMedio = dadosFiltrados.length > 0
    ? Math.round(dadosFiltrados.reduce((acc, item) => acc + item.lead_time_total, 0) / dadosFiltrados.length)
    : 0;

  const obraComMenorLeadTime = dadosFiltrados.reduce((prev, curr) => 
    (curr.lead_time_total < prev.lead_time_total && curr.lead_time_total > 0) ? curr : prev,
    dadosFiltrados[0] || { obra_nome: "-", lead_time_total: 0 }
  );

  const obraComMaiorLeadTime = dadosFiltrados.reduce((prev, curr) => 
    curr.lead_time_total > prev.lead_time_total ? curr : prev,
    dadosFiltrados[0] || { obra_nome: "-", lead_time_total: 0 }
  );

  const contratacoesConcluidas = dadosFiltrados.filter(d => d.status === "Concluído").length;

  const getSemaforoStatus = (dias: number) => {
    if (dias <= 5) return { color: "bg-green-500", label: "Rápido" };
    if (dias <= 10) return { color: "bg-yellow-500", label: "Moderado" };
    return { color: "bg-red-500", label: "Lento" };
  };

  const calcularDiasEntre = (data1: string | null, data2: string | null) => {
    if (!data1 || !data2) return "-";
    return differenceInDays(new Date(data2), new Date(data1)) + " dias";
  };

  const dadosGraficoBarras = obras.map(obra => {
    const dadosObra = dadosFiltrados.filter(d => d.obra_nome === obra && d.status === "Concluído");
    const media = dadosObra.length > 0
      ? Math.round(dadosObra.reduce((acc, item) => acc + item.lead_time_total, 0) / dadosObra.length)
      : 0;
    return { obra, media };
  }).filter(d => d.media > 0);

  const gerarObservacoes = () => {
    const observacoes: string[] = [];
    
    dadosGraficoBarras.forEach(item => {
      if (item.media > leadTimeMedio + 3) {
        observacoes.push(`A obra ${item.obra} apresenta lead time acima da média. Verificar gargalo no processo.`);
      }
    });

    const emAndamento = dadosFiltrados.filter(d => d.status === "Em andamento");
    const atrasos = emAndamento.filter(d => {
      const dias = differenceInDays(new Date(), new Date(d.primeiro_contato));
      return dias > 10;
    });

    if (atrasos.length > 0) {
      observacoes.push(`${atrasos.length} contratações em andamento há mais de 10 dias. Atenção necessária.`);
    }

    return observacoes;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">LeadTime – Contratação</h1>
        <p className="text-muted-foreground">
          Acompanhamento do tempo entre primeiro contato e contratação efetiva
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="obra">Obra</Label>
              <Select value={obraFiltro} onValueChange={setObraFiltro}>
                <SelectTrigger id="obra">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {obras.map(obra => (
                    <SelectItem key={obra} value={obra}>{obra}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data inicial</Label>
              <Input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data final</Label>
              <Input
                id="dataFim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                placeholder="Nome do responsável"
                value={responsavelFiltro}
                onChange={(e) => setResponsavelFiltro(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LeadTime médio geral</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadTimeMedio} dias</div>
            <p className="text-xs text-muted-foreground">
              Média de tempo de contratação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obra com menor lead time</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{obraComMenorLeadTime.lead_time_total} dias</div>
            <p className="text-xs text-muted-foreground">
              {obraComMenorLeadTime.obra_nome}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obra com maior lead time</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{obraComMaiorLeadTime.lead_time_total} dias</div>
            <p className="text-xs text-muted-foreground">
              {obraComMaiorLeadTime.obra_nome}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratações finalizadas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contratacoesConcluidas}</div>
            <p className="text-xs text-muted-foreground">
              No período selecionado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Linha do Tempo */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline por Colaborador</CardTitle>
          <CardDescription>Detalhamento de cada etapa do processo de contratação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Obra</TableHead>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>1º Contato</TableHead>
                  <TableHead>Envio Docs</TableHead>
                  <TableHead>Cadastro Nydhus</TableHead>
                  <TableHead>ASO Liberado</TableHead>
                  <TableHead>Admissão Realizada</TableHead>
                  <TableHead className="text-right">Lead Time Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosFiltrados.map((item, index) => {
                  const semaforo = getSemaforoStatus(item.lead_time_total);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.obra_nome}</TableCell>
                      <TableCell>{item.colaborador_nome}</TableCell>
                      <TableCell>{item.primeiro_contato ? format(new Date(item.primeiro_contato), "dd/MM/yyyy") : "-"}</TableCell>
                      <TableCell>
                        {item.envio_docs ? format(new Date(item.envio_docs), "dd/MM/yyyy") : "-"}
                        <div className="text-xs text-muted-foreground">
                          {calcularDiasEntre(item.primeiro_contato, item.envio_docs)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.cadastro_nydhus ? format(new Date(item.cadastro_nydhus), "dd/MM/yyyy") : "-"}
                        <div className="text-xs text-muted-foreground">
                          {calcularDiasEntre(item.envio_docs, item.cadastro_nydhus)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.aso_liberado ? format(new Date(item.aso_liberado), "dd/MM/yyyy") : "-"}
                        <div className="text-xs text-muted-foreground">
                          {calcularDiasEntre(item.cadastro_nydhus, item.aso_liberado)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.admissao_realizada ? format(new Date(item.admissao_realizada), "dd/MM/yyyy") : "-"}
                        <div className="text-xs text-muted-foreground">
                          {calcularDiasEntre(item.aso_liberado, item.admissao_realizada)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className={`w-2 h-2 rounded-full ${semaforo.color}`} />
                          <span className="font-semibold">{item.lead_time_total} dias</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={item.status === "Concluído" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tempo Médio por Obra</CardTitle>
            <CardDescription>Lead time médio de contratação (dias)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGraficoBarras}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="obra" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="media" fill="hsl(var(--primary))" name="Dias médios" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Semáforo de Status</CardTitle>
            <CardDescription>Classificação por tempo de contratação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <span className="font-medium">Rápido (até 5 dias)</span>
              </div>
              <Badge variant="secondary">
                {dadosFiltrados.filter(d => d.lead_time_total <= 5).length}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                <span className="font-medium">Moderado (6 a 10 dias)</span>
              </div>
              <Badge variant="secondary">
                {dadosFiltrados.filter(d => d.lead_time_total > 5 && d.lead_time_total <= 10).length}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full" />
                <span className="font-medium">Lento (acima de 10 dias)</span>
              </div>
              <Badge variant="secondary">
                {dadosFiltrados.filter(d => d.lead_time_total > 10).length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observações Automáticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Observações Automáticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gerarObservacoes().length > 0 ? (
            <ul className="space-y-2">
              {gerarObservacoes().map((obs, index) => (
                <li key={index} className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{obs}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Nenhuma observação no momento. Todos os processos estão dentro do esperado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
