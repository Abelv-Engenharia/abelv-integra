import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { AlertTriangle, DollarSign, Activity } from "lucide-react";

interface RelatorioMultasProps {
  multas: any[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function RelatorioMultas({ multas }: RelatorioMultasProps) {
  // Cálculos
  const totalmultas = multas.length;
  const valortotal = multas.reduce((acc, m) => acc + (m.valor || 0), 0);
  const pontosacumulados = multas.reduce((acc, m) => acc + (m.pontos || 0), 0);
  const mediavalor = totalmultas > 0 ? valortotal / totalmultas : 0;

  // Distribuição por tipo
  const distribuicaotipo = multas.reduce((acc, m) => {
    const tipo = m.tipoocorrencia || 'Outros';
    const existing = acc.find((item: any) => item.tipo === tipo);
    if (existing) {
      existing.quantidade++;
      existing.valor += m.valor || 0;
    } else {
      acc.push({ tipo, quantidade: 1, valor: m.valor || 0 });
    }
    return acc;
  }, [] as any[]);

  // Top 5 condutores
  const condutormultas = multas.reduce((acc, m) => {
    const condutor = m.condutor || 'Não informado';
    if (!acc[condutor]) {
      acc[condutor] = { nome: condutor, multas: 0, pontos: 0 };
    }
    acc[condutor].multas++;
    acc[condutor].pontos += m.pontos || 0;
    return acc;
  }, {} as any);

  const top5condutores = Object.values(condutormultas)
    .sort((a: any, b: any) => b.multas - a.multas)
    .slice(0, 5);

  // Evolução mensal (simulado)
  const evolucaomensal = [
    { mes: 'Jan', multas: Math.floor(totalmultas * 0.15), valor: valortotal * 0.12 },
    { mes: 'Fev', multas: Math.floor(totalmultas * 0.18), valor: valortotal * 0.16 },
    { mes: 'Mar', multas: Math.floor(totalmultas * 0.12), valor: valortotal * 0.14 },
    { mes: 'Abr', multas: Math.floor(totalmultas * 0.20), valor: valortotal * 0.19 },
    { mes: 'Mai', multas: Math.floor(totalmultas * 0.16), valor: valortotal * 0.17 },
    { mes: 'Jun', multas: Math.floor(totalmultas * 0.19), valor: valortotal * 0.22 },
  ];

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Multas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalmultas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {valortotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Acumulados</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{pontosacumulados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Multa</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {mediavalor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo de Ocorrência</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribuicaotipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tipo, percent }) => `${tipo} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {distribuicaotipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top 5 Condutores */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Condutores com Mais Multas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={top5condutores} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nome" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="multas" fill="hsl(var(--chart-1))" name="Multas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evolução Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Multas ao Longo dos Meses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolucaomensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="multas" stroke="hsl(var(--chart-1))" name="Quantidade" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Valor Acumulado */}
        <Card>
          <CardHeader>
            <CardTitle>Valor Acumulado de Multas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={evolucaomensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="valor" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" name="Valor (R$)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento de Multas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Auto Infração</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Condutor</TableHead>
                <TableHead>Tipo Ocorrência</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Pontos</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {multas.slice(0, 10).map((multa) => (
                <TableRow key={multa.autoinfracao}>
                  <TableCell className="font-medium">{multa.autoinfracao}</TableCell>
                  <TableCell>{multa.placa}</TableCell>
                  <TableCell>{multa.condutor}</TableCell>
                  <TableCell>{multa.tipoocorrencia}</TableCell>
                  <TableCell>{multa.datainfracao}</TableCell>
                  <TableCell className="text-right">
                    R$ {multa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">{multa.pontos}</TableCell>
                  <TableCell>
                    <Badge variant={multa.statuspagamento === 'Pago' ? 'default' : 'destructive'}>
                      {multa.statuspagamento}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {multas.length > 10 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Mostrando 10 de {multas.length} registros. Exporte para ver todos.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
