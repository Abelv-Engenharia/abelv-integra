
import React from "react";
import { useFormContext } from "react-hook-form";
import { useOcorrenciasFormData } from "@/hooks/useOcorrenciasFormData";
import DateTimeFields from "./components/DateTimeFields";
import CompanyLocationFields from "./components/CompanyLocationFields";
import ResponsiblePersonFields from "./components/ResponsiblePersonFields";
import AccidentedEmployeeFields from "./components/AccidentedEmployeeFields";
import OccurrenceTypeFields from "./components/OccurrenceTypeFields";

const IdentificacaoForm = () => {
  const { watch, setValue } = useFormContext();
  const watchedCca = watch("cca");
  
  // Extrair o ID do CCA selecionado
  const selectedCcaId = React.useMemo(() => {
    if (!watchedCca) return undefined;
    return watchedCca;
  }, [watchedCca]);

  const { 
    ccas, 
    empresas, 
    disciplinas, 
    engenheiros, 
    supervisores, 
    encarregados, 
    funcionarios,
    tiposOcorrencia,
    tiposEvento,
    classificacoesOcorrencia
  } = useOcorrenciasFormData({ selectedCcaId });

  console.log('Current CCA:', watchedCca);
  console.log('Selected CCA ID:', selectedCcaId);
  console.log('Available ccas:', ccas);
  console.log('Available empresas:', empresas);
  console.log('Available engenheiros:', engenheiros);
  console.log('Available supervisores:', supervisores);

  // Auto-popular ano e mês quando a data for selecionada
  const watchData = watch("data");
  React.useEffect(() => {
    if (watchData) {
      const date = new Date(watchData);
      setValue("ano", date.getFullYear().toString());
      setValue("mes", (date.getMonth() + 1).toString().padStart(2, '0'));
    }
  }, [watchData, setValue]);

  // Auto-popular função e matrícula quando colaborador for selecionado
  const watchColaborador = watch("colaboradores_acidentados.0.colaborador");
  React.useEffect(() => {
    if (watchColaborador && funcionarios.length > 0) {
      const funcionario = funcionarios.find(f => f.id.toString() === watchColaborador);
      if (funcionario) {
        setValue("colaboradores_acidentados.0.funcao", funcionario.funcao || "");
        setValue("colaboradores_acidentados.0.matricula", funcionario.matricula || "");
      }
    }
  }, [watchColaborador, funcionarios, setValue]);

  // Verificar se há CCAs disponíveis
  if (!ccas || ccas.length === 0) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            Nenhum CCA disponível para este usuário. Entre em contato com o administrador do sistema.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DateTimeFields />
      
      <CompanyLocationFields
        ccas={ccas}
        empresas={empresas}
        disciplinas={disciplinas}
        selectedCcaId={selectedCcaId}
      />

      <ResponsiblePersonFields
        engenheiros={engenheiros}
        supervisores={supervisores}
        encarregados={encarregados}
        selectedCcaId={selectedCcaId}
      />

      <AccidentedEmployeeFields
        funcionarios={funcionarios}
        selectedCcaId={selectedCcaId}
        namePrefix="colaboradores_acidentados"
      />

      <OccurrenceTypeFields
        tiposOcorrencia={tiposOcorrencia}
        tiposEvento={tiposEvento}
        classificacoesOcorrencia={classificacoesOcorrencia}
      />
    </div>
  );
};

export default IdentificacaoForm;
