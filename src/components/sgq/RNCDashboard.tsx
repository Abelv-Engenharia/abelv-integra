import { useState } from "react";
import { Search, Filter, Calendar, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, PriorityBadge } from "./StatusBadge";
import { useRNCData } from "@/hooks/sgq/useRNCData";
import { useRNCPdfGenerator } from "@/hooks/sgq/useRNCPdfGenerator";
import { Link } from "react-router-dom";
import { RNC } from "@/types/sgq";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useToast } from "@/components/ui/use-toast";

export const RNCDashboard = () => {
  const { rncs, loading } = useRNCData();
  const { downloadPDF } = useRNCPdfGenerator();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "aberta" | "fechada">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "critica" | "moderada" | "leve">("all");
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);

  const filteredRNCs = rncs.filter(rnc => {
    const matchesSearch = rnc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rnc.descricao_nc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rnc.emitente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || rnc.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || rnc.prioridade === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: rncs.length,
    abertas: rncs.filter(r => r.status === 'aberta').length,
    fechadas: rncs.filter(r => r.status === 'fechada').length,
    criticas: rncs.filter(r => r.prioridade === 'critica' && r.status === 'aberta').length
  };

  const handleGeneratePDF = async (rncId: string, rncNumero: string) => {
    setGeneratingPdf(rncId);
    try {
      await downloadPDF(rncId);
      toast({
        title: "PDF gerado com sucesso",
        description: `O relatório da RNC #${rncNumero} foi gerado.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPdf(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total RNCs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Abertas</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.abertas}</div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fechadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.fechadas}</div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Críticas Abertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-critical" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-critical">{stats.criticas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Pizza */}
      <Card className="mb-6 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Distribuição de RNCs</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.total > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Abertas', value: stats.abertas, color: 'hsl(var(--warning))' },
                    { name: 'Fechadas', value: stats.fechadas, color: 'hsl(var(--success))' },
                    { name: 'Críticas Abertas', value: stats.criticas, color: 'hsl(var(--critical))' }
                  ].filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Abertas', value: stats.abertas, color: 'hsl(var(--warning))' },
                    { name: 'Fechadas', value: stats.fechadas, color: 'hsl(var(--success))' },
                    { name: 'Críticas Abertas', value: stats.criticas, color: 'hsl(var(--critical))' }
                  ].filter(item => item.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} RNCs`, 'Quantidade']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Sem dados para exibir
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, descrição ou emitente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={statusFilter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                Todas
              </Button>
              <Button 
                variant={statusFilter === "aberta" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("aberta")}
              >
                Abertas
              </Button>
              <Button 
                variant={statusFilter === "fechada" ? "default" : "outline"} 
                size="sm"
                onClick={() => setStatusFilter("fechada")}
              >
                Fechadas
              </Button>
            </div>

            <div className="flex gap-2">
              <Button 
                variant={priorityFilter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setPriorityFilter("all")}
              >
                Todas Prioridades
              </Button>
              <Button 
                variant={priorityFilter === "critica" ? "default" : "outline"} 
                size="sm"
                onClick={() => setPriorityFilter("critica")}
              >
                Críticas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RNC List */}
      <div className="grid gap-4">
        {filteredRNCs.map((rnc) => (
          <Card key={rnc.id} className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">RNC #{rnc.numero}</h3>
                    <StatusBadge status={rnc.status} />
                    <PriorityBadge priority={rnc.prioridade} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>CCA: {rnc.cca}</span>
                    <span>Emitente: {rnc.emitente}</span>
                    <span>Setor: {rnc.setor_projeto}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Previsão</div>
                  <div className="text-sm font-medium">{new Date(rnc.previsao_fechamento).toLocaleDateString('pt-BR')}</div>
                </div>
              </div>

              <p className="text-sm text-foreground mb-4 line-clamp-2">{rnc.descricao_nc}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {rnc.disciplina.map((disc) => (
                    <Badge key={disc} variant="outline" className="text-xs">
                      {disc}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleGeneratePDF(rnc.id, rnc.numero)}
                    disabled={generatingPdf === rnc.id}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {generatingPdf === rnc.id ? 'Gerando...' : 'Visualizar RNC'}
                  </Button>
                  <Link to={`/sgq/rnc/${rnc.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRNCs.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma RNC encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou criar uma nova RNC.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
