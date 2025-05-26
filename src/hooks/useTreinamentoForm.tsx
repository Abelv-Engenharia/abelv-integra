
import { useForm } from "react-hook-form";
import { useState } from "react";

export type TreinamentoFormValues = {
  data: Date;
  carga_horaria: number;
  cca_id: number;
  efetivo_mod: number;
  efetivo_moi: number;
  observacoes: string;
  processo_treinamento_id: string;
  tipo_treinamento_id: string;
  treinamento_id: string;
  treinamento_nome: string;
  lista_presenca: any;
};

export const useTreinamentoForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const form = useForm<TreinamentoFormValues>({
    defaultValues: {
      efetivo_mod: 0,
      efetivo_moi: 0,
    }
  });

  const calculateHorasTotais = () => {
    const cargaHoraria = form.watch("carga_horaria") || 0;
    const efetivoMod = form.watch("efetivo_mod") || 0;
    const efetivoMoi = form.watch("efetivo_moi") || 0;
    
    return cargaHoraria * (efetivoMod + efetivoMoi);
  };

  return {
    form,
    submitSuccess,
    setSubmitSuccess,
    calculateHorasTotais
  };
};
