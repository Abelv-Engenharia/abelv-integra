import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOS } from "@/contexts/engenharia-matricial/OSContext";
import { Link } from "react-router-dom";
import { Eye, TrendingUp, Clock, CheckCircle, DollarSign, Target, Calendar, AlertTriangle, History } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ComposedChart, LabelList } from 'recharts';
import { formatarCCAComCliente } from "@/lib/engenharia-matricial/utils";
import { obterHHPorDisciplinaAnual, calcularTotais } from "@/lib/engenharia-matricial/dadosAnuais";

export default function RelatoriosEMEletrica() {
  const { osList, hhHistoricos } = useOS();
  
  // Obter dados consolidados
  const hhPorDisciplinaAnual = obterHHPorDisciplinaAnual(osList);
  
  // Filtrar apenas OS da disciplina elétrica
  const osEletrica = osList.filter(os => (os.disciplina || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === "eletrica");
  
  const statusConfig = {
    "aberta": { label: "Aberta", color: "bg-blue-500", variant: "secondary" as const },
    "em-planejamento": { label: "Em planejamento", color: "bg-orange-500", variant: "outline" as const },
    "aguardando-aceite": { label: "Aguardando aceite", color: "bg-yellow-500", variant: "outline" as const },
    "em-execucao": { label: "Em execução", color: "bg-green-500", variant: "default" as const },
    "aguardando-aceite-fechamento": { label: "Aguardando aceite fechamento", color: "bg-purple-500", variant: "outline" as const },
    "concluida": { label: "Concluída", color: "bg-gray-500", variant: "secondary" as const },
    "cancelada": { label: "Cancelada", color: "bg-red-500", variant: "destructive" as const }
  };

  const capitalizarTexto = (texto: string) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Controle de meta de HH
  const META_HH_MENSAL = 190;
  const META_HH_ANUAL = META_HH_MENSAL * 12;
  const PERCENTUAL_MINIMO = 80;
  
  // Calcular HH apropriadas por mês (baseado nas OS concluídas)
  const hhApropriadasMensal = () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    const osConcluidasMesAtual = osEletrica.filter(os => {
      if (os.status === "concluida" && os.dataConclusao) {
        const dataConclusao = new Date(os.dataConclusao);
        return dataConclusao.getMonth() === mesAtual && dataConclusao.getFullYear() === anoAtual;
      }
      return false;
    });
    
    return osConcluidasMesAtual.reduce((acc, os) => acc + (os.hhPlanejado + (os.hhAdicional || 0)), 0);
  };

  // Calcular HH apropriadas do mês anterior
  const hhApropriadasMesAnterior = () => {
    const hoje = new Date();
    const mesAnterior = hoje.getMonth() === 0 ? 11 : hoje.getMonth() - 1;
    const anoAnterior = hoje.getMonth() === 0 ? hoje.getFullYear() - 1 : hoje.getFullYear();
    
    const osConcluidasMesAnterior = osEletrica.filter(os => {
      if (os.status === "concluida" && os.dataConclusao) {
        const dataConclusao = new Date(os.dataConclusao);
        return dataConclusao.getMonth() === mesAnterior && dataConclusao.getFullYear() === anoAnterior;
      }
      return false;
    });
    
    return osConcluidasMesAnterior.reduce((acc, os) => acc + (os.hhPlanejado + (os.hhAdicional || 0)), 0);
  };
  
  // Calcular HH apropriadas no ano
  const hhApropriadasAnual = osEletrica
    .filter(os => os.status === "concluida" && os.dataConclusao && new Date(os.dataConclusao).getFullYear() === new Date().getFullYear())
    .reduce((acc, os) => acc + (os.hhPlanejado + (os.hhAdicional || 0)), 0);
  
  const hhMesAtual = hhApropriadasMensal();
  const hhMesAnterior = hhApropriadasMesAnterior();
  const percentualMeta = (hhMesAtual / META_HH_MENSAL) * 100;
  const percentualMetaMesAnterior = (hhMesAnterior / META_HH_MENSAL) * 100;
  const saldoAnualNecessario = META_HH_ANUAL - hhApropriadasAnual;
  const mesesRestantes = 12 - (new Date().getMonth() + 1);
  const hhMediaMensalNecessaria = mesesRestantes > 0 ? saldoAnualNecessario / mesesRestantes : 0;
  
  // Nomes dos meses para exibição
  const hoje = new Date();
  const nomeMesAtual = hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const mesAnteriorDate = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
  const nomeMesAnterior = mesAnteriorDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Métricas da disciplina elétrica
  const totalOS = osEletrica.length;
  const osConcluidas = osEletrica.filter(os => os.status === "concluida").length;
  const osEmAndamento = osEletrica.filter(os => ["em-planejamento", "aguardando-aceite", "em-execucao"].includes(os.status)).length;
  const valorTotalOrcado = osEletrica.reduce((acc, os) => acc + os.valorOrcamento, 0);
  const valorTotalFinal = osEletrica.filter(os => os.status === "concluida" && os.valorSAO).reduce((acc, os) => acc + (os.valorSAO || 0), 0);


  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios EM Elétrica</h1>
          <p className="text-muted-foreground">
            Análise e métricas da disciplina elétrica
          </p>
        </div>
      </div>

      {/* Destaque da Meta */}
      <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Meta HH Elétrica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
            {/* Mês Anterior */}
            <div className="border-r pr-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 capitalize">{nomeMesAnterior}</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{hhMesAnterior}h</div>
                  <p className="text-xs text-muted-foreground">HH Apropriadas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{percentualMetaMesAnterior.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">da Meta</p>
                  {percentualMetaMesAnterior >= PERCENTUAL_MINIMO ? (
                    <CheckCircle className="h-3 w-3 text-green-600 mx-auto mt-1" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-destructive mx-auto mt-1" />
                  )}
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{META_HH_MENSAL}h</div>
                  <p className="text-xs text-muted-foreground">Meta</p>
                </div>
              </div>
            </div>

            {/* Mês Atual */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 capitalize">{nomeMesAtual}</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{hhMesAtual}h</div>
                  <p className="text-xs text-muted-foreground">HH Apropriadas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{percentualMeta.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">da Meta</p>
                  {percentualMeta >= PERCENTUAL_MINIMO ? (
                    <CheckCircle className="h-3 w-3 text-green-600 mx-auto mt-1" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-destructive mx-auto mt-1" />
                  )}
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{META_HH_MENSAL}h</div>
                  <p className="text-xs text-muted-foreground">Meta</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">Meta Mínima Mensal: {(META_HH_MENSAL * PERCENTUAL_MINIMO / 100).toFixed(0)}h (80%)</p>
          </div>
        </CardContent>
      </Card>

      {/* HH por CCA Fechados no Mês */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            HH por CCA Fechados
          </CardTitle>
          <CardDescription>Comparativo entre mês anterior e atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mês Anterior */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 capitalize">{nomeMesAnterior}</h3>
              {(() => {
                const hoje = new Date();
                const mesAnterior = hoje.getMonth() === 0 ? 11 : hoje.getMonth() - 1;
                const anoAnterior = hoje.getMonth() === 0 ? hoje.getFullYear() - 1 : hoje.getFullYear();
                
                const osConcluidasMesAnterior = osEletrica.filter(os => {
                  if (os.status === "concluida" && os.dataConclusao) {
                    const dataConclusao = new Date(os.dataConclusao);
                    return dataConclusao.getMonth() === mesAnterior && dataConclusao.getFullYear() === anoAnterior;
                  }
                  return false;
                });

                const hhPorCCA = osConcluidasMesAnterior.reduce((acc, os) => {
                  const ccaDisplay = formatarCCAComCliente(os.cca, os.cliente);
                  const hh = (os.hhPlanejado || 0) + (os.hhAdicional || 0);
                  
                  if (!acc[ccaDisplay]) {
                    acc[ccaDisplay] = { cca: ccaDisplay, hh: 0, quantidade: 0 };
                  }
                  acc[ccaDisplay].hh += hh;
                  acc[ccaDisplay].quantidade += 1;
                  
                  return acc;
                }, {} as Record<string, { cca: string; hh: number; quantidade: number }>);

                const dados = Object.values(hhPorCCA).sort((a, b) => b.hh - a.hh);

                if (dados.length === 0) {
                  return <p className="text-sm text-muted-foreground">Nenhum CCA concluído</p>;
                }

                return (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>CCA</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-right">HH</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dados.map((item) => (
                        <TableRow key={String(item.cca)}>
                          <TableCell className="font-medium">{item.cca}</TableCell>
                          <TableCell className="text-center">{item.quantidade}</TableCell>
                          <TableCell className="text-right font-semibold">{item.hh}h</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell className="text-center font-bold">
                          {dados.reduce((acc, item) => acc + item.quantidade, 0)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {dados.reduce((acc, item) => acc + item.hh, 0)}h
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                );
              })()}
            </div>

            {/* Mês Atual */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 capitalize">{nomeMesAtual}</h3>
              {(() => {
                const hoje = new Date();
                const mesAtual = hoje.getMonth();
                const anoAtual = hoje.getFullYear();
                
                const osConcluidasMesAtual = osEletrica.filter(os => {
                  if (os.status === "concluida" && os.dataConclusao) {
                    const dataConclusao = new Date(os.dataConclusao);
                    return dataConclusao.getMonth() === mesAtual && dataConclusao.getFullYear() === anoAtual;
                  }
                  return false;
                });

                const hhPorCCA = osConcluidasMesAtual.reduce((acc, os) => {
                  const ccaDisplay = formatarCCAComCliente(os.cca, os.cliente);
                  const hh = (os.hhPlanejado || 0) + (os.hhAdicional || 0);
                  
                  if (!acc[ccaDisplay]) {
                    acc[ccaDisplay] = { cca: ccaDisplay, hh: 0, quantidade: 0 };
                  }
                  acc[ccaDisplay].hh += hh;
                  acc[ccaDisplay].quantidade += 1;
                  
                  return acc;
                }, {} as Record<string, { cca: string; hh: number; quantidade: number }>);

                const dados = Object.values(hhPorCCA).sort((a, b) => b.hh - a.hh);

                if (dados.length === 0) {
                  return <p className="text-sm text-muted-foreground">Nenhum CCA concluído</p>;
                }

                return (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>CCA</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-right">HH</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dados.map((item) => (
                        <TableRow key={String(item.cca)}>
                          <TableCell className="font-medium">{item.cca}</TableCell>
                          <TableCell className="text-center">{item.quantidade}</TableCell>
                          <TableCell className="text-right font-semibold">{item.hh}h</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell className="text-center font-bold">
                          {dados.reduce((acc, item) => acc + item.quantidade, 0)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {dados.reduce((acc, item) => acc + item.hh, 0)}h
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de controle de HH */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HH anual</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calcularTotais(osList).totalEletrica}h</div>
            <p className="text-xs text-muted-foreground">
              Meta anual: {META_HH_ANUAL}h ({Math.round((calcularTotais(osList).totalEletrica / META_HH_ANUAL) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo necessário</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{META_HH_ANUAL - calcularTotais(osList).totalEletrica}h</div>
            <p className="text-xs text-muted-foreground">
              Para alcançar meta anual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média necessária</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mesesRestantes > 0 ? Math.ceil((META_HH_ANUAL - calcularTotais(osList).totalEletrica) / mesesRestantes) : 0}h
            </div>
            <p className="text-xs text-muted-foreground">
              {mesesRestantes} meses restantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média mensal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calcularTotais(osList).mediaEletrica}h</div>
            <p className="text-xs text-muted-foreground">
              Média Jan-Set 2025
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Evolução Anual Elétrica (Jan-Set 2025) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            Evolução Anual 2025 - Elétrica
          </CardTitle>
          <CardDescription>Dados históricos de HH apropriadas (Jan-Set 2025)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Acumulado</p>
              <p className="text-2xl font-bold text-blue-600">{calcularTotais(osList).totalEletrica}h</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Média Mensal</p>
              <p className="text-2xl font-bold">{calcularTotais(osList).mediaEletrica}h</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Meta Anual</p>
              <p className="text-2xl font-bold">2280h</p>
              <p className="text-xs text-muted-foreground">
                {Math.round((calcularTotais(osList).totalEletrica / 2280) * 100)}% alcançado
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={hhPorDisciplinaAnual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="eletrica" fill="#3b82f6" name="HH Elétrica">
                <LabelList dataKey="eletrica" position="top" style={{ fontSize: '12px', fontWeight: 'bold' }} />
              </Bar>
              <Line 
                type="monotone" 
                dataKey="meta" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Meta 80% (152 HH/mês)"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>


      {/* Histórico Mensal Jan-Ago */}
      {(() => {
        const historicosEletrica = hhHistoricos.filter(hh => 
          hh.disciplina.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 'eletrica'
        );

        if (historicosEletrica.length === 0) return null;

        // Agrupar por mês
        const meses = ['01/2025', '02/2025', '03/2025', '04/2025', '05/2025', '06/2025', '07/2025', '08/2025'];
        const nomeMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto'];
        
        const dadosPorMes = meses.map((mes, idx) => {
          const hhMes = historicosEletrica.filter(hh => hh.mes === mes);
          const totalHH = hhMes.reduce((acc, hh) => acc + hh.hhApropriado, 0);
          const [mesNum] = mes.split('/');
          const metaPorcentagem = parseInt(mesNum) <= 3 ? 70 : 80;
          const percentualMeta = (totalHH / META_HH_MENSAL) * 100;
          const atingiu = percentualMeta >= metaPorcentagem;
          
          return {
            mes: nomeMeses[idx],
            mesCompleto: mes,
            totalHH,
            metaPorcentagem,
            percentualMeta,
            atingiu
          };
        }).filter(d => d.totalHH > 0);

        if (dadosPorMes.length === 0) return null;

        // Dados para gráfico de pizza
        const dadosPizza = dadosPorMes.map(d => ({
          name: d.mes,
          value: d.totalHH
        }));

        const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6', '#ef4444'];

        return (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600" />
                Histórico Mensal - Janeiro a Agosto 2025
              </CardTitle>
              <CardDescription>Registro histórico de HH apropriado por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cards compactos */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Resumo por Mês</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {dadosPorMes.map((dados) => (
                      <div key={dados.mesCompleto} className="border rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">{dados.mes}</p>
                          <p className="text-lg font-bold text-primary">{dados.totalHH}h</p>
                        </div>
                        {dados.atingiu ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    ✓ Meta atingida | ⚠ Meta não atingida (Jan-Mar: 70% | Abr-Ago: 80%)
                  </p>
                </div>

                {/* Gráfico de Pizza */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Distribuição de HH por Mês</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dadosPizza}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value}h (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dadosPizza.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Gráficos de Resultados Financeiros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Comparativo Mensal - {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <CardDescription>Valores SAO, Engenharia e Suprimentos</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const hoje = new Date();
              const mesAtual = hoje.getMonth();
              const anoAtual = hoje.getFullYear();
              
              const parseCompetencia = (str: string) => {
                const m1 = str.match(/^(\d{4})[-\/](\d{2})$/);
                if (m1) return { month: parseInt(m1[2], 10) - 1, year: parseInt(m1[1], 10) };
                const m2 = str.match(/^(\d{2})[-\/](\d{4})$/);
                if (m2) return { month: parseInt(m2[1], 10) - 1, year: parseInt(m2[2], 10) };
                return null;
              };
              const osDoMes = osEletrica.filter(os => {
                if (os.competencia) {
                  const parsed = parseCompetencia(os.competencia);
                  if (parsed) return parsed.month === mesAtual && parsed.year === anoAtual;
                }
                if (os.dataConclusao) {
                  const dataConclusao = new Date(os.dataConclusao);
                  return dataConclusao.getMonth() === mesAtual && dataConclusao.getFullYear() === anoAtual;
                }
                return false;
              });

              const valorSAO = osDoMes.reduce((acc, os) => acc + (os.valorSAO ?? os.valorOrcamento ?? 0), 0);
              const valorEngenharia = osDoMes.reduce((acc, os) => {
                const eng = os.valorEngenharia ?? (((os.hhPlanejado || 0) + (os.hhAdicional || 0)) * (os.valorHoraHH || 0));
                return acc + (eng || 0);
              }, 0);
              const valorSuprimentos = osDoMes.reduce((acc, os) => acc + (os.valorSuprimentos ?? os.valorFinal ?? 0), 0);

              const dadosGrafico = [
                { categoria: 'SAO', valor: valorSAO },
                { categoria: 'Engenharia', valor: valorEngenharia },
                { categoria: 'Suprimentos', valor: valorSuprimentos }
              ];

              return (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="valor" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </CardContent>
        </Card>

        {/* Gráfico Anual */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Comparativo Anual - {new Date().getFullYear()}
            </CardTitle>
            <CardDescription>Valores SAO, Engenharia e Suprimentos</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const anoAtual = new Date().getFullYear();
              
              const parseCompetencia = (str: string) => {
                const m1 = str.match(/^(\d{4})[-\/](\d{2})$/);
                if (m1) return { month: parseInt(m1[2], 10) - 1, year: parseInt(m1[1], 10) };
                const m2 = str.match(/^(\d{2})[-\/](\d{4})$/);
                if (m2) return { month: parseInt(m2[1], 10) - 1, year: parseInt(m2[2], 10) };
                return null;
              };
              
              const osDoAno = osEletrica.filter(os => {
                if (os.competencia) {
                  const parsed = parseCompetencia(os.competencia);
                  if (parsed) return parsed.year === anoAtual;
                }
                if (os.dataConclusao) {
                  const dataConclusao = new Date(os.dataConclusao);
                  return dataConclusao.getFullYear() === anoAtual;
                }
                return false;
              });

              const valorSAOAno = osDoAno.reduce((acc, os) => acc + (os.valorSAO ?? os.valorOrcamento ?? 0), 0);
              const valorEngenhariaAno = osDoAno.reduce((acc, os) => {
                const eng = os.valorEngenharia ?? (((os.hhPlanejado || 0) + (os.hhAdicional || 0)) * (os.valorHoraHH || 0));
                return acc + (eng || 0);
              }, 0);
              const valorSuprimentosAno = osDoAno.reduce((acc, os) => acc + (os.valorSuprimentos ?? os.valorFinal ?? 0), 0);

              const dadosGrafico = [
                { categoria: 'SAO', valor: valorSAOAno },
                { categoria: 'Engenharia', valor: valorEngenhariaAno },
                { categoria: 'Suprimentos', valor: valorSuprimentosAno }
              ];

              return (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="valor" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Resultados Financeiros - Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Resultados Mensais */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Resultados Mensais - {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const hoje = new Date();
              const mesAtual = hoje.getMonth();
              const anoAtual = hoje.getFullYear();
              
              const parseCompetencia = (str: string) => {
                const m1 = str.match(/^(\d{4})[-\/](\d{2})$/);
                if (m1) return { month: parseInt(m1[2], 10) - 1, year: parseInt(m1[1], 10) };
                const m2 = str.match(/^(\d{2})[-\/](\d{4})$/);
                if (m2) return { month: parseInt(m2[1], 10) - 1, year: parseInt(m2[2], 10) };
                return null;
              };
              const osDoMes = osEletrica.filter(os => {
                if (os.competencia) {
                  const parsed = parseCompetencia(os.competencia);
                  if (parsed) return parsed.month === mesAtual && parsed.year === anoAtual;
                }
                if (os.dataConclusao) {
                  const dataConclusao = new Date(os.dataConclusao);
                  return dataConclusao.getMonth() === mesAtual && dataConclusao.getFullYear() === anoAtual;
                }
                return false;
              });

              const valorTotalMes = osDoMes.reduce((acc, os) => acc + (os.valorOrcamento || 0), 0);
              const valorSAO = osDoMes.reduce((acc, os) => acc + (os.valorSAO ?? os.valorOrcamento ?? 0), 0);
              const valorEngenharia = osDoMes.reduce((acc, os) => {
                const eng = os.valorEngenharia ?? (((os.hhPlanejado || 0) + (os.hhAdicional || 0)) * (os.valorHoraHH || 0));
                return acc + (eng || 0);
              }, 0);
              const valorSuprimentos = osDoMes.reduce((acc, os) => acc + (os.valorSuprimentos ?? os.valorFinal ?? 0), 0);
              
              const percentualSAO = valorTotalMes > 0 ? (valorSAO / valorTotalMes) * 100 : 0;
              const percentualEngenharia = valorTotalMes > 0 ? (valorEngenharia / valorTotalMes) * 100 : 0;
              const percentualSuprimentos = valorTotalMes > 0 ? (valorSuprimentos / valorTotalMes) * 100 : 0;
              const diferencaSAO = percentualSAO - 100;
              const diferencaEngenharia = percentualEngenharia - 100;
              const diferencaSuprimentos = percentualSuprimentos - 100;

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-xl font-bold text-blue-600">{formatCurrency(valorTotalMes)}</div>
                    <p className="text-sm text-muted-foreground">Total OS</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-xl font-bold text-green-600">{formatCurrency(valorSAO)}</div>
                    <p className="text-sm text-muted-foreground">R$ SAO</p>
                    <p className={`text-xs font-semibold ${diferencaSAO >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {diferencaSAO >= 0 ? '+' : ''}{diferencaSAO.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-xl font-bold text-orange-600">{formatCurrency(valorEngenharia)}</div>
                    <p className="text-sm text-muted-foreground">R$ Engenharia</p>
                    <p className={`text-xs font-semibold ${diferencaEngenharia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {diferencaEngenharia >= 0 ? '+' : ''}{diferencaEngenharia.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-xl font-bold text-purple-600">{formatCurrency(valorSuprimentos)}</div>
                    <p className="text-sm text-muted-foreground">R$ Suprimentos</p>
                    <p className={`text-xs font-semibold ${diferencaSuprimentos >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {diferencaSuprimentos >= 0 ? '+' : ''}{diferencaSuprimentos.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Resultados Anuais */}
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Resultados Anuais - {new Date().getFullYear()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const anoAtual = new Date().getFullYear();
              
              const parseCompetencia = (str: string) => {
                const m1 = str.match(/^(\d{4})[-\/](\d{2})$/);
                if (m1) return { month: parseInt(m1[2], 10) - 1, year: parseInt(m1[1], 10) };
                const m2 = str.match(/^(\d{2})[-\/](\d{4})$/);
                if (m2) return { month: parseInt(m2[1], 10) - 1, year: parseInt(m2[2], 10) };
                return null;
              };
              
              const osDoAno = osEletrica.filter(os => {
                if (os.competencia) {
                  const parsed = parseCompetencia(os.competencia);
                  if (parsed) return parsed.year === anoAtual;
                }
                if (os.dataConclusao) {
                  const dataConclusao = new Date(os.dataConclusao);
                  return dataConclusao.getFullYear() === anoAtual;
                }
                return false;
              });

              const valorTotalAno = osDoAno.reduce((acc, os) => acc + (os.valorOrcamento || 0), 0);
              const valorSAOAno = osDoAno.reduce((acc, os) => acc + (os.valorSAO ?? os.valorOrcamento ?? 0), 0);
              const valorEngenhariaAno = osDoAno.reduce((acc, os) => {
                const eng = os.valorEngenharia ?? (((os.hhPlanejado || 0) + (os.hhAdicional || 0)) * (os.valorHoraHH || 0));
                return acc + (eng || 0);
              }, 0);
              const valorSuprimentosAno = osDoAno.reduce((acc, os) => acc + (os.valorSuprimentos ?? os.valorFinal ?? 0), 0);
              
              const percentualSAOAno = valorTotalAno > 0 ? (valorSAOAno / valorTotalAno) * 100 : 0;
              const percentualEngenhariaAno = valorTotalAno > 0 ? (valorEngenhariaAno / valorTotalAno) * 100 : 0;
              const percentualSuprimentosAno = valorTotalAno > 0 ? (valorSuprimentosAno / valorTotalAno) * 100 : 0;
              const diferencaSAOAno = percentualSAOAno - 100;
              const diferencaEngenhariaAno = percentualEngenhariaAno - 100;
              const diferencaSuprimentosAno = percentualSuprimentosAno - 100;

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-xl font-bold text-blue-600">{formatCurrency(valorTotalAno)}</div>
                    <p className="text-sm text-muted-foreground">Total OS</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-xl font-bold text-green-600">{formatCurrency(valorSAOAno)}</div>
                    <p className="text-sm text-muted-foreground">R$ SAO</p>
                    <p className={`text-xs font-semibold ${diferencaSAOAno >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {diferencaSAOAno >= 0 ? '+' : ''}{diferencaSAOAno.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-xl font-bold text-orange-600">{formatCurrency(valorEngenhariaAno)}</div>
                    <p className="text-sm text-muted-foreground">R$ Engenharia</p>
                    <p className={`text-xs font-semibold ${diferencaEngenhariaAno >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {diferencaEngenhariaAno >= 0 ? '+' : ''}{diferencaEngenhariaAno.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-xl font-bold text-purple-600">{formatCurrency(valorSuprimentosAno)}</div>
                    <p className="text-sm text-muted-foreground">R$ Suprimentos</p>
                    <p className={`text-xs font-semibold ${diferencaSuprimentosAno >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {diferencaSuprimentosAno >= 0 ? '+' : ''}{diferencaSuprimentosAno.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Cards de métricas de OS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total OS</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOS}</div>
            <p className="text-xs text-muted-foreground">
              Ordens de serviço elétrica
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{osConcluidas}</div>
            <p className="text-xs text-muted-foreground">
              {totalOS > 0 ? ((osConcluidas / totalOS) * 100).toFixed(1) : 0}% de conclusão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{osEmAndamento}</div>
            <p className="text-xs text-muted-foreground">
              Planejamento + execução
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de OS */}
      <Card>
        <CardHeader>
          <CardTitle>Ordens de serviço - Elétrica</CardTitle>
          <CardDescription>
            Lista completa das OS da disciplina elétrica
          </CardDescription>
        </CardHeader>
        <CardContent>
          {osEletrica.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma OS da disciplina elétrica encontrada.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>OS</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>HH planejado</TableHead>
                  <TableHead>Valor final</TableHead>
                  <TableHead>Data compromissada</TableHead>
                  <TableHead>Responsável EM</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {osEletrica.map((os) => (
                  <TableRow key={os.id}>
                    <TableCell className="font-medium">
                      OS Nº {os.numero || os.id} - CCA {os.cca}
                    </TableCell>
                    <TableCell>{os.cliente}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[os.status as keyof typeof statusConfig]?.variant || "secondary"}>
                        {statusConfig[os.status as keyof typeof statusConfig]?.label || capitalizarTexto(os.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{os.hhPlanejado}h</TableCell>
                    <TableCell>
                      {os.status === "concluida" && os.valorSAO && os.valorSAO > 0 ? (
                        <div>
                          <div className="font-medium">{formatCurrency(os.valorSAO)}</div>
                          <div className="text-xs text-muted-foreground">Custo SAO</div>
                        </div>
                      ) : os.valorOrcamento > 0 ? (
                        <div>
                          <div className="font-medium">{formatCurrency(os.valorOrcamento)}</div>
                          <div className="text-xs text-muted-foreground">Orçamento</div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-amber-600">Não informado</div>
                          <div className="text-xs text-amber-600">Aguardando</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(os.dataCompromissada)}</TableCell>
                    <TableCell>{os.responsavelEM}</TableCell>
                    <TableCell>
                      <Link to={`/os/${os.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}