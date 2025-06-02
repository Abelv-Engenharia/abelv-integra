
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { TreinamentoFormValues } from "@/types/treinamentos";
import { ccaService } from "@/services/treinamentos/ccaService";
import { processoTreinamentoService } from "@/services/treinamentos/processoTreinamentoService";
import { tipoTreinamentoService } from "@/services/treinamentos/tipoTreinamentoService";
import { treinamentosService } from "@/services/treinamentos/treinamentosService";

export const useTreinamentoForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const { data: ccaOptions = [] } = useQuery({
    queryKey: ['ccas'],
    queryFn: ccaService.getAll,
  });

  const { data: processoOptions = [] } = useQuery({
    queryKey: ['processo-treinamento'],
    queryFn: processoTreinamentoService.getAll,
  });

  const { data: tipoOptions = [] } = useQuery({
    queryKey: ['tipo-treinamento'],
    queryFn: tipoTreinamentoService.getAll,
  });

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
