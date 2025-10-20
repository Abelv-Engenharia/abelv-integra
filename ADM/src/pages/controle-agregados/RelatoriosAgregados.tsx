import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Calendar, TrendingUp, Users, Building2, DollarSign } from "lucide-react";
import { toast } from "sonner";

const mockRelatorioOcupacao = [
  {
    id: "A01",
    nome: "MOI 01 - Gerente",
    capacidade: 12,
    ocupacao_atual: 8,
    ocupacao_media: 9.2,
    taxa_ocupacao: 67,
    vagas_disponiveis: 4
  },
  {
    id: "A02",
    nome: "MOD 01 - Operários",
    capacidade: 20,
    ocupacao_atual: 18,
    ocupacao_media: 16.8,
    taxa_ocupacao: 90,
    vagas_disponiveis: 2
  }
];

const mockRelatorioCustoColaborador = [
  {
    colaborador: "Lara Cristinia",
    re: "12345",
    alojamento: "MOI 01 - Gerente",
    cca: "24043",
    valor_mensal: 218.25,
    periodo_ocupacao: "01/09 - 30/09",
    dias_ocupados: 30
  },
  {
    colaborador: "João Santos",
    re: "12348",
    alojamento: "MOD 01 - Operários",
    cca: "24043",
    valor_mensal: 225.00,
    periodo_ocupacao: "01/09 - 30/09",
    dias_ocupados: 30
  }
];

const mockComparativoContrato = [
  {
    alojamento: "MOI 01 - Gerente",
    fornecedor: "Bruno Martins Moreira",
    valor_contrato: 2619.00,
    valor_nf: 2619.00,
    diferenca: 0,
    percentual_diferenca: 0
  },
  {
    alojamento: "MOD 01 - Operários",
    fornecedor: "Embu Mercearia",
    valor_contrato: 4500.00,
    valor_nf: 4650.00,
    diferenca: 150.00,
    percentual_diferenca: 3.33
  }
];

const mockConsolidadoFornecedor = [
  {
    fornecedor: "Bruno Martins Moreira",
    total_contratos: 2,
    valor_total_mensal: 4419.00,
    alojamentos: ["MOI 01 - Gerente", "Supervisores A"],
    status: "Ativo"
  },
  {
    fornecedor: "Embu Mercearia Delicias",
    total_contratos: 1,
    valor_total_mensal: 4500.00,
    alojamentos: ["MOD 01 - Operários"],
    status: "Ativo"
  }
];

const mockRankingObras = [
  {
    cca: "24043",
    nome_obra: "Obra São Paulo Centro",
    total_alojamentos: 3,
    total_colaboradores: 42,
    custo_mensal: 12450.00,
    custo_por_colaborador: 296.43
  },
  {
    cca: "24044",
    nome_obra: "Obra Guarulhos",
    total_alojamentos: 2,
    total_colaboradores: 28,
    custo_mensal: 8900.00,
    custo_por_colaborador: 317.86
  }
];

