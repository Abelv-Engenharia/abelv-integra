import { useState, useMemo } from "react";
import { FileText, Download, Printer, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useSolicitacoes } from "@/contexts/gestao-pessoas/SolicitacoesContext";
import { FiltrosRelatorioSolicitacoes } from "@/components/gestao-pessoas/solicitacao/FiltrosRelatorioSolicitacoes";
import { RelatorioSolicitacoesTable } from "@/components/gestao-pessoas/solicitacao/RelatorioSolicitacoesTable";
import { calcularEstatisticas, exportarRelatorioPDF, exportarRelatorioExcel } from "@/services/gestao-pessoas/RelatorioSolicitacoesService";
import { StatusSolicitacao } from "@/types/gestao-pessoas/solicitacao";

interface FiltrosSolicitacao {
  periodo: 'hoje' | 'semana' | 'mes' | 'trimestre' | 'ano' | 'personalizado';
  datainicial?: Date;
  datafinal?: Date;
  status?: StatusSolicitacao[];
  tiposervico?: string[];
  cca?: string;
  solicitante?: string;
  valorminimo?: number;
  valormaximo?: number;
}

export default function RelatoriosSolicitacoes() {
  const { solicitacoes } = useSolicitacoes();
  const [filtros, setFiltros] = useState<FiltrosSolicitacao>({
    periodo: 'mes',
    status: [],
    tiposervico: [],
  });

  const dadosFiltrados = useMemo(() => {
    let dados = [...solicitacoes];

    // Aplicar filtros de período
    const hoje = new Date();
    let datainicial: Date | undefined;
    let datafinal: Date | undefined;

    switch (filtros.periodo) {
      case 'hoje':
        datainicial = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        datafinal = hoje;
        break;
      case 'semana':
        datainicial = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
        datafinal = hoje;
        break;
      case 'mes':
        datainicial = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        datafinal = hoje;
        break;
      case 'trimestre':
        datainicial = new Date(hoje.getFullYear(), hoje.getMonth() - 3, 1);
        datafinal = hoje;
        break;
      case 'ano':
        datainicial = new Date(hoje.getFullYear(), 0, 1);
        datafinal = hoje;
        break;
      case 'personalizado':
        datainicial = filtros.datainicial;
        datafinal = filtros.datafinal;
        break;
    }

    if (datainicial && datafinal) {
      dados = dados.filter(s => {
        const data = new Date(s.dataSolicitacao);
        return data >= datainicial! && data <= datafinal!;
      });
    }

    // Filtrar por status
    if (filtros.status && filtros.status.length > 0) {
      dados = dados.filter(s => filtros.status!.includes(s.status));
    }

    // Filtrar por tipo de serviço
    if (filtros.tiposervico && filtros.tiposervico.length > 0) {
      dados = dados.filter(s => filtros.tiposervico!.includes(s.tipoServico));
    }

    // Filtrar por CCA
    if (filtros.cca) {
      dados = dados.filter(s => {
        const cca = 'cca' in s ? (s as any).cca : '';
        return cca.toLowerCase().includes(filtros.cca!.toLowerCase());
      });
    }

    // Filtrar por solicitante
    if (filtros.solicitante) {
      dados = dados.filter(s => 
        s.solicitante.toLowerCase().includes(filtros.solicitante!.toLowerCase())
      );
    }

    // Filtrar por valor
    if (filtros.valorminimo !== undefined || filtros.valormaximo !== undefined) {
      dados = dados.filter(s => {
        const valor = s.estimativavalor || 0;
        const min = filtros.valorminimo || 0;
        const max = filtros.valormaximo || Infinity;
        return valor >= min && valor <= max;
      });
    }

    return dados;
  }, [solicitacoes, filtros]);

  const estatisticas = useMemo(() => calcularEstatisticas(dadosFiltrados), [dadosFiltrados]);

  const handleExportarPDF = () => {
    exportarRelatorioPDF(dadosFiltrados, filtros);
  };

  const handleExportarExcel = () => {
    exportarRelatorioExcel(dadosFiltrados);
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Gestão de Pessoas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/solicitacao-servicos">Recursos & Benefícios</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Relatórios de Solicitações</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Relatórios de Solicitações de Serviços
          </h1>
        </div>
        <p className="text-muted-foreground">
          Análise consolidada de todas as solicitações com filtros avançados e exportação
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-3xl">{estatisticas.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardDescription>Pendentes</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{estatisticas.pendentes}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardDescription>Em Andamento</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{estatisticas.emandamento}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardDescription>Aprovadas</CardDescription>
            <CardTitle className="text-3xl text-purple-600">{estatisticas.aprovadas}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardDescription>Concluídas</CardDescription>
            <CardTitle className="text-3xl text-green-600">{estatisticas.concluidas}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardDescription>Rejeitadas</CardDescription>
            <CardTitle className="text-3xl text-red-600">{estatisticas.rejeitadas}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Valor Total Card */}
      {estatisticas.valortotalestimado > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl">Valor Total Estimado</CardTitle>
            <div className="text-3xl font-bold text-primary">
              {estatisticas.valortotalestimado.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Filtros */}
      <FiltrosRelatorioSolicitacoes
        filtros={filtros}
        onFiltrosChange={setFiltros}
        solicitacoes={solicitacoes}
      />

      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleExportarPDF} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
        <Button onClick={handleExportarExcel} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Excel
        </Button>
        <Button onClick={handleImprimir} variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
        <Button
          onClick={() => setFiltros({ periodo: 'mes', status: [], tiposervico: [] })}
          variant="ghost"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento das Solicitações</CardTitle>
          <CardDescription>
            {dadosFiltrados.length} solicitação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RelatorioSolicitacoesTable dados={dadosFiltrados} />
        </CardContent>
      </Card>
    </div>
  );
}
