import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileSpreadsheet, FileText, Building2, Calendar, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock data baseado na imagem da planilha
const mockDadosCCA = [
  {
    cca: "23101",
    obra: "NEXA",
    contrato: "A01",
    locatario: "APARECIDO",
    vencimento: 3,
    valor: 2500.00,
    outros: 0,
    deducaoIR: 233.14,
    competencias: {
      "2025-08": { status: "pago", periodo: "03/08 A 02/09", vencimento: "04/09" },
      "2025-09": { status: "pago", periodo: "03/09 A 02/10", vencimento: "02/10" },
      "2025-10": { status: "pago", periodo: "03/10 A 02/11", vencimento: "06/11" },
      "2025-11": { status: "pago", periodo: "03/11 A 02/12", vencimento: "04/12" },
      "2025-12": { status: "pendente", periodo: "03/12 A 02/01", vencimento: "01/01" }
    }
  },
  {
    cca: "23101",
    obra: "NEXA",
    contrato: "A02",
    locatario: "APARECIDO",
    vencimento: 3,
    valor: 2500.00,
    outros: 0,
    deducaoIR: 233.14,
    competencias: {
      "2025-08": { status: "pago", periodo: "03/08 A 02/09", vencimento: "04/09" },
      "2025-09": { status: "pago", periodo: "03/09 A 02/10", vencimento: "02/10" },
      "2025-10": { status: "pago", periodo: "03/10 A 02/11", vencimento: "06/11" },
      "2025-11": { status: "pago", periodo: "03/11 A 02/12", vencimento: "04/12" },
      "2025-12": { status: "pendente", periodo: "03/12 A 02/01", vencimento: "01/01" }
    }
  },
  {
    cca: "23101",
    obra: "NEXA",
    contrato: "A03",
    locatario: "ARNALDINO",
    vencimento: 10,
    valor: 1800.00,
    outros: 0,
    deducaoIR: 0,
    competencias: {
      "2025-08": { status: "atrasado", periodo: "10/07 a 09/08", vencimento: "14/08" },
      "2025-09": { status: "pago", periodo: "10/08 a 09/09", vencimento: "11/09" },
      "2025-10": { status: "pago", periodo: "10/09 a 09/10", vencimento: "09/10" },
      "2025-11": { status: "pago", periodo: "10/10 a 09/11", vencimento: "06/11" },
      "2025-12": { status: "pendente", periodo: "10/11 a 09/12", vencimento: "04/12" }
    }
  },
  {
    cca: "23101",
    obra: "NEXA",
    contrato: "A04",
    locatario: "FABRÍCIO",
    vencimento: 20,
    valor: 4800.00,
    outros: 411.27,
    deducaoIR: 0,
    competencias: {
      "2025-08": { status: "pago", periodo: "20/08 a 19/09", vencimento: "14/08" },
      "2025-09": { status: "pago", periodo: "20/09 a 19/10", vencimento: "18/09" },
      "2025-10": { status: "pago", periodo: "20/10 a 19/11", vencimento: "16/10" },
      "2025-11": { status: "pago", periodo: "20/11 a 19/12", vencimento: "20/11" },
      "2025-12": { status: "pendente", periodo: "20/12 a 19/01", vencimento: "18/12" }
    }
  },
  {
    cca: "23015",
    obra: "SABARÁ",
    contrato: "A06",
    locatario: "JOAO",
    vencimento: 10,
    valor: 1650.00,
    outros: 0,
    deducaoIR: 0,
    competencias: {
      "2025-08": { status: "pago", periodo: "06/08 A 05/09", vencimento: "14/08" },
      "2025-09": { status: "pago", periodo: "06/09 A 05/10", vencimento: "11/09" },
      "2025-10": { status: "pago", periodo: "06/10 A 05/11", vencimento: "09/10" },
      "2025-11": { status: "pago", periodo: "06/11 A 05/12", vencimento: "06/11" },
      "2025-12": { status: "pendente", periodo: "06/12 A 05/01", vencimento: "04/12" }
    }
  },
  {
    cca: "24020",
    obra: "MONIN",
    contrato: "A07",
    locatario: "RENATA",
    vencimento: 20,
    valor: 1467.33,
    outros: 947.00,
    deducaoIR: 0,
    competencias: {
      "2025-08": { status: "devolvido", periodo: "", vencimento: "" },
      "2025-09": { status: "devolvido", periodo: "", vencimento: "" },
      "2025-10": { status: "devolvido", periodo: "", vencimento: "" },
      "2025-11": { status: "devolvido", periodo: "", vencimento: "" },
      "2025-12": { status: "devolvido", periodo: "", vencimento: "" }
    }
  }
];

const opcoesFiltroCCA = [
  { value: "todos", label: "Todos os CCAs" },
  { value: "23101", label: "23101 - NEXA" },
  { value: "23015", label: "23015 - SABARÁ" },
  { value: "24020", label: "24020 - MONIN" },
  { value: "22043", label: "22043 - MONIN" }
];

const opcoesFiltroCompetencia = [
  { value: "todas", label: "Todas as Competências" },
  { value: "2025-08", label: "Agosto/2025" },
  { value: "2025-09", label: "Setembro/2025" },
  { value: "2025-10", label: "Outubro/2025" },
  { value: "2025-11", label: "Novembro/2025" },
  { value: "2025-12", label: "Dezembro/2025" }
];

