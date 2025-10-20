import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BusDetailsSectionProps {
  detalhes: {
    totalReservas: number;
    valorTotal: number;
    ticketMedio: number;
    empresas: Array<{
      nome: string;
      quantidade: number;
      valorTotal: number;
    }>;
    rotasComuns: Array<{
      origem: string;
      destino: string;
      quantidade: number;
    }>;
  };
}

export const BusDetailsSection = ({ detalhes }: BusDetailsSectionProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Bus className="h-6 w-6 text-orange-600" />
        <h2 className="text-2xl font-bold">Detalhamento Rodoviário</h2>
      </div>

      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{detalhes.totalReservas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(detalhes.valorTotal)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(detalhes.ticketMedio)}</div>
            <p className="text-xs text-muted-foreground">Por passagem</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Empresas */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Mais Utilizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={detalhes.empresas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="valorTotal" fill="#f59e0b" name="Valor Total" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de Rotas */}
      <Card>
        <CardHeader>
          <CardTitle>Rotas Mais Comuns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detalhes.rotasComuns.map((rota, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{rota.origem}</TableCell>
                  <TableCell>{rota.destino}</TableCell>
                  <TableCell className="text-right">
                    <Badge>{rota.quantidade}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
