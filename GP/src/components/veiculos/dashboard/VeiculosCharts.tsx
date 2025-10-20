import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { differenceInDays, format } from "date-fns";

interface Veiculo {
  id: string;
  status: string;
  locadora: string;
  tipoLocacao: string;
  placa: string;
  modelo: string;
  condutorAtual?: string;
  dataInicioLocacao?: Date;
  dataFimLocacao?: Date;
}

interface VeiculosChartsProps {
  veiculos: Veiculo[];
}

const COLORS = {
  ativo: "#10B981",
  encerrado: "#6B7280",
  localiza: "#3B82F6",
  hertz: "#8B5CF6",
  movida: "#F59E0B",
  unidas: "#EF4444",
  mensal: "#10B981",
  esporadico: "#F59E0B"
};

export function VeiculosCharts({ veiculos }: VeiculosChartsProps) {
  // Gráfico 1: Veículos por Status
  const statusData = [
    { name: "Ativo", value: veiculos.filter(v => v.status === "ativo").length, color: COLORS.ativo },
    { name: "Encerrado", value: veiculos.filter(v => v.status === "encerrado").length, color: COLORS.encerrado }
  ];

  // Gráfico 2: Veículos por Locadora
  const locadoraCount = veiculos.reduce((acc, v) => {
    const locadora = v.locadora || "Não Informada";
    acc[locadora] = (acc[locadora] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locadoraData = Object.entries(locadoraCount).map(([name, value]) => ({
    name,
    value,
    fill: COLORS[name.toLowerCase() as keyof typeof COLORS] || "#6B7280"
  }));

  // Gráfico 3: Tipo de Locação
  const tipoData = [
    { name: "Mensal", value: veiculos.filter(v => v.tipoLocacao === "mensal").length, color: COLORS.mensal },
    { name: "Esporádico", value: veiculos.filter(v => v.tipoLocacao === "esporadico").length, color: COLORS.esporadico }
  ];

  // Tabela: Top 5 veículos com devolução mais próxima
  const veiculosAtivos = veiculos
    .filter(v => v.status === "ativo" && v.dataFimLocacao)
    .map(v => ({
      ...v,
      diasRestantes: differenceInDays(new Date(v.dataFimLocacao!), new Date())
    }))
    .sort((a, b) => a.diasRestantes - b.diasRestantes)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gráfico 1: Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Veículos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico 2: Locadora */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Veículos por Locadora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={locadoraData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico 3: Tipo de Locação */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tipo de Locação</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={tipoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tipoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela: Próximas Devoluções */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Próximas Devoluções</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Condutor</TableHead>
                <TableHead>Data Devolução</TableHead>
                <TableHead>Dias Restantes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {veiculosAtivos.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.placa}</TableCell>
                  <TableCell>{v.modelo}</TableCell>
                  <TableCell>{v.condutorAtual || "-"}</TableCell>
                  <TableCell>{format(new Date(v.dataFimLocacao!), "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={v.diasRestantes <= 7 ? "destructive" : v.diasRestantes <= 15 ? "default" : "secondary"}>
                      {v.diasRestantes} dias
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {veiculosAtivos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum veículo com devolução prevista
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
