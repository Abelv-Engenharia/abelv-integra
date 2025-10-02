import React from "react";
import { useFormContext } from "react-hook-form";
import { useOcorrenciasFormData } from "@/hooks/useOcorrenciasFormData";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import MultipleAccidentedEmployeesFields from "./components/MultipleAccidentedEmployeesFields";

const InformacoesOcorrenciaForm = () => {
  const { watch, control } = useFormContext();
  
  const watchedCca = watch("cca");
  const watchedEmpresa = watch("empresa");
  const colaboradoresEnvolvidos = watch("colaboradoresEnvolvidos");

  // Extrair o ID do CCA selecionado
  const selectedCcaId = React.useMemo(() => {
    if (!watchedCca) return undefined;
    return watchedCca;
  }, [watchedCca]);

  const { partesCorpo, lateralidades, agentesCausadores, situacoesGeradoras, naturezasLesao, funcionarios } = useOcorrenciasFormData({ selectedCcaId });

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="colaboradoresEnvolvidos"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Há colaboradores envolvidos?</FormLabel>
              <div className="text-sm text-muted-foreground">
                Ative para incluir colaboradores acidentados
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {colaboradoresEnvolvidos && (
        <MultipleAccidentedEmployeesFields
          funcionarios={funcionarios}
          partesCorpo={partesCorpo}
          lateralidades={lateralidades}
          agentesCausadores={agentesCausadores}
          situacoesGeradoras={situacoesGeradoras}
          naturezasLesao={naturezasLesao}
          selectedEmpresaId={watchedEmpresa}
        />
      )}
    </div>
  );
};

export default InformacoesOcorrenciaForm;
