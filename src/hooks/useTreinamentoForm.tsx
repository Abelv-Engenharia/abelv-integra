
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { TreinamentoFormValues } from "@/types/treinamentos";
import { ccaService } from "@/services/treinamentos/ccaService";
import { processoTreinamentoService } from "@/services/treinamentos/processoTreinamentoService";
import { tipoTreinamentoService } from "@/services/treinamentos/tipoTreinamentoService";
import { treinamentosService } from "@/services/treinamentos/treinamentosService";
import { useUserCCAs } from "@/hooks/useUserCCAs";

export const useTreinamentoForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: userCCAs = [] } = useUserCCAs();

  const form = useForm<TreinamentoFormValues>({
    defaultValues: {
      data: "",
      ano: 0,
      mes: 0,
      carga_horaria: 0,
      cca_id: "",
      efetivo_mod: 0,
      efetivo_moi: 0,
      processo_treinamento_id: "",
      tipo_treinamento_id: "",
      treinamento_id: "",
      treinamento_nome: "",
      observacoes: "",
      lista_presenca: "",
      lista_presenca_url: "",
    },
  });

  const { data: treinamentoOptions = [] } = useQuery({
    queryKey: ['treinamentos'],
    queryFn: treinamentosService.getAll,
  });

  // Filtrar CCAs baseado nos CCAs permitidos para o usuário
  const { data: allCcaOptions = [] } = useQuery({
    queryKey: ['ccas-ativas'],
    queryFn: ccaService.getAll,
  });

  const ccaOptions = allCcaOptions.filter(cca => 
    userCCAs.some(userCca => userCca.id === cca.id)
  );

  const { data: processoOptions = [] } = useQuery({
    queryKey: ['processo-treinamento'],
    queryFn: processoTreinamentoService.getAll,
  });

  const { data: tipoOptions = [] } = useQuery({
    queryKey: ['tipo-treinamento'],
    queryFn: tipoTreinamentoService.getAll,
  });

  // Preencher a carga horária automaticamente ao selecionar um treinamento
  useEffect(() => {
    const idSelecionado = form.watch("treinamento_id");
    if (
      idSelecionado &&
      idSelecionado !== "outro" &&
      treinamentoOptions.length > 0
    ) {
      const treinamentoSelecionado = treinamentoOptions.find((t) => t.id === idSelecionado);
      if (treinamentoSelecionado && treinamentoSelecionado.carga_horaria != null) {
        // Atualiza o campo se for diferente
        if (form.getValues("carga_horaria") !== treinamentoSelecionado.carga_horaria) {
          form.setValue("carga_horaria", treinamentoSelecionado.carga_horaria);
        }
      }
    } else if (idSelecionado === "outro") {
      // Limpa a carga horária para permitir edição livre
      if (form.getValues("carga_horaria") !== 0) {
        form.setValue("carga_horaria", 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("treinamento_id"), treinamentoOptions]);

  const calculateHorasTotais = () => {
    const cargaHoraria = form.watch("carga_horaria") || 0;
    const efetivo = (form.watch("efetivo_mod") || 0) + (form.watch("efetivo_moi") || 0);
    return cargaHoraria * efetivo;
  };

  return {
    form,
    submitSuccess,
    setSubmitSuccess,
    showSuccess,
    setShowSuccess,
    isLoading,
    setIsLoading,
    treinamentoOptions,
    ccaOptions,
    processoOptions,
    tipoOptions,
    calculateHorasTotais,
  };
};

// Exportar o tipo para uso externo
export type { TreinamentoFormValues };
