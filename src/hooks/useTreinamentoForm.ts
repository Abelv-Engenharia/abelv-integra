
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { ccaService } from "@/services/treinamentos/ccaService";
import { processoTreinamentoService } from "@/services/treinamentos/processoTreinamentoService";
import { tipoTreinamentoService } from "@/services/treinamentos/tipoTreinamentoService";
import { treinamentosService } from "@/services/treinamentos/treinamentosService";

// Tipo específico para execução de treinamentos
export interface TreinamentoExecucaoFormValues {
  data: string;
  mes: number;
  ano: number;
  cca_id: number;
  processo_treinamento_id: string;
  tipo_treinamento_id: string;
  treinamento_id: string;
  treinamento_nome: string;
  carga_horaria: number;
  efetivo_mod: number;
  efetivo_moi: number;
  observacoes: string;
  lista_presenca_url: string;
}

export const useTreinamentoForm = () => {
  const form = useForm<TreinamentoExecucaoFormValues>({
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
      mes: new Date().getMonth() + 1,
      ano: new Date().getFullYear(),
      cca_id: 0,
      processo_treinamento_id: "",
      tipo_treinamento_id: "",
      treinamento_id: "",
      treinamento_nome: "",
      carga_horaria: 0,
      efetivo_mod: 0,
      efetivo_moi: 0,
      observacoes: "",
      lista_presenca_url: "",
    },
  });

  const { data: ccaOptions = [] } = useQuery({
    queryKey: ['ccas'],
    queryFn: async () => {
      const ccas = await ccaService.getAll();
      return ccas.sort((a, b) => a.codigo.localeCompare(b.codigo));
    },
  });

  const { data: processoOptions = [] } = useQuery({
    queryKey: ['processos-treinamento'],
    queryFn: processoTreinamentoService.getAll,
  });

  const { data: tipoOptions = [] } = useQuery({
    queryKey: ['tipos-treinamento'],
    queryFn: tipoTreinamentoService.getAll,
  });

  const { data: treinamentoOptions = [] } = useQuery({
    queryKey: ['treinamentos'],
    queryFn: treinamentosService.getAll,
  });

  const calculateHorasTotais = () => {
    const cargaHoraria = form.watch("carga_horaria") || 0;
    const efetivoMod = form.watch("efetivo_mod") || 0;
    const efetivoMoi = form.watch("efetivo_moi") || 0;
    return cargaHoraria * (efetivoMod + efetivoMoi);
  };

  return {
    form,
    ccaOptions,
    processoOptions,
    tipoOptions,
    treinamentoOptions,
    calculateHorasTotais,
  };
};
