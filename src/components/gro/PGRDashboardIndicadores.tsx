
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

// Mock data - replace with real data later
const indicadores = [
  {
    id: 1,
    nome: 'Taxa de Frequência',
    valor: 2.5,
    meta: 3.0,
    status: 'ok',
    tendencia: 'down',
    periodo: 'Últimos 12 meses'
  },
  {
    id: 2,
    nome: 'Taxa de Gravidade',
    valor: 45.2,
    meta: 50.0,
    status: 'ok',
    tendencia: 'up',
    periodo: 'Últimos 12 meses'
  },
  {
    id: 3,
    nome: 'Desvios Abertos',
    valor: 15,
    meta: 10,
    status: 'atencao',
    tendencia: 'up',
    periodo: 'Atual'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ok':
      return <Badge variant="default" className="bg-green-100 text-green-800">Dentro da Meta</Badge>;
    case 'atencao':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Atenção</Badge>;
    case 'critico':
      return <Badge variant="destructive">Crítico</Badge>;
    default:
      return <Badge variant="outline">-</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ok':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'atencao':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'critico':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const getTrendIcon = (tendencia: string) => {
  return tendencia === 'up' ? 
    <TrendingUp className="h-4 w-4 text-red-500" /> : 
    <TrendingDown className="h-4 w-4 text-green-500" />;
};

export const PGRDashboardIndicadores = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {indicadores.map((indicador) => (
          <Card key={indicador.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {indicador.nome}
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusIcon(indicador.status)}
                {getTrendIcon(indicador.tendencia)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{indicador.valor}</div>
              <p className="text-xs text-muted-foreground">
                Meta: {indicador.meta} | {indicador.periodo}
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs">Progresso</span>
                  <span className="text-xs">{Math.round((indicador.valor / indicador.meta) * 100)}%</span>
                </div>
                <Progress 
                  value={(indicador.valor / indicador.meta) * 100} 
                  className="w-full"
                />
              </div>
              <div className="mt-3">
                {getStatusBadge(indicador.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
