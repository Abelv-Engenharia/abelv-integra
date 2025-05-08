
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Treinamento } from "@/types/treinamentos";
import { toast } from "@/hooks/use-toast";
import { criarExecucaoTreinamento } from "@/services/treinamentos/execucaoTreinamentoService";

const formSchema = z.object({
  data: z.date({
    required_error: "A data é obrigatória",
  }),
  cca_id: z.number({
    required_error: "O CCA é obrigatório",
  }),
  processo_treinamento_id: z.string({
    required_error: "O processo de treinamento é obrigatório",
  }),
  tipo_treinamento_id: z.string({
    required_error: "O tipo de treinamento é obrigatório",
  }),
  treinamento_id: z.string({
    required_error: "O treinamento realizado é obrigatório",
  }).or(z.literal("outro")),
  treinamento_nome: z.string().optional(),
  carga_horaria: z.coerce.number({
    required_error: "A carga horária é obrigatória",
    invalid_type_error: "A carga horária deve ser um número",
  }).min(0, "A carga horária não pode ser negativa"),
  efetivo_mod: z.coerce.number({
    required_error: "O efetivo MOD é obrigatório",
    invalid_type_error: "O efetivo MOD deve ser um número",
  }).min(0, "O efetivo MOD não pode ser negativo"),
  efetivo_moi: z.coerce.number({
    required_error: "O efetivo MOI é obrigatório",
    invalid_type_error: "O efetivo MOI deve ser um número",
  }).min(0, "O efetivo MOI não pode ser negativo"),
  observacoes: z.string().optional(),
  lista_presenca: z.any().optional(),
});

export type TreinamentoFormValues = z.infer<typeof formSchema>;

export function useTreinamentoForm() {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [isOutroTreinamento, setIsOutroTreinamento] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [horasTotais, setHorasTotais] = useState<number>(0);

  const form = useForm<TreinamentoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      processo_treinamento_id: "",
      tipo_treinamento_id: "",
      treinamento_id: "",
      carga_horaria: 0,
      efetivo_mod: 0,
      efetivo_moi: 0,
    },
  });

  const treinamentoSelecionado = form.watch("treinamento_id");
  const cargaHoraria = form.watch("carga_horaria");
  const efetivoMod = form.watch("efetivo_mod");
  const efetivoMoi = form.watch("efetivo_moi");
  
  // Calculate total hours
  useEffect(() => {
    const total = cargaHoraria * (efetivoMod + efetivoMoi);
    setHorasTotais(total);
  }, [cargaHoraria, efetivoMod, efetivoMoi]);
  
  // Handle "outro treinamento" selection
  useEffect(() => {
    if (treinamentoSelecionado === "outro") {
      setIsOutroTreinamento(true);
      form.setValue("carga_horaria", 0);
    } else if (treinamentoSelecionado) {
      setIsOutroTreinamento(false);
    }
  }, [treinamentoSelecionado, form]);

  const updateCargaHorariaFromTreinamento = (treinamentos: Treinamento[]) => {
    if (treinamentoSelecionado && treinamentoSelecionado !== "outro") {
      const treinamento = treinamentos.find(t => t.id === treinamentoSelecionado);
      if (treinamento && treinamento.carga_horaria) {
        form.setValue("carga_horaria", treinamento.carga_horaria);
      }
    }
  };

  const onSubmit = async (data: TreinamentoFormValues) => {
    console.log("Form data:", data);
    
    const file = data.lista_presenca?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erro ao salvar",
        description: "O arquivo deve ter no máximo 2MB",
        variant: "destructive",
      });
      return;
    }
    
    if (data.treinamento_id === "outro" && !data.treinamento_nome) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome do treinamento",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Calculate the total hours explicitly to ensure accuracy
      const calculatedHorasTotais = data.carga_horaria * (data.efetivo_mod + data.efetivo_moi);
      
      const resultado = await criarExecucaoTreinamento({
        data: data.data,
        cca_id: data.cca_id,
        processo_treinamento_id: data.processo_treinamento_id,
        tipo_treinamento_id: data.tipo_treinamento_id,
        treinamento_id: data.treinamento_id !== "outro" ? data.treinamento_id : undefined,
        treinamento_nome: data.treinamento_id === "outro" ? data.treinamento_nome : undefined,
        carga_horaria: data.carga_horaria,
        efetivo_mod: data.efetivo_mod,
        efetivo_moi: data.efetivo_moi,
        horas_totais: calculatedHorasTotais,
        observacoes: data.observacoes,
        lista_presenca_url: data.lista_presenca?.[0]
      });
      
      if (resultado.success) {
        toast({
          title: "Sucesso!",
          description: "Registro realizado com sucesso!",
          variant: "default",
        });
        
        setIsSubmitSuccess(true);
      } else {
        toast({
          title: "Erro ao salvar",
          description: resultado.error || "Ocorreu um erro ao registrar o treinamento",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setIsSubmitSuccess(false);
  };

  return {
    form,
    isLoading,
    isSubmitSuccess,
    isOutroTreinamento,
    treinamentoSelecionado,
    horasTotais,
    onSubmit: form.handleSubmit(onSubmit),
    resetForm,
    updateCargaHorariaFromTreinamento
  };
}
