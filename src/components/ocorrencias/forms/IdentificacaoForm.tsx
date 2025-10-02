
import React from "react";
import { useFormContext } from "react-hook-form";
import { useOcorrenciasFormData } from "@/hooks/useOcorrenciasFormData";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import DateTimeFields from "./components/DateTimeFields";
import CompanyLocationFields from "./components/CompanyLocationFields";
import ResponsiblePersonFields from "./components/ResponsiblePersonFields";
import OccurrenceTypeFields from "./components/OccurrenceTypeFields";

const IdentificacaoForm = () => {
  const { control, watch, setValue } = useFormContext();
  const watchedCca = watch("cca");
  const watchedEmpresa = watch("empresa");
  
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
    tiposOcorrencia,
    tiposEvento,
    classificacoesOcorrencia
  } = useOcorrenciasFormData({ selectedCcaId });

  // Auto-popular ano e mês quando a data for selecionada
  const watchData = watch("data");
  React.useEffect(() => {
    if (watchData) {
      const date = new Date(watchData);
      setValue("ano", date.getFullYear().toString());
      setValue("mes", (date.getMonth() + 1).toString().padStart(2, '0'));
    }
  }, [watchData, setValue]);

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
        selectedEmpresaId={watchedEmpresa}
      />

      <OccurrenceTypeFields
        tiposOcorrencia={tiposOcorrencia}
        tiposEvento={tiposEvento}
        classificacoesOcorrencia={classificacoesOcorrencia}
      />

      {/* Descrição da ocorrência */}
      <FormField
        control={control}
        name="descricaoOcorrencia"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição da ocorrência</FormLabel>
            <FormControl>
              <Textarea 
                rows={5} 
                placeholder="Descreva a ocorrência em detalhes" 
                className="resize-none"
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default IdentificacaoForm;
