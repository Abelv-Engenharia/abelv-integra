import { useState, useMemo } from "react";
import { ArrowLeft, BarChart3, Users, FileText, TrendingUp, Hash, FilterX } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { commercialMockData, segmentoOptions, statusOptions, vendedorOptions } from "@/data/commercialMockData";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CommercialDashboard = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Estados dos filtros
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedSegmento, setSelectedSegmento] = useState<string>("todos");
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");
  const [selectedVendedor, setSelectedVendedor] = useState<string>("todos");

  // Gerar anos disponíveis
  const availableYears = useMemo(() => {
    const years = [];
    for (let year = 2022; year <= currentYear + 2; year++) {
      years.push(year.toString());
    }
    return years;
  }, [currentYear]);

  // Filtrar dados
  const filteredData = useMemo(() => {
    return commercialMockData.filter(item => {
      const itemYear = item.dataSaidaProposta.split('/')[2];
      const yearMatch = itemYear === selectedYear;
      const segmentoMatch = selectedSegmento === "todos" || item.segmento === selectedSegmento;
      const statusMatch = selectedStatus === "todos" || item.status === selectedStatus;
      const vendedorMatch = selectedVendedor === "todos" || item.vendedor === selectedVendedor;
      return yearMatch && segmentoMatch && statusMatch && vendedorMatch;
    });
  }, [selectedYear, selectedSegmento, selectedStatus, selectedVendedor]);

  // Função para limpar filtros
  const clearFilters = () => {
    setSelectedYear("2024");
    setSelectedSegmento("todos");
    setSelectedStatus("todos");
    setSelectedVendedor("todos");
  };

  // Formatação de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Dados para o gráfico de pizza de Positivação
  const contempladosData = filteredData.filter(item => item.status === 'Contemplado');
  const totalContempladoValor = contempladosData.reduce((sum, item) => sum + item.valorVenda, 0);
  const totalContempladoQtd = contempladosData.length;
  const totalGeralValor = filteredData.reduce((sum, item) => sum + item.valorVenda, 0);
  const totalGeralQtd = filteredData.length;

  const positivacaoData = [{
    name: 'Contemplado',
    valor: totalContempladoValor,
    quantidade: totalContempladoQtd
  }, {
    name: 'Total Geral',
    valor: totalGeralValor,
    quantidade: totalGeralQtd
  }];

  // Dados por Vendedor
  const vendedorData = filteredData.reduce((acc, item) => {
    const vendedor = item.vendedor;
    if (!acc[vendedor]) {
      acc[vendedor] = { vendedor, valor: 0, quantidade: 0 };
    }
    acc[vendedor].valor += item.valorVenda;
    acc[vendedor].quantidade += 1;
    return acc;
  }, {} as Record<string, { vendedor: string; valor: number; quantidade: number; }>);
  const vendedorChartData = Object.values(vendedorData);

  // Dados por Segmento
  const segmentoData = filteredData.reduce((acc, item) => {
    const segmento = item.segmento;
    if (!acc[segmento]) {
      acc[segmento] = { segmento, valor: 0, quantidade: 0 };
    }
    acc[segmento].valor += item.valorVenda;
    acc[segmento].quantidade += 1;
    return acc;
  }, {} as Record<string, { segmento: string; valor: number; quantidade: number; }>);
  const segmentoChartData = Object.values(segmentoData);

  // Dados por Status
  const statusFiltrados = ['Contemplado', 'Estimativa', 'Pré-Venda', 'Perdido'];
  const statusData = filteredData.filter(item => statusFiltrados.includes(item.status)).reduce((acc, item) => {
    const status = item.status;
    if (!acc[status]) {
      acc[status] = { status, valor: 0, quantidade: 0 };
    }
    acc[status].valor += item.valorVenda;
    acc[status].quantidade += 1;
    return acc;
  }, {} as Record<string, { status: string; valor: number; quantidade: number; }>);
  const statusChartData = Object.values(statusData);

  // Desempenho por Vendedor - Status das Propostas
  const vendedorStatusData = filteredData.reduce((acc, item) => {
    const vendedor = item.vendedor;
    const status = item.status;
    if (!acc[vendedor]) {
      acc[vendedor] = {
        vendedor,
        contemplado: 0,
        perdido: 0,
        estimativa: 0,
        preVenda: 0,
        contempladoQtd: 0,
        perdidoQtd: 0,
        estimativaQtd: 0,
        preVendaQtd: 0
      };
    }
    switch (status) {
      case 'Contemplado':
        acc[vendedor].contemplado += item.valorVenda;
        acc[vendedor].contempladoQtd += 1;
        break;
      case 'Perdido':
        acc[vendedor].perdido += item.valorVenda;
        acc[vendedor].perdidoQtd += 1;
        break;
      case 'Estimativa':
        acc[vendedor].estimativa += item.valorVenda;
        acc[vendedor].estimativaQtd += 1;
        break;
      case 'Pré-Venda':
        acc[vendedor].preVenda += item.valorVenda;
        acc[vendedor].preVendaQtd += 1;
        break;
    }
    return acc;
  }, {} as Record<string, any>);
  const vendedorStatusChartData = Object.values(vendedorStatusData);

  const chartConfig = {
    valor: { label: "Valor (R$)", color: "hsl(var(--primary))" },
    quantidade: { label: "Quantidade", color: "hsl(var(--secondary))" }
  };

  const statusColors = {
    contemplado: 'hsl(142, 76%, 36%)',
    estimativa: 'hsl(217, 91%, 60%)',
    preVenda: 'hsl(280, 65%, 60%)',
    perdido: 'hsl(0, 84%, 60%)'
  };

  const pieColors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted-foreground))', 'hsl(var(--destructive))'];

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/comercial/controle")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Análise consolidada da planilha comercial</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Selecione os filtros para visualizar os dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ano</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Segmento</label>
                <Select value={selectedSegmento} onValueChange={setSelectedSegmento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {segmentoOptions.map(segmento => <SelectItem key={segmento} value={segmento}>{segmento}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {statusOptions.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Vendedor</label>
                <Select value={selectedVendedor} onValueChange={setSelectedVendedor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {vendedorOptions.map(vendedor => <SelectItem key={vendedor} value={vendedor}>{vendedor}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium invisible">Ações</label>
                <Button variant="outline" onClick={clearFilters} className="w-full gap-2">
                  <FilterX className="h-4 w-4" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        {filteredData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total de Propostas</p>
                  <p className="text-2xl font-bold">{filteredData.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalGeralValor)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contemplados</p>
                  <p className="text-2xl font-bold text-green-600">{totalContempladoQtd}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor Contemplado</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalContempladoValor)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredData.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum dado disponível para os filtros selecionados.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Gráfico de Pizza - Positivação */}
              <Card>
                <CardHeader>
                  <CardTitle>Positivação</CardTitle>
                  <CardDescription>Propostas Contempladas vs Total</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={positivacaoData}
                          dataKey="valor"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label
                        >
                          {positivacaoData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Barras - Vendedores */}
              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Vendedor</CardTitle>
                  <CardDescription>Valor total de vendas por vendedor</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={vendedorChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="vendedor" />
                        <YAxis tickFormatter={(value) => formatCurrency(Number(value))} />
                        <Tooltip content={<ChartTooltipContent />} formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="valor" fill={chartConfig.valor.color} name={chartConfig.valor.label} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Barras - Segmentos */}
              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Segmento</CardTitle>
                  <CardDescription>Valor total de vendas por segmento</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={segmentoChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="segmento" />
                        <YAxis tickFormatter={(value) => formatCurrency(Number(value))} />
                        <Tooltip content={<ChartTooltipContent />} formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="valor" fill={chartConfig.valor.color} name={chartConfig.valor.label} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Barras - Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Status</CardTitle>
                  <CardDescription>Valor total de vendas por status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis tickFormatter={(value) => formatCurrency(Number(value))} />
                        <Tooltip content={<ChartTooltipContent />} formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="valor" fill={chartConfig.valor.color} name={chartConfig.valor.label} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Barras Empilhadas - Desempenho por Vendedor */}
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho por Vendedor</CardTitle>
                  <CardDescription>Status das propostas por vendedor</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={vendedorStatusChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="vendedor" />
                        <YAxis tickFormatter={(value) => formatCurrency(Number(value))} />
                        <Tooltip content={<ChartTooltipContent />} formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="contemplado" stackId="a" fill={statusColors.contemplado} name="Contemplado" />
                        <Bar dataKey="estimativa" stackId="a" fill={statusColors.estimativa} name="Estimativa" />
                        <Bar dataKey="preVenda" stackId="a" fill={statusColors.preVenda} name="Pré-Venda" />
                        <Bar dataKey="perdido" stackId="a" fill={statusColors.perdido} name="Perdido" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommercialDashboard;
