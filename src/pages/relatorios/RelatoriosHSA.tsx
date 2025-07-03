
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { HSAFiltersCard } from "@/components/relatorios/hsa/HSAFiltersCard";
import { HSAChartsSection } from "@/components/relatorios/hsa/HSAChartsSection";

const RelatoriosHSA = () => {
  const [dataInicial, setDataInicial] = useState<Date>();
  const [dataFinal, setDataFinal] = useState<Date>();
  const [filterCCA, setFilterCCA] = useState("");
  const [filterResponsavel, setFilterResponsavel] = useState("");

  const handleExportPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "O relatório HSA está sendo gerado em PDF...",
    });
    // TODO: Implementar exportação para PDF
  };

  const handleExportExcel = () => {
    toast({
      title: "Exportando Excel", 
      description: "O relatório HSA está sendo gerado em Excel...",
    });
    // TODO: Implementar exportação para Excel
  };

  const handleSendEmail = () => {
    toast({
      title: "Enviando por Email",
      description: "O relatório HSA está sendo enviado por email...",
    });
    // TODO: Implementar envio por email
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Relatório HSA</h2>
          <p className="text-muted-foreground">
            Relatório completo das inspeções de Hora da Segurança
          </p>
        </div>

        <HSAFiltersCard
          dataInicial={dataInicial}
          dataFinal={dataFinal}
          filterCCA={filterCCA}
          filterResponsavel={filterResponsavel}
          onDataInicialChange={setDataInicial}
          onDataFinalChange={setDataFinal}
          onFilterCCAChange={setFilterCCA}
          onFilterResponsavelChange={setFilterResponsavel}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
          onSendEmail={handleSendEmail}
        />

        <HSAChartsSection />
      </div>
    </div>
  );
};

export default RelatoriosHSA;
