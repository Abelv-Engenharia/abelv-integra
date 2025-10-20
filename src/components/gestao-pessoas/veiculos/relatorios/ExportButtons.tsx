import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Mail, Printer, RefreshCw } from "lucide-react";
import { exportarRelatorioPDF, exportarRelatorioExcel } from "@/services/RelatorioExportService";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonsProps {
  tiporelatino: string;
  dados: any[];
  colunas: string[];
  titulo: string;
  onAtualizar: () => void;
}

export function ExportButtons({ tiporelatino, dados, colunas, titulo, onAtualizar }: ExportButtonsProps) {
  const { toast } = useToast();

  const handleExportPDF = () => {
    try {
      exportarRelatorioPDF(tiporelatino, dados, colunas, titulo);
      toast({
        title: "PDF Exportado",
        description: "Relatório exportado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao Exportar",
        description: "Não foi possível exportar o PDF",
        variant: "destructive",
      });
    }
  };

  const handleExportExcel = () => {
    try {
      exportarRelatorioExcel(dados, titulo, `relatorio-${tiporelatino}`);
      toast({
        title: "Excel Exportado",
        description: "Relatório exportado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao Exportar",
        description: "Não foi possível exportar o Excel",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={handleExportPDF}>
        <FileText className="h-4 w-4 mr-2" />
        Exportar PDF
      </Button>
      <Button variant="outline" onClick={handleExportExcel}>
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Exportar Excel
      </Button>
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-2" />
        Imprimir
      </Button>
      <Button variant="outline" onClick={onAtualizar}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Atualizar
      </Button>
    </div>
  );
}
