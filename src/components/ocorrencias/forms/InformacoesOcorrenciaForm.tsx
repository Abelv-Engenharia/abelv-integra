import React from "react";
import { useFormContext } from "react-hook-form";
import { useOcorrenciasFormData } from "@/hooks/useOcorrenciasFormData";
import MultipleAccidentedEmployeesFields from "./components/MultipleAccidentedEmployeesFields";

const InformacoesOcorrenciaForm = () => {
  const { watch } = useFormContext();
  const { partesCorpo, lateralidades, agentesCausadores, situacoesGeradoras, naturezasLesao, funcionarios } = useOcorrenciasFormData();
  
  const watchedEmpresa = watch("empresa");

  return (
    <div className="space-y-6">
      <MultipleAccidentedEmployeesFields
        funcionarios={funcionarios}
        partesCorpo={partesCorpo}
        lateralidades={lateralidades}
        agentesCausadores={agentesCausadores}
        situacoesGeradoras={situacoesGeradoras}
        naturezasLesao={naturezasLesao}
        selectedEmpresaId={watchedEmpresa}
      />
    </div>
  );
};

export default InformacoesOcorrenciaForm;
