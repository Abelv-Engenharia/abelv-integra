import { useState } from "react";
import { FiltrosDashboard } from "@/types/gestao-pessoas/dashboard-prestadores";
import { useDashboardPrestadores } from "@/hooks/gestao-pessoas/useDashboardPrestadores";
import { KPICardsPrestadores } from "@/components/gestao-pessoas/prestadores/dashboard/KPICardsPrestadores";
import { DistribuicaoValoresChart } from "@/components/gestao-pessoas/prestadores/dashboard/DistribuicaoValoresChart";
import { ComparativoMensalChart } from "@/components/gestao-pessoas/prestadores/dashboard/ComparativoMensalChart";
import { TopPrestadoresChart } from "@/components/gestao-pessoas/prestadores/dashboard/TopPrestadoresChart";
import { EvolucaoTrimestralChart } from "@/components/gestao-pessoas/prestadores/dashboard/EvolucaoTrimestralChart";
import { TabelaResumoPrestadores } from "@/components/gestao-pessoas/prestadores/dashboard/TabelaResumoPrestadores";
import { FiltrosDashboardComponent } from "@/components/gestao-pessoas/prestadores/dashboard/FiltrosDashboard";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DashboardPrestadores() {
  const [filtros, setFiltros] = useState<FiltrosDashboard>({});
  
  const {
    demonstrativos: dados,
    demonstrativosFiltrados: dadosFiltrados,
    kpis,
    dadosMensais,
    top10Prestadores,
    isLoading: carregando,
  } = useDashboardPrestadores(filtros);

  const handleAplicarFiltros = (novosFiltros: FiltrosDashboard) => {
    setFiltros(novosFiltros);
    toast.success("Filtros aplicados com sucesso");
  };

  const exportarExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Aba KPIs
      if (kpis) {
        const kpisData = [
          ['INDICADORES'],
          [''],
          ['Total de NF', kpis.totalnf],
          ['Ajuda de Aluguel', kpis.totalajudaaluguel],
          ['Reembolso Convênio', kpis.totalreembolsoconvenio],
          ['Desconto Convênio', kpis.totaldescontoconvenio],
          ['Multas', kpis.totalmultas],
          ['Desconto Abelv Run', kpis.totaldescontoabelvrun],
        ];
        const wsKPIs = XLSX.utils.aoa_to_sheet(kpisData);
        XLSX.utils.book_append_sheet(wb, wsKPIs, 'KPIs');
      }

      // Aba Dados Completos
      const headers = [
        'Nome', 'Empresa', 'Obra', 'Função', 'Salário', 
        'Ajuda Aluguel', 'Reembolso Convênio', 'Desconto Convênio',
        'Multas', 'Desconto Abelv Run', 'Valor NF', 'Valor Líquido'
      ];
      const rows = dadosFiltrados.map(d => [
        d.nome, d.nomeempresa, d.obra, d.funcao, d.salario,
        d.ajudaaluguel, d.reembolsoconvenio, d.descontoconvenio,
        d.multasdescontos, d.descontoabelvrun, d.valornf, d.valorliquido
      ]);
      const wsDados = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      XLSX.utils.book_append_sheet(wb, wsDados, 'Dados Completos');

      // Aba Top 10
      const top10Data = [
        ['Nome', 'Empresa', 'Total NF'],
        ...top10Prestadores.map(p => [p.nome, p.empresa, p.totalnf])
      ];
      const wsTop10 = XLSX.utils.aoa_to_sheet(top10Data);
      XLSX.utils.book_append_sheet(wb, wsTop10, 'Top 10');

      const fileName = `dashboard_prestadores_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success("Relatório exportado para Excel com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar para Excel");
      console.error(error);
    }
  };

  const exportarPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape' });

      doc.setFontSize(18);
      doc.text('DASHBOARD PRESTADORES DE SERVIÇO', 14, 20);
      
      let yPos = 35;

      // KPIs
      if (kpis) {
        doc.setFontSize(14);
        doc.text('INDICADORES', 14, yPos);
        yPos += 10;

        const kpisData = [
          ['Total de NF', kpis.totalnf.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })],
          ['Ajuda de Aluguel', kpis.totalajudaaluguel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })],
          ['Reembolso Convênio', kpis.totalreembolsoconvenio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })],
          ['Desconto Convênio', kpis.totaldescontoconvenio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })],
          ['Multas', kpis.totalmultas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })],
          ['Desconto Abelv Run', kpis.totaldescontoabelvrun.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })],
        ];

        autoTable(doc, {
          head: [['Indicador', 'Valor']],
          body: kpisData,
          startY: yPos,
          styles: { fontSize: 10 },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // Dados resumidos
      doc.addPage();
      doc.setFontSize(14);
      doc.text('DADOS RESUMIDOS', 14, 20);

      const headers = ['Nome', 'Empresa', 'Ajuda Aluguel', 'Valor NF', 'Valor Líquido'];
      const rows = dadosFiltrados.slice(0, 50).map(d => [
        d.nome,
        d.nomeempresa,
        d.ajudaaluguel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        d.valornf.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        d.valorliquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      ]);

      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 30,
        styles: { fontSize: 8 },
      });

      const fileName = `dashboard_prestadores_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      toast.success("Relatório exportado para PDF com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar para PDF");
      console.error(error);
    }
  };

  if (carregando) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-[80vh]">
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de prestadores de serviço</h1>
          <p className="text-muted-foreground">Visão geral financeira e operacional</p>
        </div>
      </div>

        <FiltrosDashboardComponent onAplicar={handleAplicarFiltros} />

        {kpis && <KPICardsPrestadores kpis={kpis} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DistribuicaoValoresChart dados={dadosFiltrados} />
          <ComparativoMensalChart dados={dadosFiltrados} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopPrestadoresChart dados={dadosFiltrados} />
          <EvolucaoTrimestralChart dados={dadosFiltrados} />
        </div>

      <TabelaResumoPrestadores dados={dadosFiltrados} />

      <div className="flex gap-3">
        <Button onClick={exportarExcel} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Exportar excel
        </Button>
        <Button onClick={exportarPDF} variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
}
