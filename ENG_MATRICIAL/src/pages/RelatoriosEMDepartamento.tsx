import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOS } from "@/contexts/OSContext";
import { Target, CheckCircle, AlertTriangle, Calendar, TrendingUp, History } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, LabelList, Line } from 'recharts';
import { formatarCCAComCliente } from "@/lib/utils";
import { obterHHPorDisciplinaAnual, calcularTotais } from "@/lib/dadosAnuais";

export default function RelatoriosEMDepartamento() {
  const { osList, hhHistoricos } = useOS();
  
  // Obter dados consolidados
  const hhPorDisciplinaAnual = obterHHPorDisciplinaAnual(osList);
  
  // Filtrar OS por disciplina
  const osEletrica = osList.filter(os => (os.disciplina || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === "eletrica");
  const osMecanica = osList.filter(os => (os.disciplina || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === "mecanica");
  
  // Metas
  const META_HH_MENSAL_POR_DISCIPLINA = 190;
  const META_HH_ANUAL_POR_DISCIPLINA = META_HH_MENSAL_POR_DISCIPLINA * 12;
  const META_HH_MENSAL_DEPARTAMENTO = META_HH_MENSAL_POR_DISCIPLINA * 2;
  const META_HH_ANUAL_DEPARTAMENTO = META_HH_ANUAL_POR_DISCIPLINA * 2;
  const PERCENTUAL_MINIMO = 80;

  // Datas
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
  const anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
  
  const nomeMesAtual = hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const mesAnteriorDate = new Date(anoAnterior, mesAnterior, 1);
  const nomeMesAnterior = mesAnteriorDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Função para calcular HH de uma disciplina em um mês/ano específico
  const calcularHHMes = (osDisciplina: typeof osList, mes: number, ano: number) => {
    return osDisciplina
      .filter(os => {
        if (os.status === "concluida" && os.dataConclusao) {
          const dataConclusao = new Date(os.dataConclusao);
          return dataConclusao.getMonth() === mes && dataConclusao.getFullYear() === ano;
        }
        return false;
      })
      .reduce((acc, os) => acc + (os.hhPlanejado || 0) + (os.hhAdicional || 0), 0);
  };

  // Função para calcular HH de uma disciplina no ano
  const calcularHHAno = (osDisciplina: typeof osList) => {
    return osDisciplina
      .filter(os => os.status === "concluida" && os.dataConclusao && new Date(os.dataConclusao).getFullYear() === anoAtual)
      .reduce((acc, os) => acc + (os.hhPlanejado || 0) + (os.hhAdicional || 0), 0);
  };

  // HH por disciplina
  const hhEletricaMesAnterior = calcularHHMes(osEletrica, mesAnterior, anoAnterior);
  const hhEletricaMesAtual = calcularHHMes(osEletrica, mesAtual, anoAtual);
  const hhEletricaAnual = calcularHHAno(osEletrica);

  const hhMecanicaMesAnterior = calcularHHMes(osMecanica, mesAnterior, anoAnterior);
  const hhMecanicaMesAtual = calcularHHMes(osMecanica, mesAtual, anoAtual);
  const hhMecanicaAnual = calcularHHAno(osMecanica);

  // HH Departamento
  const hhDepartamentoMesAnterior = hhEletricaMesAnterior + hhMecanicaMesAnterior;
  const hhDepartamentoMesAtual = hhEletricaMesAtual + hhMecanicaMesAtual;
  const hhDepartamentoAnual = hhEletricaAnual + hhMecanicaAnual;

  // Percentuais
  const percEletricaMesAnterior = (hhEletricaMesAnterior / META_HH_MENSAL_POR_DISCIPLINA) * 100;
  const percEletricaMesAtual = (hhEletricaMesAtual / META_HH_MENSAL_POR_DISCIPLINA) * 100;
  const percMecanicaMesAnterior = (hhMecanicaMesAnterior / META_HH_MENSAL_POR_DISCIPLINA) * 100;
  const percMecanicaMesAtual = (hhMecanicaMesAtual / META_HH_MENSAL_POR_DISCIPLINA) * 100;
  const percDepartamentoMesAnterior = (hhDepartamentoMesAnterior / META_HH_MENSAL_DEPARTAMENTO) * 100;
  const percDepartamentoMesAtual = (hhDepartamentoMesAtual / META_HH_MENSAL_DEPARTAMENTO) * 100;

  // Saldo e meses restantes
  const mesesRestantes = 12 - (mesAtual + 1);
  const saldoEletrica = META_HH_ANUAL_POR_DISCIPLINA - hhEletricaAnual;
  const saldoMecanica = META_HH_ANUAL_POR_DISCIPLINA - hhMecanicaAnual;
  const saldoDepartamento = META_HH_ANUAL_DEPARTAMENTO - hhDepartamentoAnual;
  const mediaEletrica = mesesRestantes > 0 ? saldoEletrica / mesesRestantes : 0;
  const mediaMecanica = mesesRestantes > 0 ? saldoMecanica / mesesRestantes : 0;
  const mediaDepartamento = mesesRestantes > 0 ? saldoDepartamento / mesesRestantes : 0;

  // Volume de OS por CCA - mês anterior
  const ccaMesAnterior: Record<string, { cca: string; eletrica: number; mecanica: number; qtdEletrica: number; qtdMecanica: number }> = {};
  
  [...osEletrica, ...osMecanica].forEach(os => {
    if (os.status === "concluida" && os.dataConclusao) {
      const dataConclusao = new Date(os.dataConclusao);
      if (dataConclusao.getMonth() === mesAnterior && dataConclusao.getFullYear() === anoAnterior) {
        const ccaDisplay = formatarCCAComCliente(os.cca, os.cliente);
        const hh = (os.hhPlanejado || 0) + (os.hhAdicional || 0);
        const disc = (os.disciplina || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        if (!ccaMesAnterior[ccaDisplay]) {
          ccaMesAnterior[ccaDisplay] = { cca: ccaDisplay, eletrica: 0, mecanica: 0, qtdEletrica: 0, qtdMecanica: 0 };
        }
        
        if (disc === "eletrica") {
          ccaMesAnterior[ccaDisplay].eletrica += hh;
          ccaMesAnterior[ccaDisplay].qtdEletrica += 1;
        } else if (disc === "mecanica") {
          ccaMesAnterior[ccaDisplay].mecanica += hh;
          ccaMesAnterior[ccaDisplay].qtdMecanica += 1;
        }
      }
    }
  });

  // Volume de OS por CCA - mês atual
  const ccaMesAtual: Record<string, { cca: string; eletrica: number; mecanica: number; qtdEletrica: number; qtdMecanica: number }> = {};
  
  [...osEletrica, ...osMecanica].forEach(os => {
    if (os.status === "concluida" && os.dataConclusao) {
      const dataConclusao = new Date(os.dataConclusao);
      if (dataConclusao.getMonth() === mesAtual && dataConclusao.getFullYear() === anoAtual) {
        const ccaDisplay = formatarCCAComCliente(os.cca, os.cliente);
        const hh = (os.hhPlanejado || 0) + (os.hhAdicional || 0);
        const disc = (os.disciplina || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        if (!ccaMesAtual[ccaDisplay]) {
          ccaMesAtual[ccaDisplay] = { cca: ccaDisplay, eletrica: 0, mecanica: 0, qtdEletrica: 0, qtdMecanica: 0 };
        }
        
        if (disc === "eletrica") {
          ccaMesAtual[ccaDisplay].eletrica += hh;
          ccaMesAtual[ccaDisplay].qtdEletrica += 1;
        } else if (disc === "mecanica") {
          ccaMesAtual[ccaDisplay].mecanica += hh;
          ccaMesAtual[ccaDisplay].qtdMecanica += 1;
        }
      }
    }
  });

  const dadosCCAMesAnterior = Object.values(ccaMesAnterior).sort((a, b) => (b.eletrica + b.mecanica) - (a.eletrica + a.mecanica));
  const dadosCCAMesAtual = Object.values(ccaMesAtual).sort((a, b) => (b.eletrica + b.mecanica) - (a.eletrica + a.mecanica));

  // Dados para gráfico de comparativo de disciplinas
  const dadosComparativo = [
    {
      mes: nomeMesAnterior.split(' ')[0],
      Elétrica: hhEletricaMesAnterior,
      Mecânica: hhMecanicaMesAnterior,
      Meta: META_HH_MENSAL_POR_DISCIPLINA
    },
    {
      mes: nomeMesAtual.split(' ')[0],
      Elétrica: hhEletricaMesAtual,
      Mecânica: hhMecanicaMesAtual,
      Meta: META_HH_MENSAL_POR_DISCIPLINA
    }
  ];

  // Dados para gráfico de pizza - setembro
  const dadosPizzaSetembro = dadosCCAMesAtual.map((item) => ({
    name: item.cca,
    value: item.eletrica + item.mecanica,
    percentage: ((item.eletrica + item.mecanica) / hhDepartamentoMesAtual * 100).toFixed(1)
  }));

  const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6', '#ef4444'];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios EM Departamento</h1>
          <p className="text-muted-foreground">
            Consolidado Engenharia Matricial - Elétrica e Mecânica
          </p>
        </div>
      </div>

      {/* Meta Geral do Departamento */}
      <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Panorama de Metas - Departamento EM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
            {/* Mês Anterior */}
            <div className="border-r pr-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 capitalize">{nomeMesAnterior}</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{hhDepartamentoMesAnterior}h</div>
                  <p className="text-xs text-muted-foreground">HH Apropriadas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{percDepartamentoMesAnterior.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">da Meta</p>
                  {percDepartamentoMesAnterior >= PERCENTUAL_MINIMO ? (
                    <CheckCircle className="h-3 w-3 text-green-600 mx-auto mt-1" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-destructive mx-auto mt-1" />
                  )}
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{META_HH_MENSAL_DEPARTAMENTO}h</div>
                  <p className="text-xs text-muted-foreground">Meta</p>
                </div>
              </div>
            </div>

            {/* Mês Atual */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 capitalize">{nomeMesAtual}</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{hhDepartamentoMesAtual}h</div>
                  <p className="text-xs text-muted-foreground">HH Apropriadas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{percDepartamentoMesAtual.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">da Meta</p>
                  {percDepartamentoMesAtual >= PERCENTUAL_MINIMO ? (
                    <CheckCircle className="h-3 w-3 text-green-600 mx-auto mt-1" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-destructive mx-auto mt-1" />
                  )}
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{META_HH_MENSAL_DEPARTAMENTO}h</div>
                  <p className="text-xs text-muted-foreground">Meta</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">Meta Mínima Mensal: {(META_HH_MENSAL_DEPARTAMENTO * PERCENTUAL_MINIMO / 100).toFixed(0)}h (80%)</p>
          </div>

          {/* Resumo Anual */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                Anual
              </h4>
              <div className="text-3xl font-bold text-primary">{calcularTotais(osList).totalGeral}h</div>
              <p className="text-xs text-muted-foreground">HH Acumuladas no Ano (Jan-Set)</p>
              <p className="text-sm mt-2">{((calcularTotais(osList).totalGeral / META_HH_ANUAL_DEPARTAMENTO) * 100).toFixed(1)}% da meta ({META_HH_ANUAL_DEPARTAMENTO}h)</p>
            </div>

            <div className="text-center">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Saldo
              </h4>
              <div className="text-3xl font-bold">{META_HH_ANUAL_DEPARTAMENTO - calcularTotais(osList).totalGeral}h</div>
              <p className="text-xs text-muted-foreground">Saldo Necessário</p>
            </div>

            <div className="text-center">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center justify-center gap-2">
                <Target className="h-4 w-4" />
                Média
              </h4>
              <div className="text-3xl font-bold">
                {mesesRestantes > 0 ? Math.ceil((META_HH_ANUAL_DEPARTAMENTO - calcularTotais(osList).totalGeral) / mesesRestantes) : 0}h
              </div>
              <p className="text-xs text-muted-foreground">Média Mensal Necessária</p>
              <p className="text-xs text-muted-foreground mt-1">{mesesRestantes} meses restantes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparativo por Disciplina */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Comparativo Mensal por Disciplina</CardTitle>
          <CardDescription>HH apropriadas vs Meta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Elétrica */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                Elétrica
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground capitalize">{nomeMesAnterior}</p>
                  <p className="text-2xl font-bold">{hhEletricaMesAnterior}h</p>
                  <p className="text-sm">{percEletricaMesAnterior.toFixed(1)}% da meta</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground capitalize">{nomeMesAtual}</p>
                  <p className="text-2xl font-bold text-primary">{hhEletricaMesAtual}h</p>
                  <p className="text-sm">{percEletricaMesAtual.toFixed(1)}% da meta</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">Anual: {hhEletricaAnual}h | Saldo: {saldoEletrica}h | Média: {mediaEletrica.toFixed(0)}h/mês</p>
              </div>
            </div>

            {/* Mecânica */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                Mecânica
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground capitalize">{nomeMesAnterior}</p>
                  <p className="text-2xl font-bold">{hhMecanicaMesAnterior}h</p>
                  <p className="text-sm">{percMecanicaMesAnterior.toFixed(1)}% da meta</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground capitalize">{nomeMesAtual}</p>
                  <p className="text-2xl font-bold text-primary">{hhMecanicaMesAtual}h</p>
                  <p className="text-sm">{percMecanicaMesAtual.toFixed(1)}% da meta</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">Anual: {hhMecanicaAnual}h | Saldo: {saldoMecanica}h | Média: {mediaMecanica.toFixed(0)}h/mês</p>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosComparativo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Elétrica" fill="#3b82f6" />
              <Bar dataKey="Mecânica" fill="#f97316" />
              <Bar dataKey="Meta" fill="#4b5563" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Evolução Anual Departamento (Jan-Set 2025) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Evolução Anual 2025 - Departamento EM
          </CardTitle>
          <CardDescription>Dados históricos de HH apropriadas por disciplina (Jan-Set 2025)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-4 gap-4">
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Elétrica</p>
              <p className="text-2xl font-bold text-blue-600">{calcularTotais(osList).totalEletrica}h</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Mecânica</p>
              <p className="text-2xl font-bold text-orange-600">{calcularTotais(osList).totalMecanica}h</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Geral</p>
              <p className="text-2xl font-bold text-primary">{calcularTotais(osList).totalGeral}h</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Meta Anual</p>
              <p className="text-2xl font-bold">4560h</p>
              <p className="text-xs text-muted-foreground">
                {Math.round((calcularTotais(osList).totalGeral / 4560) * 100)}% alcançado
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
              <Bar dataKey="eletrica" fill="#3b82f6" name="Elétrica">
                <LabelList dataKey="eletrica" position="top" style={{ fontSize: '12px', fontWeight: 'bold' }} />
              </Bar>
              <Bar dataKey="mecanica" fill="#f97316" name="Mecânica">
                <LabelList dataKey="mecanica" position="top" style={{ fontSize: '12px', fontWeight: 'bold' }} />
              </Bar>
              <Line 
                type="monotone" 
                dataKey="meta" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Meta 80% por disciplina (152 HH/mês)"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* HH por CCA - Mês Anterior */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            HH por CCA - {nomeMesAnterior}
          </CardTitle>
          <CardDescription>Volume de OS e HH por disciplina</CardDescription>
        </CardHeader>
        <CardContent>
          {dadosCCAMesAnterior.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum CCA concluído</p>
          ) : (
            <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CCA</TableHead>
                      <TableHead className="text-right">Elétrica (HH)</TableHead>
                      <TableHead className="text-center">Qtd</TableHead>
                      <TableHead className="text-right">Mecânica (HH)</TableHead>
                      <TableHead className="text-center">Qtd</TableHead>
                      <TableHead className="text-right">Total (HH)</TableHead>
                      <TableHead className="text-right">% do Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dadosCCAMesAnterior.map((item) => {
                      const totalHH = item.eletrica + item.mecanica;
                      const percentual = hhDepartamentoMesAnterior > 0 
                        ? ((totalHH / hhDepartamentoMesAnterior) * 100).toFixed(1)
                        : '0.0';
                      return (
                        <TableRow key={item.cca}>
                          <TableCell className="font-medium">{item.cca}</TableCell>
                          <TableCell className="text-right">{item.eletrica}h</TableCell>
                          <TableCell className="text-center text-xs text-muted-foreground">{item.qtdEletrica}</TableCell>
                          <TableCell className="text-right">{item.mecanica}h</TableCell>
                          <TableCell className="text-center text-xs text-muted-foreground">{item.qtdMecanica}</TableCell>
                          <TableCell className="text-right font-bold">{totalHH}h</TableCell>
                          <TableCell className="text-right font-semibold">{percentual}%</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">{hhEletricaMesAnterior}h</TableCell>
                      <TableCell className="text-center font-bold">{dadosCCAMesAnterior.reduce((acc, item) => acc + item.qtdEletrica, 0)}</TableCell>
                      <TableCell className="text-right font-bold">{hhMecanicaMesAnterior}h</TableCell>
                      <TableCell className="text-center font-bold">{dadosCCAMesAnterior.reduce((acc, item) => acc + item.qtdMecanica, 0)}</TableCell>
                      <TableCell className="text-right font-bold">{hhDepartamentoMesAnterior}h</TableCell>
                      <TableCell className="text-right font-bold">100%</TableCell>
                    </TableRow>
                  </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* HH por CCA - Setembro com Gráfico de Pizza */}
      {dadosCCAMesAtual.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              HH por CCA - Setembro de 2025
            </CardTitle>
            <CardDescription>Volume de OS e HH por disciplina</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Gráfico de Pizza */}
              <div className="flex flex-col items-center justify-center">
                <h4 className="text-sm font-semibold mb-4">Distribuição por CCA (%)</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={dadosPizzaSetembro}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosPizzaSetembro.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value}h`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Tabela */}
              <div className="lg:col-span-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CCA</TableHead>
                      <TableHead className="text-right">Elétrica (HH)</TableHead>
                      <TableHead className="text-center">Qtd</TableHead>
                      <TableHead className="text-right">Mecânica (HH)</TableHead>
                      <TableHead className="text-center">Qtd</TableHead>
                      <TableHead className="text-right">Total (HH)</TableHead>
                      <TableHead className="text-right">% do Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dadosCCAMesAtual.map((item) => {
                      const totalHH = item.eletrica + item.mecanica;
                      const percentual = hhDepartamentoMesAtual > 0 
                        ? ((totalHH / hhDepartamentoMesAtual) * 100).toFixed(1)
                        : '0.0';
                      return (
                        <TableRow key={item.cca}>
                          <TableCell className="font-medium">{item.cca}</TableCell>
                          <TableCell className="text-right">{item.eletrica}h</TableCell>
                          <TableCell className="text-center text-xs text-muted-foreground">{item.qtdEletrica}</TableCell>
                          <TableCell className="text-right">{item.mecanica}h</TableCell>
                          <TableCell className="text-center text-xs text-muted-foreground">{item.qtdMecanica}</TableCell>
                          <TableCell className="text-right font-bold">{totalHH}h</TableCell>
                          <TableCell className="text-right font-semibold">{percentual}%</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">{hhEletricaMesAtual}h</TableCell>
                      <TableCell className="text-center font-bold">{dadosCCAMesAtual.reduce((acc, item) => acc + item.qtdEletrica, 0)}</TableCell>
                      <TableCell className="text-right font-bold">{hhMecanicaMesAtual}h</TableCell>
                      <TableCell className="text-center font-bold">{dadosCCAMesAtual.reduce((acc, item) => acc + item.qtdMecanica, 0)}</TableCell>
                      <TableCell className="text-right font-bold">{hhDepartamentoMesAtual}h</TableCell>
                      <TableCell className="text-right font-bold">100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}


      {/* Histórico Mensal Consolidado Jan-Ago */}
      {(() => {
        if (hhHistoricos.length === 0) return null;

        // Agrupar por mês
        const meses = ['01/2025', '02/2025', '03/2025', '04/2025', '05/2025', '06/2025', '07/2025', '08/2025'];
        const nomeMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto'];
        
        const dadosPorMes = meses.map((mes, idx) => {
          const hhMes = hhHistoricos.filter(hh => hh.mes === mes);
          const eletrica = hhMes.filter(hh => hh.disciplina.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 'eletrica').reduce((acc, hh) => acc + hh.hhApropriado, 0);
          const mecanica = hhMes.filter(hh => hh.disciplina.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 'mecanica').reduce((acc, hh) => acc + hh.hhApropriado, 0);
          const totalHH = eletrica + mecanica;
          const [mesNum] = mes.split('/');
          const metaPorcentagem = parseInt(mesNum) <= 3 ? 70 : 80;
          const percentualMeta = (totalHH / META_HH_MENSAL_DEPARTAMENTO) * 100;
          const atingiu = percentualMeta >= metaPorcentagem;
          
          return {
            mes: nomeMeses[idx],
            mesCompleto: mes,
            eletrica,
            mecanica,
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
          value: d.totalHH,
          eletrica: d.eletrica,
          mecanica: d.mecanica
        }));

        const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6', '#ef4444'];

        return (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600" />
                Histórico Mensal Consolidado - Janeiro a Agosto 2025
              </CardTitle>
              <CardDescription>Registro histórico de HH apropriado por mês (Departamento)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cards compactos */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Resumo por Mês</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {dadosPorMes.map((dados) => (
                      <div key={dados.mesCompleto} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold">{dados.mes}</p>
                          {dados.atingiu ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-primary">{dados.totalHH}h</p>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <span>E: {dados.eletrica}h</span>
                            <span>M: {dados.mecanica}h</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    ✓ Meta atingida | ⚠ Meta não atingida (Jan-Mar: 70% | Abr-Ago: 80%)<br/>
                    E: Elétrica | M: Mecânica
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
                      <Tooltip 
                        formatter={(value: number, name: string, props: any) => {
                          const { eletrica, mecanica } = props.payload;
                          return [
                            `${value}h (E: ${eletrica}h | M: ${mecanica}h)`,
                            'Total'
                          ];
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}
    </div>
  );
}
