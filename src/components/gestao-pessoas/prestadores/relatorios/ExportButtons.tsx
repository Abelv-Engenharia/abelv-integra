import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import { DadosModulo, FiltrosRelatorioPrestadores } from "@/types/relatorio-prestadores";
import { RelatorioPrestadoresExportService } from "@/services/RelatorioPrestadoresExportService";
import { toast } from "sonner";

interface ExportButtonsProps {
  dadosModulos: DadosModulo[];
  filtros: FiltrosRelatorioPrestadores;
}

export function ExportButtons({ dadosModulos, filtros }: ExportButtonsProps) {
  const handleExportExcel = () => {
    try {
      RelatorioPrestadoresExportService.exportarExcel(dadosModulos, filtros);
      toast.success("Relatório exportado para Excel com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar relatório para Excel");
      console.error(error);
    }
  };

  const handleExportPDF = () => {
    try {
      RelatorioPrestadoresExportService.exportarPDF(dadosModulos, filtros);
      toast.success("Relatório exportado para PDF com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar relatório para PDF");
      console.error(error);
    }
  };

  return (
    <div className="flex gap-3 mb-6">
      <Button onClick={handleExportExcel} className="gap-2">
        <FileSpreadsheet className="h-4 w-4" />
        Exportar Excel
      </Button>
      <Button onClick={handleExportPDF} variant="outline" className="gap-2">
        <FileText className="h-4 w-4" />
        Exportar PDF
      </Button>
    </div>
  );
}
