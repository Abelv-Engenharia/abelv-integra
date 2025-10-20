import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Plane, AlertTriangle, CheckCircle, Leaf } from "lucide-react";

interface AirDetailsSectionProps {
  detalhes: {
    totalReservas: number;
    valorTotal: number;
    ticketMedioDentro: number;
    ticketMedioFora: number;
    antecedenciaMedia: number;
    nacionais: number;
    internacionais: number;
    comAcordo: number;
    semAcordo: number;
    emissaoCO2: number;
    companhias: Array<{
      nome: string;
      dentroPolicy: number;
      foraPolicy: number;
    }>;
    trechosComuns: Array<{
      origem: string;
      destino: string;
      quantidade: number;
    }>;
  };
}

export const AirDetailsSection = ({ detalhes }: AirDetailsSectionProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const percentualDentro = ((detalhes.comAcordo / detalhes.totalReservas) * 100).toFixed(1);

  // Calcular valores de política
  const totalDentroPolicy = detalhes.companhias.reduce((acc, c) => acc + c.dentroPolicy, 0);
  const totalForaPolicy = detalhes.companhias.reduce((acc, c) => acc + c.foraPolicy, 0);
  const totalPolicy = totalDentroPolicy + totalForaPolicy;
  const percentualDentroValor = ((totalDentroPolicy / totalPolicy) * 100).toFixed(1);
  const percentualForaValor = ((totalForaPolicy / totalPolicy) * 100).toFixed(1);

  const policyData = [
    { name: 'Dentro da Política', value: totalDentroPolicy, color: '#3b82f6', percent: percentualDentroValor },
    { name: 'Fora da Política', value: totalForaPolicy, color: '#ec4899', percent: percentualForaValor }
  ];

  const companhiasData = detalhes.companhias.map(c => ({
    nome: c.nome,
    'Dentro da Política': c.dentroPolicy,
    'Fora da Política': c.foraPolicy
  }));

  const trechosData = detalhes.trechosComuns.map(t => ({
    trecho: `${t.origem}/${t.destino}`,
    quantidade: t.quantidade
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Plane className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Detalhamento Aéreo</h2>
      </div>

      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{detalhes.totalReservas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(detalhes.valorTotal)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Dentro: {formatCurrency(detalhes.ticketMedioDentro)}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm">Fora: {formatCurrency(detalhes.ticketMedioFora)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conformidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{percentualDentro}%</div>
            <p className="text-xs text-muted-foreground">Dentro da política</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Valor por Reservas Dentro/Fora da Política</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={policyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  labelLine={false}
                  label={({ percent }) => `${percent}%`}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {policyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor por Companhia Aérea</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={companhiasData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nome" type="category" width={80} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="Dentro da Política" stackId="a" fill="#22c55e" />
                <Bar dataKey="Fora da Política" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Trechos Mais Comuns */}
      <Card>
        <CardHeader>
          <CardTitle>Trechos Mais Comuns</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trechosData} layout="horizontal" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trecho" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#3b82f6" label={{ position: 'top' }} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Indicadores */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              Emissão de CO₂
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{detalhes.emissaoCO2} kg</div>
            <p className="text-xs text-muted-foreground">Total de emissões no período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Antecedência Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{detalhes.antecedenciaMedia} dias</div>
            <p className="text-xs text-muted-foreground">Mínimo recomendado: 5 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Política de Viagem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Com acordo:</span>
                <Badge variant="outline" className="bg-green-50">{detalhes.comAcordo}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Sem acordo:</span>
                <Badge variant="outline" className="bg-red-50">{detalhes.semAcordo}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
