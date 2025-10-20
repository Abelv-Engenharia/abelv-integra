import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Car, AlertTriangle, CreditCard, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { DadosRelatorioConsolidado } from "@/types/relatorio";

interface RelatorioConsolidadoProps {
  dados: DadosRelatorioConsolidado;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function RelatorioConsolidado({ dados }: RelatorioConsolidadoProps) {
  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos Ativos</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dados.totalveiculosativos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Total Mensal</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {dados.custototalmensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Multas Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{dados.multaspendentes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CNHs Vencendo</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{dados.cnhsvencendo}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{dados.alertascriticos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de Custos */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Custos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dados.distribuicaocustos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {dados.distribuicaocustos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evolução de Custos */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Custos Mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dados.evolucaocustos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="locacao" stackId="a" fill="hsl(var(--chart-1))" name="Locação" />
                <Bar dataKey="combustivel" stackId="a" fill="hsl(var(--chart-2))" name="Combustível" />
                <Bar dataKey="multas" stackId="a" fill="hsl(var(--chart-3))" name="Multas" />
                <Bar dataKey="pedagios" stackId="a" fill="hsl(var(--chart-4))" name="Pedágios" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Veículos e Condutores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Veículos Mais Caros</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posição</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead className="text-right">Custo Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dados.top5veiculos.map((veiculo, index) => (
                  <TableRow key={veiculo.placa}>
                    <TableCell className="font-bold">#{index + 1}</TableCell>
                    <TableCell>{veiculo.placa}</TableCell>
                    <TableCell>{veiculo.modelo}</TableCell>
                    <TableCell className="text-right font-semibold">
                      R$ {veiculo.custototal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Condutores com Mais Multas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posição</TableHead>
                  <TableHead>Condutor</TableHead>
                  <TableHead className="text-right">Multas</TableHead>
                  <TableHead className="text-right">Pontos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dados.top5condutores.map((condutor, index) => (
                  <TableRow key={condutor.nome}>
                    <TableCell className="font-bold">#{index + 1}</TableCell>
                    <TableCell>{condutor.nome}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{condutor.multas}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{condutor.pontos}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Prioritários */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Prioritários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {dados.alertasprioritarios.map((alerta, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      alerta.prioridade === 'alta'
                        ? 'text-destructive'
                        : alerta.prioridade === 'media'
                        ? 'text-orange-500'
                        : 'text-yellow-500'
                    }`}
                  />
                  <span>{alerta.mensagem}</span>
                </div>
                <Badge
                  variant={
                    alerta.prioridade === 'alta'
                      ? 'destructive'
                      : alerta.prioridade === 'media'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {alerta.prioridade === 'alta' ? 'Alta' : alerta.prioridade === 'media' ? 'Média' : 'Baixa'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
