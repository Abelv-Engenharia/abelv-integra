
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
  const watchColaborador = watch("colaboradoresAcidentados.0.colaborador");
  React.useEffect(() => {
    if (watchColaborador) {
      const funcionario = funcionarios.find(f => f.id.toString() === watchColaborador);
      if (funcionario) {
        setValue("colaboradoresAcidentados.0.funcao", funcionario.funcao || "");
        setValue("colaboradoresAcidentados.0.matricula", funcionario.matricula || "");
      }
    }
  }, [watchColaborador, funcionarios, setValue]);

  // Limpar campos dependentes quando CCA mudar
  React.useEffect(() => {
    if (watchedCca) {
      setValue("empresa", "");
      setValue("engenheiroResponsavel", "");
      setValue("supervisorResponsavel", "");
      setValue("encarregadoResponsavel", "");
      setValue("colaboradoresAcidentados.0.colaborador", "");
      setValue("colaboradoresAcidentados.0.funcao", "");
      setValue("colaboradoresAcidentados.0.matricula", "");
    }
  }, [watchedCca, setValue]);

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
