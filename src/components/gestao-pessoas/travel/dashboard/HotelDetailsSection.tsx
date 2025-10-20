import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HotelDetailsSectionProps {
  detalhes: {
    totalReservas: number;
    valorTotal: number;
    ticketMedio: number;
    hoteisMaisUsados: Array<{
      nome: string;
      cidade: string;
      quantidade: number;
      valorTotal: number;
    }>;
    cidadesMaisVisitadas: Array<{
      cidade: string;
      quantidade: number;
    }>;
  };
}

export const HotelDetailsSection = ({ detalhes }: HotelDetailsSectionProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Building className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold">Detalhamento de Hospedagem</h2>
      </div>

      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{detalhes.totalReservas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(detalhes.valorTotal)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(detalhes.ticketMedio)}</div>
            <p className="text-xs text-muted-foreground">Por hospedagem</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Cidades */}
      <Card>
        <CardHeader>
          <CardTitle>Cidades Mais Visitadas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={detalhes.cidadesMaisVisitadas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cidade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidade" fill="#10b981" name="Reservas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de Hotéis */}
      <Card>
        <CardHeader>
          <CardTitle>Hotéis Mais Utilizados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead className="text-center">Quantidade</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detalhes.hoteisMaisUsados.map((hotel, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{hotel.nome}</TableCell>
                  <TableCell>{hotel.cidade}</TableCell>
                  <TableCell className="text-center">
                    <Badge>{hotel.quantidade}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(hotel.valorTotal)}
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