export default function RelatoriosAgregados() {
  const [periodoInicio, setPeriodoInicio] = useState("2024-09-01");
  const [periodoFim, setPeriodoFim] = useState("2024-09-30");
  const [ccaSelecionado, setCcaSelecionado] = useState("all");
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState("all");

  const handleExportPDF = (tipoRelatorio: string) => {
    toast.success(`Relatório ${tipoRelatorio} exportado em PDF`);
  };

  const handleExportExcel = (tipoRelatorio: string) => {
    toast.success(`Relatório ${tipoRelatorio} exportado em Excel`);
  };

  const getDiferencaColor = (diferenca: number) => {
    if (diferenca > 0) return "text-red-600";
    if (diferenca < 0) return "text-green-600";
    return "text-gray-600";
  };

  const getOcupacaoColor = (percentual: number) => {
    if (percentual >= 90) return "text-red-600";
    if (percentual >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Relatórios consolidados de alojamento de colaboradores</p>
        </div>
      </div>

      {/* Filtros Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Filtros gerais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodo-inicio">Período - Início</Label>
              <Input
                id="periodo-inicio"
                type="date"
                value={periodoInicio}
                onChange={(e) => setPeriodoInicio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo-fim">Período - Fim</Label>
              <Input
                id="periodo-fim"
                type="date"
                value={periodoFim}
                onChange={(e) => setPeriodoFim(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>CCA / Obra</Label>
              <Select value={ccaSelecionado} onValueChange={setCcaSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os CCAs</SelectItem>
                  <SelectItem value="24043">24043 - Obra São Paulo Centro</SelectItem>
                  <SelectItem value="24044">24044 - Obra Guarulhos</SelectItem>
                  <SelectItem value="24045">24045 - Obra Osasco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fornecedor</Label>
              <Select value={fornecedorSelecionado} onValueChange={setFornecedorSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os fornecedores</SelectItem>
                  <SelectItem value="bruno">Bruno Martins Moreira</SelectItem>
                  <SelectItem value="embu">Embu Mercearia Delicias</SelectItem>
                  <SelectItem value="xyz">Locações XYZ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abas de Relatórios */}
      <Tabs defaultValue="ocupacao" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ocupacao">Ocupação</TabsTrigger>
          <TabsTrigger value="custo-colaborador">Custo por colaborador</TabsTrigger>
          <TabsTrigger value="comparativo">Comparativo contrato x NF</TabsTrigger>
          <TabsTrigger value="fornecedor">Por fornecedor</TabsTrigger>
          <TabsTrigger value="ranking">Ranking obras</TabsTrigger>
        </TabsList>

        {/* Relatório de Ocupação por Alojamento */}
        <TabsContent value="ocupacao">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Ocupação por alojamento
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExportPDF("Ocupação")}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportExcel("Ocupação")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alojamento</TableHead>
                    <TableHead className="text-center">Capacidade</TableHead>
                    <TableHead className="text-center">Ocupação atual</TableHead>
                    <TableHead className="text-center">Ocupação média</TableHead>
                    <TableHead className="text-center">Taxa ocupação</TableHead>
                    <TableHead className="text-center">Vagas disponíveis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRelatorioOcupacao.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-center">{item.capacidade}</TableCell>
                      <TableCell className="text-center font-medium">{item.ocupacao_atual}</TableCell>
                      <TableCell className="text-center">{item.ocupacao_media}</TableCell>
                      <TableCell className="text-center">
                        <span className={`font-bold ${getOcupacaoColor(item.taxa_ocupacao)}`}>
                          {item.taxa_ocupacao}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-green-600 font-medium">
                        {item.vagas_disponiveis}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório de Custo por Colaborador */}
        <TabsContent value="custo-colaborador">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Custo mensal por colaborador / obra
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExportPDF("Custo por Colaborador")}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportExcel("Custo por Colaborador")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>RE</TableHead>
                    <TableHead>Alojamento</TableHead>
                    <TableHead>CCA</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead className="text-center">Dias ocupados</TableHead>
                    <TableHead className="text-right">Valor mensal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRelatorioCustoColaborador.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.colaborador}</TableCell>
                      <TableCell>{item.re}</TableCell>
                      <TableCell>{item.alojamento}</TableCell>
                      <TableCell className="font-medium">{item.cca}</TableCell>
                      <TableCell className="text-sm">{item.periodo_ocupacao}</TableCell>
                      <TableCell className="text-center">{item.dias_ocupados}</TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {item.valor_mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório Comparativo Contrato x NF */}
        <TabsContent value="comparativo">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Comparativo contrato x NF
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExportPDF("Comparativo")}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportExcel("Comparativo")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alojamento</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead className="text-right">Valor contrato</TableHead>
                    <TableHead className="text-right">Valor NF</TableHead>
                    <TableHead className="text-right">Diferença</TableHead>
                    <TableHead className="text-right">% Diferença</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockComparativoContrato.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.alojamento}</TableCell>
                      <TableCell>{item.fornecedor}</TableCell>
                      <TableCell className="text-right">
                        R$ {item.valor_contrato.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {item.valor_nf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${getDiferencaColor(item.diferenca)}`}>
                        {item.diferenca >= 0 ? '+' : ''}R$ {item.diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${getDiferencaColor(item.diferenca)}`}>
                        {item.percentual_diferenca >= 0 ? '+' : ''}{item.percentual_diferenca.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório Consolidado por Fornecedor */}
        <TabsContent value="fornecedor">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Consolidado de custos por fornecedor
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExportPDF("Por Fornecedor")}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportExcel("Por Fornecedor")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead className="text-center">Total contratos</TableHead>
                    <TableHead>Alojamentos</TableHead>
                    <TableHead className="text-right">Valor total mensal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockConsolidadoFornecedor.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.fornecedor}</TableCell>
                      <TableCell className="text-center">{item.total_contratos}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {item.alojamentos.map((aloj, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs mr-1">
                              {aloj}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        R$ {item.valor_total_mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ranking de Obras por Custo */}
        <TabsContent value="ranking">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Ranking de obras por custo
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExportPDF("Ranking Obras")}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportExcel("Ranking Obras")}>
                  <FileText className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posição</TableHead>
                    <TableHead>CCA</TableHead>
                    <TableHead>Nome da obra</TableHead>
                    <TableHead className="text-center">Alojamentos</TableHead>
                    <TableHead className="text-center">Colaboradores</TableHead>
                    <TableHead className="text-right">Custo mensal</TableHead>
                    <TableHead className="text-right">Custo por colaborador</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRankingObras.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-bold text-lg">{index + 1}º</TableCell>
                      <TableCell className="font-medium">{item.cca}</TableCell>
                      <TableCell>{item.nome_obra}</TableCell>
                      <TableCell className="text-center">{item.total_alojamentos}</TableCell>
                      <TableCell className="text-center">{item.total_colaboradores}</TableCell>
                      <TableCell className="text-right font-bold">
                        R$ {item.custo_mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {item.custo_por_colaborador.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}