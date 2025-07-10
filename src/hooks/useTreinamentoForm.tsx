
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TreinamentoFormValues } from "@/types/treinamentos";
import { useSimpleFormData } from "./useSimpleFormData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const treinamentoFormSchema = z.object({
  data: z.string().min(1, "Data é obrigatória"),
  cca_id: z.string().min(1, "CCA é obrigatório"),
  tipo_treinamento_id: z.string().min(1, "Tipo de treinamento é obrigatório"),
  processo_treinamento_id: z.string().min(1, "Processo de treinamento é obrigatório"),
  treinamento_id: z.string().optional(),
  treinamento_nome: z.string().optional(),
  carga_horaria: z.number().min(1, "Carga horária deve ser maior que 0"),
  efetivo_mod: z.number().min(0, "Efetivo MOD deve ser maior ou igual a 0"),
  efetivo_moi: z.number().min(0, "Efetivo MOI deve ser maior ou igual a 0"),
  observacoes: z.string().optional(),
  ano: z.number().optional(),
  mes: z.number().optional(),
  lista_presenca: z.any().optional(),
  lista_presenca_url: z.string().optional(),
});

export const useTreinamentoForm = () => {
  const form = useForm<TreinamentoFormValues>({
    resolver: zodResolver(treinamentoFormSchema),
    defaultValues: {
      data: "",
      cca_id: "",
      tipo_treinamento_id: "",
      processo_treinamento_id: "",
      treinamento_id: "",
      treinamento_nome: "",
      carga_horaria: 0,
      efetivo_mod: 0,
      efetivo_moi: 0,
      observacoes: "",
      lista_presenca: null,
    },
  });

  const { ccas } = useSimpleFormData();

  // Processos de treinamento
  const { data: processoOptions = [] } = useQuery({
    queryKey: ['processo-treinamento'],
    queryFn: async () => {
      const { data } = await supabase
        .from('processo_treinamento')
        .select('id, nome, codigo')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Tipos de treinamento
  const { data: tipoOptions = [] } = useQuery({
    queryKey: ['tipos-treinamento'],
    queryFn: async () => {
      const { data } = await supabase
        .from('tipos_treinamento')
        .select('id, nome, codigo')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Treinamentos
  const { data: treinamentoOptions = [] } = useQuery({
    queryKey: ['treinamentos'],
    queryFn: async () => {
      const { data } = await supabase
        .from('treinamentos')
        .select('id, nome')
        .order('nome');
      return data || [];
    },
  });

  const calculateHorasTotais = () => {
    const carga = form.watch("carga_horaria") || 0;
    const mod = form.watch("efetivo_mod") || 0;
    const moi = form.watch("efetivo_moi") || 0;
    return carga * (mod + moi);
  };

  return {
    form,
    ccaOptions: ccas,
    processoOptions,
    tipoOptions,
    treinamentoOptions,
    calculateHorasTotais,
  };
};
