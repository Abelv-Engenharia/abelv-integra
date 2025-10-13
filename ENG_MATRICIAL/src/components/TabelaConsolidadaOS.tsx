import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Eye, Zap, Cog, BarChart3 } from "lucide-react";
import { OS } from "@/contexts/OSContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useState } from "react";

interface TabelaConsolidadaOSProps {
  osList: OS[];
}

export default function TabelaConsolidadaOS({ osList }: TabelaConsolidadaOSProps) {
  const [mostrarGraficos, setMostrarGraficos] = useState(true);

  const statusConfig = {
    "aberta": { label: "Aberta", color: "bg-blue-500", variant: "secondary" as const },
    "em-planejamento": { label: "Em planejamento", color: "bg-orange-500", variant: "outline" as const },
    "aguardando-aceite": { label: "Aguardando aceite", color: "bg-yellow-500", variant: "outline" as const },
    "em-execucao": { label: "Em execução", color: "bg-green-500", variant: "default" as const },
    "aguardando-aceite-fechamento": { label: "Aguardando aceite fechamento", color: "bg-purple-500", variant: "outline" as const },
    "concluida": { label: "Concluída", color: "bg-gray-500", variant: "secondary" as const },
    "cancelada": { label: "Cancelada", color: "bg-red-500", variant: "destructive" as const }
  };

  const capitalizarTexto = (texto: string) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Preparar dados para gráficos
  const dadosPorDisciplina = osList.reduce((acc, os) => {
    const disc = capitalizarTexto(os.disciplina);
    if (!acc[disc]) {
      acc[disc] = { disciplina: disc, valorSAO: 0, valorEngenharia: 0, valorSuprimentos: 0, quantidade: 0 };
    }
    acc[disc].valorSAO += os.valorOrcamento;
    acc[disc].valorEngenharia += os.valorEngenharia || 0;
    acc[disc].valorSuprimentos += os.valorSuprimentos || 0;
    acc[disc].quantidade += 1;
    return acc;
  }, {} as Record<string, any>);

  const graficoDisciplina = Object.values(dadosPorDisciplina);

  const dadosPorStatus = osList.reduce((acc, os) => {
    const status = statusConfig[os.status as keyof typeof statusConfig]?.label || capitalizarTexto(os.status);
    if (!acc[status]) {
      acc[status] = { name: status, value: 0 };
    }
    acc[status].value += 1;
    return acc;
  }, {} as Record<string, any>);

  const graficoStatus = Object.values(dadosPorStatus);

  const cores = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const osConcluidas = osList.filter(os => os.status === "concluida");
  const dadosPerformance = osConcluidas.map(os => ({
    os: `OS #${os.id}`,
    performance: os.valorOrcamento > 0 ? 
      ((os.valorOrcamento - (os.valorSuprimentos || 0)) / os.valorOrcamento * 100) : 0
  })).slice(0, 10);

  return (
    <>
      {/* Gráficos */}
      {mostrarGraficos && osList.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gráfico de Valores por Disciplina */}
          <Card>
            <CardHeader>
              <CardTitle>Valores por Disciplina</CardTitle>
              <CardDescription>Comparativo de valores SAO, engenharia e suprimentos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={graficoDisciplina}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="disciplina" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="valorSAO" fill="#3b82f6" name="Valor SAO" />
                  <Bar dataKey="valorEngenharia" fill="#10b981" name="Valor Engenharia" />
                  <Bar dataKey="valorSuprimentos" fill="#f59e0b" name="Valor Suprimentos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Status */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
              <CardDescription>Quantidade de OS em cada status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={graficoStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {graficoStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Performance */}
          {osConcluidas.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Financeira - OS Concluídas</CardTitle>
                <CardDescription>% de performance (Suprimentos x SAO) - Top 10 OS</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="os" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                    <Legend />
                    <Bar dataKey="performance" fill="#8b5cf6" name="% Performance" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tabela */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Visão Consolidada - Todas as OS</CardTitle>
              <CardDescription>
                Performance financeira detalhada por ordem de serviço
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMostrarGraficos(!mostrarGraficos)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {mostrarGraficos ? 'Ocultar' : 'Mostrar'} Gráficos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
        {osList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma OS encontrada.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OS</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor SAO</TableHead>
                <TableHead>Valor engenharia</TableHead>
                <TableHead>Valor suprimentos</TableHead>
                <TableHead>% Performance</TableHead>
                <TableHead>Data compromissada</TableHead>
                <TableHead>Responsável EM</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {osList.map((os) => {
                const valorEngenharia = os.valorEngenharia || 0;
                const valorSuprimentos = os.valorSuprimentos || 0;
                const performanceSAO = os.valorOrcamento > 0 ? 
                  ((os.valorOrcamento - valorSuprimentos) / os.valorOrcamento * 100) : 0;

                return (
                  <TableRow key={os.id}>
                    <TableCell className="font-medium">
                      OS #{os.id} - CCA {os.cca}
                    </TableCell>
                    <TableCell>{os.cliente}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {os.disciplina.toLowerCase() === "elétrica" ? (
                          <Zap className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <Cog className="h-4 w-4 text-blue-500" />
                        )}
                        {capitalizarTexto(os.disciplina)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[os.status as keyof typeof statusConfig]?.variant || "secondary"}>
                        {statusConfig[os.status as keyof typeof statusConfig]?.label || capitalizarTexto(os.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(os.valorOrcamento)}</div>
                      <div className="text-xs text-muted-foreground">(SAO Original)</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(valorEngenharia)}</div>
                      <div className="text-xs text-muted-foreground">(Engenharia)</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {os.status === "concluida" ? 
                          formatCurrency(valorSuprimentos) : 
                          <span className="text-muted-foreground">Pendente</span>
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {os.status === "concluida" ? "(Final)" : "(Aguardando)"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {os.status === "concluida" ? (
                        <div className={`font-bold ${performanceSAO >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {performanceSAO.toFixed(1)}%
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(os.dataCompromissada)}</TableCell>
                    <TableCell>{os.responsavelEM}</TableCell>
                    <TableCell>
                      <Link to={`/os/${os.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
    </>
  );
}