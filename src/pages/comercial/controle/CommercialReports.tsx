import { useRef, useState, useMemo } from "react";
import { FileSpreadsheet, FileDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts";
import { usePropostasComerciais } from "@/hooks/comercial/usePropostasComerciais";
import { formatarMoeda } from "@/utils/reportDataUtils";
import { exportarParaExcel, exportarParaPDF } from "@/utils/exportUtils";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// Tipos para os dados agrupados
interface StatusData {
  name: string;
  value: number;
}

interface VendedorData {
  vendedor: string;
  quantidade: number;
  totalOrcado: number;
  contemplado: number;
  perdido: number;
  estimativa: number;
  contempladoValor: number;
  perdidoValor: number;
  estimativaValor: number;
}

interface SegmentoData {
  segmento: string;
  quantidade: number;
  totalOrcado: number;
  contemplado: number;
  perdido: number;
  estimativa: number;
}

interface ClienteData {
  cliente: string;
  quantidade: number;
  totalOrcado: number;
  contemplado: number;
  perdido: number;
  estimativa: number;
  contempladoValor: number;
  perdidoValor: number;
  estimativaValor: number;
}

// Funções auxiliares para processar dados
const contarPorStatus = (data: any[]): StatusData[] => {
  const contagem = data.reduce((acc, item) => {
    const status = item.status;
    if (!acc[status]) {
      acc[status] = { name: status, value: 0 };
    }
    acc[status].value += 1;
    return acc;
  }, {} as Record<string, StatusData>);
  return Object.values(contagem);
};

const agruparValoresMonetariosPorStatus = (data: any[]): StatusData[] => {
  const agrupado = data.reduce((acc, item) => {
    const status = item.status;
    if (!acc[status]) {
      acc[status] = { name: status, value: 0 };
    }
    acc[status].value += item.valor_venda || 0;
    return acc;
  }, {} as Record<string, StatusData>);
  return Object.values(agrupado);
};

const calcularMargemMediaContempladas = (data: any[]) => {
  const contempladas = data.filter(item => item.status === 'Contemplado');
  const totalMargens = contempladas.reduce((sum, item) => sum + (item.margem_percentual || 0), 0);
  const valorTotal = contempladas.reduce((sum, item) => sum + (item.valor_venda || 0), 0);
  return {
    margemMedia: contempladas.length > 0 ? totalMargens / contempladas.length : 0,
    quantidade: contempladas.length,
    valorTotal
  };
};

const agruparPorVendedor = (data: any[]): VendedorData[] => {
  const agrupado = data.reduce((acc, item) => {
    const vendedor = item.vendedores_comercial?.profiles?.nome || 'Sem Vendedor';
    if (!acc[vendedor]) {
      acc[vendedor] = { 
        vendedor, 
        quantidade: 0, 
        totalOrcado: 0,
        contemplado: 0,
        perdido: 0,
        estimativa: 0,
        contempladoValor: 0,
        perdidoValor: 0,
        estimativaValor: 0
      };
    }
    acc[vendedor].quantidade += 1;
    acc[vendedor].totalOrcado += item.valor_venda || 0;
    
    if (item.status === 'Contemplado') {
      acc[vendedor].contemplado += 1;
      acc[vendedor].contempladoValor += item.valor_venda || 0;
    } else if (item.status === 'Perdido') {
      acc[vendedor].perdido += 1;
      acc[vendedor].perdidoValor += item.valor_venda || 0;
    } else if (item.status === 'Estimativa' || item.status === 'Pré-Venda') {
      acc[vendedor].estimativa += 1;
      acc[vendedor].estimativaValor += item.valor_venda || 0;
    }
    return acc;
  }, {} as Record<string, VendedorData>);
  return Object.values(agrupado);
};

const agruparPorSegmento = (data: any[]): SegmentoData[] => {
  const agrupado = data.reduce((acc, item) => {
    const segmento = item.segmentos_comercial?.nome || 'Sem Segmento';
    if (!acc[segmento]) {
      acc[segmento] = { 
        segmento, 
        quantidade: 0, 
        totalOrcado: 0,
        contemplado: 0,
        perdido: 0,
        estimativa: 0
      };
    }
    acc[segmento].quantidade += 1;
    acc[segmento].totalOrcado += item.valor_venda || 0;
    
    if (item.status === 'Contemplado') {
      acc[segmento].contemplado += 1;
    } else if (item.status === 'Perdido') {
      acc[segmento].perdido += 1;
    } else if (item.status === 'Estimativa' || item.status === 'Pré-Venda') {
      acc[segmento].estimativa += 1;
    }
    return acc;
  }, {} as Record<string, SegmentoData>);
  return Object.values(agrupado);
};

const agruparPorCliente = (data: any[]): ClienteData[] => {
  const agrupado = data.reduce((acc, item) => {
    const cliente = item.cliente || 'Sem Cliente';
    if (!acc[cliente]) {
      acc[cliente] = { 
        cliente, 
        quantidade: 0, 
        totalOrcado: 0,
        contemplado: 0,
        perdido: 0,
        estimativa: 0,
        contempladoValor: 0,
        perdidoValor: 0,
        estimativaValor: 0
      };
    }
    acc[cliente].quantidade += 1;
    acc[cliente].totalOrcado += item.valor_venda || 0;
    
    if (item.status === 'Contemplado') {
      acc[cliente].contemplado += 1;
      acc[cliente].contempladoValor += item.valor_venda || 0;
    } else if (item.status === 'Perdido') {
      acc[cliente].perdido += 1;
      acc[cliente].perdidoValor += item.valor_venda || 0;
    } else if (item.status === 'Estimativa' || item.status === 'Pré-Venda') {
      acc[cliente].estimativa += 1;
      acc[cliente].estimativaValor += item.valor_venda || 0;
    }
    return acc;
  }, {} as Record<string, ClienteData>);
  return Object.values(agrupado);
};

const CommercialReports = () => {
  const [activeTab, setActiveTab] = useState("propostas-emitidas");
  const { propostas, isLoading } = usePropostasComerciais();

  // Refs para capturar gráficos
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
  const chartRef3 = useRef<HTMLDivElement>(null);
  const chartRef4 = useRef<HTMLDivElement>(null);
  const chartRef5 = useRef<HTMLDivElement>(null);

  // Dados filtrados e processados
  const propostasEmitidas = useMemo(() => propostas, [propostas]);
  
  const propostasEstimativas = useMemo(
    () => propostas.filter((p) => p.status === "Estimativa" || p.status === "Pré-Venda"),
    [propostas]
  );
  
  const desempenhoPorVendedor = useMemo(() => agruparPorVendedor(propostas), [propostas]);
  const desempenhoPorSegmento = useMemo(() => agruparPorSegmento(propostas), [propostas]);
  const desempenhoPorCliente = useMemo(() => agruparPorCliente(propostas), [propostas]);

  // Dados para gráficos
  const statusData1 = useMemo(() => contarPorStatus(propostasEmitidas), [propostasEmitidas]);
  const statusData2 = useMemo(() => contarPorStatus(propostasEstimativas), [propostasEstimativas]);
  const valoresMonetariosPorStatus = useMemo(
    () => agruparValoresMonetariosPorStatus(propostasEmitidas),
    [propostasEmitidas]
  );
  const margemMediaData = useMemo(
    () => calcularMargemMediaContempladas(propostasEmitidas),
    [propostasEmitidas]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando relatórios...</p>
      </div>
    );
  }

  // Funções de exportação - Propostas Emitidas
  const exportarPropostasEmitidas = (formato: "excel" | "pdf") => {
    const dados = propostasEmitidas.map((p) => ({
      PC: p.pc,
      Cliente: p.cliente,
      "Valor de Venda": formatarMoeda(p.valor_venda || 0),
      "Margem (%)": `${(p.margem_percentual || 0).toFixed(2)}%`,
      Revisão: p.numero_revisao || 0,
      Status: p.status,
    }));

    if (formato === "excel") {
      exportarParaExcel(dados, "Propostas_Emitidas", [
        "PC",
        "Cliente",
        "Valor de Venda",
        "Margem (%)",
        "Revisão",
        "Status",
      ]);
    } else {
      const dadosTabela = propostasEmitidas.map((p) => [
        p.pc,
        p.cliente,
        formatarMoeda(p.valor_venda || 0),
        `${(p.margem_percentual || 0).toFixed(2)}%`,
        String(p.numero_revisao || 0),
        p.status,
      ]);
      exportarParaPDF(
        "Propostas Emitidas",
        dadosTabela,
        ["PC", "Cliente", "Valor de Venda", "Margem (%)", "Revisão", "Status"],
        chartRef1
      );
    }
  };

  // Funções de exportação - Propostas Estimativas
  const exportarPropostasEstimativas = (formato: "excel" | "pdf") => {
    const dados = propostasEstimativas.map((p) => ({
      PC: p.pc,
      Cliente: p.cliente,
      "Valor de Venda": formatarMoeda(p.valor_venda || 0),
      "Margem (%)": `${(p.margem_percentual || 0).toFixed(2)}%`,
      Revisão: p.numero_revisao || 0,
      Status: p.status,
    }));

    if (formato === "excel") {
      exportarParaExcel(dados, "Propostas_Estimativas_PreVendas", [
        "PC",
        "Cliente",
        "Valor de Venda",
        "Margem (%)",
        "Revisão",
        "Status",
      ]);
    } else {
      const dadosTabela = propostasEstimativas.map((p) => [
        p.pc,
        p.cliente,
        formatarMoeda(p.valor_venda || 0),
        `${(p.margem_percentual || 0).toFixed(2)}%`,
        String(p.numero_revisao || 0),
        p.status,
      ]);
      exportarParaPDF(
        "Propostas Estimativas e Pré-Vendas",
        dadosTabela,
        ["PC", "Cliente", "Valor de Venda", "Margem (%)", "Revisão", "Status"],
        chartRef2
      );
    }
  };

  // Funções de exportação - Desempenho por Vendedor
  const exportarDesempenhoVendedor = (formato: "excel" | "pdf") => {
    const dados = desempenhoPorVendedor.map((v) => ({
      Vendedor: v.vendedor,
      "Quantidade de Propostas": v.quantidade,
      "Total Orçado": formatarMoeda(v.totalOrcado),
    }));

    if (formato === "excel") {
      exportarParaExcel(dados, "Desempenho_Por_Vendedor", [
        "Vendedor",
        "Quantidade de Propostas",
        "Total Orçado",
      ]);
    } else {
      const dadosTabela = desempenhoPorVendedor.map((v) => [
        v.vendedor,
        String(v.quantidade),
        formatarMoeda(v.totalOrcado),
      ]);
      exportarParaPDF(
        "Desempenho Por Vendedor",
        dadosTabela,
        ["Vendedor", "Quantidade de Propostas", "Total Orçado"],
        chartRef3
      );
    }
  };

  // Funções de exportação - Desempenho por Segmento
  const exportarDesempenhoSegmento = (formato: "excel" | "pdf") => {
    const dados = desempenhoPorSegmento.map((s) => ({
      Segmento: s.segmento,
      "Quantidade de Propostas": s.quantidade,
      "Total Orçado": formatarMoeda(s.totalOrcado),
    }));

    if (formato === "excel") {
      exportarParaExcel(dados, "Desempenho_Por_Segmento", [
        "Segmento",
        "Quantidade de Propostas",
        "Total Orçado",
      ]);
    } else {
      const dadosTabela = desempenhoPorSegmento.map((s) => [
        s.segmento,
        String(s.quantidade),
        formatarMoeda(s.totalOrcado),
      ]);
      exportarParaPDF(
        "Desempenho Por Segmento",
        dadosTabela,
        ["Segmento", "Quantidade de Propostas", "Total Orçado"],
        chartRef4
      );
    }
  };

  // Funções de exportação - Desempenho por Cliente
  const exportarDesempenhoCliente = (formato: "excel" | "pdf") => {
    const dados = desempenhoPorCliente.map((c) => ({
      Cliente: c.cliente,
      "Quantidade de Propostas": c.quantidade,
      "Total Orçado": formatarMoeda(c.totalOrcado),
    }));

    if (formato === "excel") {
      exportarParaExcel(dados, "Desempenho_Por_Cliente", [
        "Cliente",
        "Quantidade de Propostas",
        "Total Orçado",
      ]);
    } else {
      const dadosTabela = desempenhoPorCliente.map((c) => [
        c.cliente,
        String(c.quantidade),
        formatarMoeda(c.totalOrcado),
      ]);
      exportarParaPDF(
        "Desempenho Por Cliente",
        dadosTabela,
        ["Cliente", "Quantidade de Propostas", "Total Orçado"],
        chartRef5
      );
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Relatórios Comerciais</h1>
            <p className="text-sm text-muted-foreground">
              Exportação de relatórios em Excel e PDF
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="propostas-emitidas">Propostas Emitidas</TabsTrigger>
          <TabsTrigger value="propostas-estimativas">Estimativas/Pré-Vendas</TabsTrigger>
          <TabsTrigger value="vendedor">Por Vendedor</TabsTrigger>
          <TabsTrigger value="segmento">Por Segmento</TabsTrigger>
          <TabsTrigger value="cliente">Por Cliente</TabsTrigger>
        </TabsList>

        {/* Propostas Emitidas */}
        <TabsContent value="propostas-emitidas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Propostas Emitidas</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportarPropostasEmitidas("excel")}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportarPropostasEmitidas("pdf")}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PC</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor de Venda</TableHead>
                      <TableHead>Margem (%)</TableHead>
                      <TableHead>Revisão</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {propostasEmitidas.map((proposta) => (
                      <TableRow key={proposta.id}>
                        <TableCell>{proposta.pc}</TableCell>
                        <TableCell>{proposta.cliente}</TableCell>
                        <TableCell>{formatarMoeda(proposta.valor_venda || 0)}</TableCell>
                        <TableCell>{(proposta.margem_percentual || 0).toFixed(2)}%</TableCell>
                        <TableCell>{proposta.numero_revisao || 0}</TableCell>
                        <TableCell>{proposta.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div ref={chartRef1} className="bg-background p-4 rounded-lg">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Gráfico 1: Distribuição por Status (%) */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Distribuição por Status (%)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusData1}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData1.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Gráfico 2: Valores Monetários por Status (R$) */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Valores Monetários por Status (R$)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={valoresMonetariosPorStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) =>
                            `${name}: ${formatarMoeda(value)}`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {valoresMonetariosPorStatus.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatarMoeda(value)}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Gráfico 3: KPI Margem Média - Propostas Contempladas */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Margem Média - Propostas Contempladas
                    </h3>
                    <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-green-600">
                          {margemMediaData.margemMedia.toFixed(2)}%
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Margem Média
                        </p>
                      </div>
                      
                      <div className="w-full max-w-xs space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quantidade:</span>
                          <span className="font-semibold">
                            {margemMediaData.quantidade} propostas
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Valor Total:</span>
                          <span className="font-semibold">
                            {formatarMoeda(margemMediaData.valorTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Propostas Estimativas/Pré-Vendas */}
        <TabsContent value="propostas-estimativas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Propostas Estimativas e Pré-Vendas</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportarPropostasEstimativas("excel")}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportarPropostasEstimativas("pdf")}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PC</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor de Venda</TableHead>
                      <TableHead>Margem (%)</TableHead>
                      <TableHead>Revisão</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {propostasEstimativas.map((proposta) => (
                      <TableRow key={proposta.id}>
                        <TableCell>{proposta.pc}</TableCell>
                        <TableCell>{proposta.cliente}</TableCell>
                        <TableCell>{formatarMoeda(proposta.valor_venda || 0)}</TableCell>
                        <TableCell>{(proposta.margem_percentual || 0).toFixed(2)}%</TableCell>
                        <TableCell>{proposta.numero_revisao || 0}</TableCell>
                        <TableCell>{proposta.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div ref={chartRef2} className="bg-background p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Distribuição por Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData2}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData2.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Desempenho por Vendedor */}
        <TabsContent value="vendedor" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Desempenho por Vendedor</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportarDesempenhoVendedor("excel")}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportarDesempenhoVendedor("pdf")}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendedor</TableHead>
                      <TableHead>Quantidade de Propostas</TableHead>
                      <TableHead>Total Orçado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {desempenhoPorVendedor.map((vendedor) => (
                      <TableRow key={vendedor.vendedor}>
                        <TableCell>{vendedor.vendedor}</TableCell>
                        <TableCell>{vendedor.quantidade}</TableCell>
                        <TableCell>{formatarMoeda(vendedor.totalOrcado)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div ref={chartRef3} className="bg-background p-4 rounded-lg space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quantidade por Vendedor</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={desempenhoPorVendedor}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="vendedor" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantidade" fill="#3b82f6" name="Quantidade" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Valores Financeiros por Status e Vendedor (R$)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={desempenhoPorVendedor}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="vendedor" />
                      <YAxis tickFormatter={(value) => formatarMoeda(value)} />
                      <Tooltip
                        formatter={(value: number) => formatarMoeda(value)}
                      />
                      <Legend />
                      <Bar dataKey="contempladoValor" stackId="a" fill="#10b981" name="Contemplado" />
                      <Bar dataKey="perdidoValor" stackId="a" fill="#ef4444" name="Perdido" />
                      <Bar dataKey="estimativaValor" stackId="a" fill="#f59e0b" name="Estimativa/Pré-Venda" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Desempenho por Segmento */}
        <TabsContent value="segmento" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Desempenho por Segmento</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportarDesempenhoSegmento("excel")}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportarDesempenhoSegmento("pdf")}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Segmento</TableHead>
                      <TableHead>Quantidade de Propostas</TableHead>
                      <TableHead>Total Orçado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {desempenhoPorSegmento.map((segmento) => (
                      <TableRow key={segmento.segmento}>
                        <TableCell>{segmento.segmento}</TableCell>
                        <TableCell>{segmento.quantidade}</TableCell>
                        <TableCell>{formatarMoeda(segmento.totalOrcado)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div ref={chartRef4} className="bg-background p-4 rounded-lg space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quantidade por Segmento</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={desempenhoPorSegmento}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="segmento" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantidade" fill="#3b82f6" name="Quantidade" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Status por Segmento</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={desempenhoPorSegmento}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="segmento" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="contemplado" stackId="a" fill="#10b981" name="Contemplado" />
                      <Bar dataKey="perdido" stackId="a" fill="#ef4444" name="Perdido" />
                      <Bar dataKey="estimativa" stackId="a" fill="#f59e0b" name="Estimativa/Pré-Venda" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Desempenho por Cliente */}
        <TabsContent value="cliente" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Desempenho por Cliente</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportarDesempenhoCliente("excel")}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportarDesempenhoCliente("pdf")}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Quantidade de Propostas</TableHead>
                      <TableHead>Total Orçado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {desempenhoPorCliente.map((cliente) => (
                      <TableRow key={cliente.cliente}>
                        <TableCell>{cliente.cliente}</TableCell>
                        <TableCell>{cliente.quantidade}</TableCell>
                        <TableCell>{formatarMoeda(cliente.totalOrcado)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div ref={chartRef5} className="bg-background p-4 rounded-lg space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quantidade e Valor Total por Cliente</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={desempenhoPorCliente}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cliente" angle={-45} textAnchor="end" height={100} />
                      <YAxis 
                        yAxisId="left"
                        label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                        label={{ value: 'Valor (R$)', angle: 90, position: 'insideRight' }}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => {
                          if (name === 'Total Orçado (R$)') {
                            return formatarMoeda(value);
                          }
                          return value;
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="quantidade" fill="#3b82f6" name="Quantidade de Propostas" />
                      <Line yAxisId="right" type="monotone" dataKey="totalOrcado" stroke="#10b981" strokeWidth={2} name="Total Orçado (R$)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Quantidade e Valores Financeiros por Status e Cliente</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={desempenhoPorCliente}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cliente" angle={-45} textAnchor="end" height={100} />
                      <YAxis 
                        yAxisId="left"
                        label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                        label={{ value: 'Valor (R$)', angle: 90, position: 'insideRight' }}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => {
                          if (name.includes('Valor')) {
                            return formatarMoeda(value);
                          }
                          return value;
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="contemplado" stackId="qtd" fill="#10b981" name="Contemplado (Qtd)" />
                      <Bar yAxisId="left" dataKey="perdido" stackId="qtd" fill="#ef4444" name="Perdido (Qtd)" />
                      <Bar yAxisId="left" dataKey="estimativa" stackId="qtd" fill="#f59e0b" name="Estimativa/Pré-Venda (Qtd)" />
                      <Line yAxisId="right" type="monotone" dataKey="contempladoValor" stroke="#10b981" strokeWidth={2} name="Contemplado Valor (R$)" strokeDasharray="5 5" />
                      <Line yAxisId="right" type="monotone" dataKey="perdidoValor" stroke="#ef4444" strokeWidth={2} name="Perdido Valor (R$)" strokeDasharray="5 5" />
                      <Line yAxisId="right" type="monotone" dataKey="estimativaValor" stroke="#f59e0b" strokeWidth={2} name="Estimativa Valor (R$)" strokeDasharray="5 5" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommercialReports;
