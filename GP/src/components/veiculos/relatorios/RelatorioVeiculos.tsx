import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Car, DollarSign, Building2 } from "lucide-react";

interface RelatorioVeiculosProps {
  veiculos: any[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function RelatorioVeiculos({ veiculos }: RelatorioVeiculosProps) {
  // Cálculos
  const totalveiculos = veiculos.length;
  const ativos = veiculos.filter(v => v.status === 'Ativo').length;
  const encerrados = veiculos.filter(v => v.status === 'Encerrado').length;
  const valortotallocacao = veiculos.reduce((acc, v) => acc + (v.valorlocacao || 0), 0);

  // Distribuição por locadora
  const distribuicaolocadora = veiculos.reduce((acc, v) => {
    const locadora = v.locadora || 'Não informado';
    const existing = acc.find((item: any) => item.locadora === locadora);
    if (existing) {
      existing.quantidade++;
    } else {
      acc.push({ locadora, quantidade: 1 });
    }
    return acc;
  }, [] as any[]);

  // Distribuição por status
  const distribuicaostatus = [
    { status: 'Ativo', quantidade: ativos },
    { status: 'Encerrado', quantidade: encerrados },
  ];

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalveiculos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos Ativos</CardTitle>
            <Car className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{ativos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos Encerrados</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{encerrados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Locação</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {valortotallocacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Locadora */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Locadora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribuicaolocadora}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ locadora, percent }) => `${locadora} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {distribuicaolocadora.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Veículos por Status */}
        <Card>
          <CardHeader>
            <CardTitle>Veículos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribuicaostatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="hsl(var(--chart-1))" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento de Veículos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Locadora</TableHead>
                <TableHead>CCA</TableHead>
                <TableHead>Condutor</TableHead>
                <TableHead className="text-right">Valor Locação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {veiculos.slice(0, 10).map((veiculo) => (
                <TableRow key={veiculo.placa}>
                  <TableCell className="font-medium">{veiculo.placa}</TableCell>
                  <TableCell>{veiculo.modelo}</TableCell>
                  <TableCell>{veiculo.locadora}</TableCell>
                  <TableCell>{veiculo.cca}</TableCell>
                  <TableCell>{veiculo.condutor}</TableCell>
                  <TableCell className="text-right">
                    R$ {(veiculo.valorlocacao || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={veiculo.status === 'Ativo' ? 'default' : 'secondary'}>
                      {veiculo.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {veiculos.length > 10 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Mostrando 10 de {veiculos.length} registros. Exporte para ver todos.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
