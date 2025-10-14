import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Line, ComposedChart, LabelList } from 'recharts';
import { obterHHPorDisciplinaAnual, obterHHPorCCAAnual, calcularTotais } from "@/lib/engenharia-matricial/dadosAnuais";
import { useOSList } from "@/hooks/engenharia-matricial/useOSEngenhariaMatricial";

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

export default function RelatoriosAnual() {
  const [abaSelecionada, setAbaSelecionada] = useState("disciplina");
  
  // Buscar OS do banco de dados
  const { data: osListData, isLoading } = useOSList({ status: 'concluida' as any });
  const osList = osListData || [];

  // Obter dados consolidados usando memo para evitar recalculos
  const hhPorDisciplinaAnual = useMemo(() => obterHHPorDisciplinaAnual(osList), [osList]);
  const hhPorCCAAnual = useMemo(() => obterHHPorCCAAnual(osList), [osList]);
  
  console.log("=== DEBUG RelatoriosAnual ===");
  console.log("hhPorDisciplinaAnual:", hhPorDisciplinaAnual);
  console.log("hhPorCCAAnual:", hhPorCCAAnual);
  
  // Calcula totais usando a função auxiliar com OS
  const { totalEletrica, totalMecanica, totalGeral, mediaEletrica, mediaMecanica, mediaGeral, mesesDecorridos } = useMemo(
    () => calcularTotais(osList), 
    [osList]
  );
  
  console.log("Totais calculados:", { totalEletrica, totalMecanica, totalGeral, mediaEletrica, mediaMecanica, mediaGeral, mesesDecorridos });
  
  // Mostrar loading enquanto busca dados
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando relatórios...</p>
      </div>
    );
  }
  
  // Meta mensal de 190 HH por disciplina
  const metaMensal = 190;
  const mesesAno = 12;
  
  // Calcular meses restantes dinamicamente
  const mesAtual = new Date().getMonth(); // 0-11 (Janeiro=0, Outubro=9)
  const mesesRestantes = 12 - (mesAtual + 1); // Meses que faltam até o fim do ano
  
  // Meta anual: 190 HH/mês x 12 meses = 2280 HH por disciplina
  const metaEletricaAnual = metaMensal * mesesAno; // 2280 HH
  const metaMecanicaAnual = metaMensal * mesesAno; // 2280 HH
  const totalMetaAnual = metaEletricaAnual + metaMecanicaAnual; // 4560 HH total
  
  const totalAtual = totalGeral;
  const hhFaltantes = Math.max(0, totalMetaAnual - totalAtual);
  const hhPorMesFaltante = mesesRestantes > 0 ? Math.ceil(hhFaltantes / mesesRestantes) : 0;
  
  // Percentuais de alcance da meta anual
  const percEletrica = Math.round((totalEletrica / metaEletricaAnual) * 100);
  const percMecanica = Math.round((totalMecanica / metaMecanicaAnual) * 100);
  const percGeral = Math.round((totalAtual / totalMetaAnual) * 100);

  // Dados para pizza por disciplina
  const dadosPizzaDisciplina = [
    { name: "Elétrica", value: totalEletrica },
    { name: "Mecânica", value: totalMecanica }
  ];

  // Dados para pizza por CCA (Total Anual Jan-Set)
  const dadosPizzaCCA = hhPorCCAAnual.map(item => {
    const totalAnual = item.jan + item.fev + item.mar + item.abr + item.mai + item.jun + item.jul + item.ago + item.set;
    return {
      name: item.nome,
      value: totalAnual
    };
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatório Anual 2025</h1>
        <p className="text-muted-foreground">Cenário de HH por Disciplina e CCA (Jan-Set/25)</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{totalEletrica} HH</div>
            <p className="text-sm text-muted-foreground">Total Elétrica</p>
            <p className="text-xs text-muted-foreground mt-1">Média: {mediaEletrica} HH/mês</p>
            <div className="mt-2 pt-2 border-t">
              <p className="text-xs font-semibold">Meta Anual: 2280 HH</p>
              <p className={`text-sm font-bold ${percEletrica >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                {percEletrica}% alcançado
              </p>
              <p className={`text-xs mt-1 ${totalEletrica >= 2280 ? 'text-green-600' : 'text-red-600'}`}>
                {totalEletrica >= 2280 
                  ? `Superou: +${totalEletrica - 2280} HH` 
                  : `Faltam: ${2280 - totalEletrica} HH${mesesRestantes > 0 ? ` (${Math.ceil((2280 - totalEletrica) / mesesRestantes)} HH/mês)` : ''}`}
              </p>
              <p className={`text-xs ${totalEletrica >= 1824 ? 'text-green-600' : 'text-red-600'}`}>
                {totalEletrica >= 1824 
                  ? `Meta 80%: Superou +${totalEletrica - 1824} HH` 
                  : `Meta 80%: Faltam ${1824 - totalEletrica} HH${mesesRestantes > 0 ? ` (${Math.ceil((1824 - totalEletrica) / mesesRestantes)} HH/mês)` : ''}`}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{totalMecanica} HH</div>
            <p className="text-sm text-muted-foreground">Total Mecânica</p>
            <p className="text-xs text-muted-foreground mt-1">Média: {mediaMecanica} HH/mês</p>
            <div className="mt-2 pt-2 border-t">
              <p className="text-xs font-semibold">Meta Anual: 2280 HH</p>
              <p className={`text-sm font-bold ${percMecanica >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                {percMecanica}% alcançado
              </p>
              <p className={`text-xs mt-1 ${totalMecanica >= 2280 ? 'text-green-600' : 'text-red-600'}`}>
                {totalMecanica >= 2280 
                  ? `Superou: +${totalMecanica - 2280} HH` 
                  : `Faltam: ${2280 - totalMecanica} HH${mesesRestantes > 0 ? ` (${Math.ceil((2280 - totalMecanica) / mesesRestantes)} HH/mês)` : ''}`}
              </p>
              <p className={`text-xs ${totalMecanica >= 1824 ? 'text-green-600' : 'text-red-600'}`}>
                {totalMecanica >= 1824 
                  ? `Meta 80%: Superou +${totalMecanica - 1824} HH` 
                  : `Meta 80%: Faltam ${1824 - totalMecanica} HH${mesesRestantes > 0 ? ` (${Math.ceil((1824 - totalMecanica) / mesesRestantes)} HH/mês)` : ''}`}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{totalGeral} HH</div>
            <p className="text-sm text-muted-foreground">Total Geral</p>
            <p className="text-xs text-muted-foreground mt-1">Média: {mediaGeral} HH/mês</p>
            <div className="mt-2 pt-2 border-t">
              <p className="text-xs font-semibold">Meta Anual: 4560 HH</p>
              <p className={`text-sm font-bold ${percGeral >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                {percGeral}% alcançado
              </p>
              <p className={`text-xs mt-1 ${totalGeral >= 4560 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGeral >= 4560 
                  ? `Superou: +${totalGeral - 4560} HH` 
                  : `Faltam: ${4560 - totalGeral} HH${mesesRestantes > 0 ? ` (${Math.ceil((4560 - totalGeral) / mesesRestantes)} HH/mês)` : ''}`}
              </p>
              <p className={`text-xs ${totalGeral >= 3648 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGeral >= 3648 
                  ? `Meta 80%: Superou +${totalGeral - 3648} HH` 
                  : `Meta 80%: Faltam ${3648 - totalGeral} HH${mesesRestantes > 0 ? ` (${Math.ceil((3648 - totalGeral) / mesesRestantes)} HH/mês)` : ''}`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className={`text-2xl font-bold ${hhFaltantes <= 0 ? 'text-green-600' : 'text-orange-600'}`}>
              {hhFaltantes <= 0 ? '✓ Meta Atingida' : `${hhPorMesFaltante} HH/mês`}
            </div>
            <p className="text-sm text-muted-foreground">
              Necessário ({mesesRestantes > 0 ? `${mesesRestantes} ${mesesRestantes === 1 ? 'mês restante' : 'meses restantes'}` : 'ano finalizado'})
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Faltam: {hhFaltantes} HH
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada}>
        <TabsList>
          <TabsTrigger value="disciplina">Por Disciplina</TabsTrigger>
          <TabsTrigger value="cca">Por CCA</TabsTrigger>
        </TabsList>

        {/* Aba: Por Disciplina */}
        <TabsContent value="disciplina" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico Pizza - Distribuição por Disciplina */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição Total por Disciplina</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosPizzaDisciplina}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} HH (${(percent * 100).toFixed(1)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                     >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#f97316" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Barras - Evolução Mensal */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução Mensal por Disciplina</CardTitle>
            </CardHeader>
            <CardContent>
          <ResponsiveContainer width="100%" height={400}>
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
                    name="Meta 80% (152 HH/mês)"
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Por CCA */}
        <TabsContent value="cca" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tabela HH por CCA */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>HH por CCA (Jan-Set/25)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>CCA</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead className="text-right">Jan</TableHead>
                        <TableHead className="text-right">Fev</TableHead>
                        <TableHead className="text-right">Mar</TableHead>
                        <TableHead className="text-right">Abr</TableHead>
                        <TableHead className="text-right">Mai</TableHead>
                        <TableHead className="text-right">Jun</TableHead>
                        <TableHead className="text-right">Jul</TableHead>
                        <TableHead className="text-right">Ago</TableHead>
                        <TableHead className="text-right">Set</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hhPorCCAAnual.map((item, idx) => {
                        const total = item.jan + item.fev + item.mar + item.abr + item.mai + item.jun + item.jul + item.ago + item.set;
                        return (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{item.cca}</TableCell>
                            <TableCell>{item.nome}</TableCell>
                            <TableCell className="text-right">{item.jan}</TableCell>
                            <TableCell className="text-right">{item.fev}</TableCell>
                            <TableCell className="text-right">{item.mar}</TableCell>
                            <TableCell className="text-right">{item.abr}</TableCell>
                            <TableCell className="text-right">{item.mai}</TableCell>
                            <TableCell className="text-right">{item.jun}</TableCell>
                            <TableCell className="text-right">{item.jul}</TableCell>
                            <TableCell className="text-right">{item.ago}</TableCell>
                            <TableCell className="text-right">{item.set}</TableCell>
                            <TableCell className="text-right font-bold">{total}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico Pizza - Total Anual por CCA */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Distribuição Total Anual por CCA</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                  <PieChart>
                    <Pie
                      data={dadosPizzaCCA}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                      outerRadius={180}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosPizzaCCA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} HH`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Barras - Top 5 CCAs Anual */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top 5 CCAs - Total Anual (Jan-Set/25)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={(() => {
                    // Primeiro calcula o total geral de TODOS os CCAs
                    const totalGeralTodosCCAs = hhPorCCAAnual.reduce((acc, item) => {
                      return acc + (item.jan + item.fev + item.mar + item.abr + item.mai + item.jun + item.jul + item.ago + item.set);
                    }, 0);
                    
                    // Depois filtra os Top 5 e calcula a % sobre o total geral
                    const ccaComTotais = hhPorCCAAnual
                      .map(item => ({
                        cca: item.cca,
                        nome: item.nome,
                        total: item.jan + item.fev + item.mar + item.abr + item.mai + item.jun + item.jul + item.ago + item.set
                      }))
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 5);
                    
                    return ccaComTotais.map(item => ({
                      ...item,
                      percentual: ((item.total / totalGeralTodosCCAs) * 100).toFixed(1)
                    }));
                  })()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="cca" 
                      height={80}
                      tick={({ x, y, payload }) => (
                        <g transform={`translate(${x},${y})`}>
                          <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontWeight="bold">
                            {payload.value}
                          </text>
                          <text x={0} y={20} dy={16} textAnchor="middle" fill="#666" fontSize="12">
                            {hhPorCCAAnual.find(item => item.cca === payload.value)?.nome || ''}
                          </text>
                        </g>
                      )}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any, name: any, props: any) => [
                        `${value} HH (${props.payload.percentual || 0}%)`,
                        'Total'
                      ]}
                    />
                    <Bar dataKey="total" fill="#3b82f6" name="HH Total Anual">
                      <LabelList 
                        dataKey="percentual" 
                        position="inside" 
                        formatter={(value: any) => `${value}%`}
                        style={{ fill: 'white', fontWeight: 'bold', fontSize: '14px' }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