const competenciasVisiveis = ["2025-08", "2025-09", "2025-10", "2025-11", "2025-12"];
const labelCompetencias = {
  "2025-08": "Competência agosto/2025",
  "2025-09": "Competência setembro/2025",
  "2025-10": "Competência outubro/2025",
  "2025-11": "Competência novembro/2025",
  "2025-12": "Competência dezembro/2025"
};

export default function RelatorioCCACompetencia() {
  const [ccaSelecionado, setCcaSelecionado] = useState("todos");
  const [competenciaSelecionada, setCompetenciaSelecionada] = useState("todas");

  const dadosFiltrados = mockDadosCCA.filter(item => {
    const filtrosCCA = ccaSelecionado === "todos" || item.cca === ccaSelecionado;
    return filtrosCCA;
  });

  const getStatusBadge = (status: string) => {
    const config = {
      pago: { label: "Pago", variant: "default" as const, className: "bg-green-100 text-green-800 border-green-200" },
      pendente: { label: "Pendente", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      atrasado: { label: "Atrasado", variant: "destructive" as const, className: "bg-red-100 text-red-800 border-red-200" },
      devolvido: { label: "Devolvido", variant: "outline" as const, className: "bg-gray-100 text-gray-800 border-gray-200" }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.pendente;
    return (
      <Badge variant={statusConfig.variant} className={statusConfig.className}>
        {statusConfig.label}
      </Badge>
    );
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  const handleExportarExcel = () => {
    toast.success("Relatório CCA x Competência exportado para Excel com sucesso!");
  };

  const handleExportarPDF = () => {
    toast.success("Relatório CCA x Competência exportado para PDF com sucesso!");
  };

  // Cálculos dos totais
  const totalContratos = dadosFiltrados.length;
  const totalValores = dadosFiltrados.reduce((acc, item) => acc + item.valor, 0);
  const totalOutros = dadosFiltrados.reduce((acc, item) => acc + item.outros, 0);
  const totalDeducaoIR = dadosFiltrados.reduce((acc, item) => acc + item.deducaoIR, 0);

  return (
    <div className="container mx-auto p-6 max-w-full">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Relatório CCA x Competência</h1>
        </div>
        <p className="text-muted-foreground">
          Relatório consolidado por CCA e competência mensal dos contratos de alojamento
        </p>
      </div>

      {/* Filtros e Ações */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Select value={ccaSelecionado} onValueChange={setCcaSelecionado}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Selecione o CCA" />
            </SelectTrigger>
            <SelectContent>
              {opcoesFiltroCCA.map((opcao) => (
                <SelectItem key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={competenciaSelecionada} onValueChange={setCompetenciaSelecionada}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Selecione a competência" />
            </SelectTrigger>
            <SelectContent>
              {opcoesFiltroCompetencia.map((opcao) => (
                <SelectItem key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportarExcel} className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Exportar Excel
          </Button>
          <Button variant="outline" onClick={handleExportarPDF} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Contratos</p>
                <p className="text-2xl font-bold text-primary">{totalContratos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Valores</p>
                <p className="text-2xl font-bold text-primary">{formatarValor(totalValores)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Outros</p>
                <p className="text-2xl font-bold text-primary">{formatarValor(totalOutros)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Dedução IR</p>
                <p className="text-2xl font-bold text-primary">{formatarValor(totalDeducaoIR)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatório CCA x Competência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="min-w-[1400px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="font-semibold">CCA</TableHead>
                    <TableHead className="font-semibold">Obra</TableHead>
                    <TableHead className="font-semibold">Contrato</TableHead>
                    <TableHead className="font-semibold">Locatário</TableHead>
                    <TableHead className="font-semibold">Venc</TableHead>
                    <TableHead className="font-semibold">Valor</TableHead>
                    <TableHead className="font-semibold">Outros</TableHead>
                    <TableHead className="font-semibold">Dedução IR</TableHead>
                    {competenciasVisiveis
                      .filter(comp => competenciaSelecionada === "todas" || competenciaSelecionada === comp)
                      .map(comp => (
                      <TableHead key={comp} className="font-semibold min-w-[200px]">
                        {labelCompetencias[comp as keyof typeof labelCompetencias]}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosFiltrados.map((item, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{item.cca}</TableCell>
                      <TableCell>{item.obra}</TableCell>
                      <TableCell>{item.contrato}</TableCell>
                      <TableCell>{item.locatario}</TableCell>
                      <TableCell className="text-center">{item.vencimento}</TableCell>
                      <TableCell className="text-right">{formatarValor(item.valor)}</TableCell>
                      <TableCell className="text-right">{item.outros > 0 ? formatarValor(item.outros) : '-'}</TableCell>
                      <TableCell className="text-right">{item.deducaoIR > 0 ? formatarValor(item.deducaoIR) : '-'}</TableCell>
                      {competenciasVisiveis
                        .filter(comp => competenciaSelecionada === "todas" || competenciaSelecionada === comp)
                        .map(comp => {
                        const competencia = item.competencias[comp as keyof typeof item.competencias];
                        return (
                          <TableCell key={comp} className="min-w-[200px]">
                            <div className="space-y-1">
                              {getStatusBadge(competencia.status)}
                              {competencia.periodo && (
                                <p className="text-xs text-muted-foreground">
                                  {competencia.periodo} - Venc {competencia.vencimento}
                                </p>
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}