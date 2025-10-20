import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  TrendingUp,
  Bell,
  Send,
  Eye,
  XCircle,
  Filter,
  Download,
  BarChart3,
  PieChart
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line
} from "recharts";

export default function DashboardAlertasEnhanced() {
  const [filtroObra, setFiltroObra] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("30");

  // KPIs mock
  const kpis = [
    { titulo: "Total Colaboradores", valor: 147, descricao: "ativos no sistema", icon: Users, cor: "text-blue-600" },
    { titulo: "Documentos a Vencer", valor: 23, descricao: "próximos 7 dias", icon: Clock, cor: "text-yellow-600" },
    { titulo: "Documentos Vencidos", valor: 12, descricao: "requerem atenção", icon: XCircle, cor: "text-red-600" },
    { titulo: "Taxa de Conformidade", valor: "84.4%", descricao: "documentos em dia", icon: CheckCircle, cor: "text-green-600" }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Dashboard & Alertas - Mobilização</h1>
          <p className="text-muted-foreground">Visão geral da documentação de mobilização e alertas críticos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.titulo}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.cor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.valor}</div>
              <p className="text-xs text-muted-foreground">{kpi.descricao}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos básicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status por Obra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Gráfico de barras aqui
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">João Silva</p>
                  <p className="text-sm text-muted-foreground">ASO vencido há 5 dias</p>
                </div>
                <Badge className="bg-red-500 text-white">Crítico</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}