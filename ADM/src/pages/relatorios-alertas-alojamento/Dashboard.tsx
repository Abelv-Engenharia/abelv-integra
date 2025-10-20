import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, CheckCircle, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statusChartData = [
  { name: 'Regulares', value: 45, color: '#22c55e' },
  { name: 'Pendentes', value: 30, color: '#f59e0b' },
  { name: 'Atrasadas', value: 25, color: '#ef4444' }
];

const obraChartData = [
  { obra: 'CCA 001', regulares: 8, pendentes: 2, atrasadas: 0 },
  { obra: 'CCA 002', regulares: 5, pendentes: 3, atrasadas: 2 },
  { obra: 'CCA 003', regulares: 12, pendentes: 1, atrasadas: 0 }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard - Relatórios & Alertas</h1>
            <p className="text-muted-foreground">Visão geral dos contratos, vistorias e alertas</p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contratos com Vistoria Pendente</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">5</div>
              <p className="text-xs text-muted-foreground">Total aguardando vistoria</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas do Prazo</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className="text-xs text-muted-foreground">Vencimento em 7 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vistorias em Atraso</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-xs text-muted-foreground">Prazo vencido</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Regularização</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">75%</div>
              <Progress value={75} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico Pizza - Status */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
              <CardDescription>Situação atual das vistorias</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico Barras - Por Obra */}
          <Card>
            <CardHeader>
              <CardTitle>Situação por Obra/CCA</CardTitle>
              <CardDescription>Comparativo entre obras</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={obraChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="obra" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="regulares" fill="#22c55e" name="Regulares" />
                  <Bar dataKey="pendentes" fill="#f59e0b" name="Pendentes" />
                  <Bar dataKey="atrasadas" fill="#ef4444" name="Atrasadas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}