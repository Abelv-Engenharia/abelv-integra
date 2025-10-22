import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useEffect } from "react";
import { useCCAs } from "@/hooks/useCCAs";

const formSchema = z.object({
  placa: z.string().min(7, "Placa é obrigatória"),
  condutor_nome: z.string().min(1, "Condutor é obrigatório"),
  data_utilizacao: z.string().min(1, "Data é obrigatória"),
  horario: z.string().min(1, "Horário é obrigatório"),
  tipo_servico: z.string().min(1, "Tipo é obrigatório"),
  local: z.string().min(1, "Local é obrigatório"),
  valor: z.string().min(1, "Valor é obrigatório"),
  cca_id: z.string().optional(),
  finalidade: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PedagioFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemParaEdicao?: any;
  onSuccess?: () => void;
}

export function PedagioFormModal({ open, onOpenChange, itemParaEdicao, onSuccess }: PedagioFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!itemParaEdicao;
  const { data: ccas = [] } = useCCAs();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: itemParaEdicao ? {
      placa: itemParaEdicao.placa,
      condutor_nome: itemParaEdicao.condutor_nome,
      data_utilizacao: itemParaEdicao.data_utilizacao ? format(new Date(itemParaEdicao.data_utilizacao), "yyyy-MM-dd") : "",
      horario: itemParaEdicao.horario || "",
      tipo_servico: itemParaEdicao.tipo_servico,
      local: itemParaEdicao.local,
      valor: itemParaEdicao.valor?.toString() || "",
      cca_id: itemParaEdicao.cca_id?.toString() || "",
      finalidade: itemParaEdicao.finalidade || "",
    } : undefined
  });

  useEffect(() => {
    if (open && itemParaEdicao) {
      reset({
        placa: itemParaEdicao.placa,
        condutor_nome: itemParaEdicao.condutor_nome,
        data_utilizacao: itemParaEdicao.data_utilizacao ? format(new Date(itemParaEdicao.data_utilizacao), "yyyy-MM-dd") : "",
        horario: itemParaEdicao.horario || "",
        tipo_servico: itemParaEdicao.tipo_servico,
        local: itemParaEdicao.local,
        valor: itemParaEdicao.valor?.toString() || "",
        cca_id: itemParaEdicao.cca_id?.toString() || "",
        finalidade: itemParaEdicao.finalidade || "",
      });
    } else if (open && !itemParaEdicao) {
      reset({
        placa: "",
        condutor_nome: "",
        data_utilizacao: "",
        horario: "",
        tipo_servico: "",
        local: "",
        valor: "",
        cca_id: "",
        finalidade: "",
      });
    }
  }, [open, itemParaEdicao, reset]);

  const createMutation = useMutation({
    mutationFn: async (values: FormData) => {
      const { data, error } = await supabase
        .from('veiculos_pedagogios_estacionamentos')
        .insert([{ 
          placa: values.placa.toUpperCase(),
          condutor_nome: values.condutor_nome,
          data_utilizacao: values.data_utilizacao,
          horario: values.horario,
          tipo_servico: values.tipo_servico,
          local: values.local,
          valor: parseFloat(values.valor),
          cca_id: values.cca_id ? parseInt(values.cca_id) : null,
          finalidade: values.finalidade
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedagogios-estacionamentos'] });
      toast({ title: "Sucesso", description: "Transação cadastrada com sucesso!" });
      reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormData) => {
      const { error } = await supabase
        .from('veiculos_pedagogios_estacionamentos')
        .update({ 
          placa: values.placa.toUpperCase(),
          condutor_nome: values.condutor_nome,
          data_utilizacao: values.data_utilizacao,
          horario: values.horario,
          tipo_servico: values.tipo_servico,
          local: values.local,
          valor: parseFloat(values.valor),
          cca_id: values.cca_id ? parseInt(values.cca_id) : null,
          finalidade: values.finalidade
        })
        .eq('id', itemParaEdicao.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedagogios-estacionamentos'] });
      toast({ title: "Sucesso", description: "Transação atualizada com sucesso!" });
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  });

  const onSubmit = (data: FormData) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Transação" : "Nova Transação"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={errors.placa ? "text-destructive" : ""}>Placa *</Label>
              <Input {...register("placa")} className={errors.placa ? "border-destructive" : ""} placeholder="ABC1234" />
              {errors.placa && <p className="text-sm text-destructive mt-1">{errors.placa.message}</p>}
            </div>

            <div>
              <Label className={errors.condutor_nome ? "text-destructive" : ""}>Condutor *</Label>
              <Input {...register("condutor_nome")} className={errors.condutor_nome ? "border-destructive" : ""} />
              {errors.condutor_nome && <p className="text-sm text-destructive mt-1">{errors.condutor_nome.message}</p>}
            </div>

            <div>
              <Label className={errors.data_utilizacao ? "text-destructive" : ""}>Data *</Label>
              <Input type="date" {...register("data_utilizacao")} className={errors.data_utilizacao ? "border-destructive" : ""} />
              {errors.data_utilizacao && <p className="text-sm text-destructive mt-1">{errors.data_utilizacao.message}</p>}
            </div>

            <div>
              <Label className={errors.horario ? "text-destructive" : ""}>Horário *</Label>
              <Input type="time" {...register("horario")} className={errors.horario ? "border-destructive" : ""} />
              {errors.horario && <p className="text-sm text-destructive mt-1">{errors.horario.message}</p>}
            </div>

            <div>
              <Label className={errors.tipo_servico ? "text-destructive" : ""}>Tipo de Serviço *</Label>
              <Select onValueChange={(value) => setValue("tipo_servico", value)} defaultValue={watch("tipo_servico")}>
                <SelectTrigger className={errors.tipo_servico ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pedagio">Pedágio</SelectItem>
                  <SelectItem value="estacionamento">Estacionamento</SelectItem>
                  <SelectItem value="lavagem">Lavagem</SelectItem>
                  <SelectItem value="posto">Posto de Combustível</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_servico && <p className="text-sm text-destructive mt-1">{errors.tipo_servico.message}</p>}
            </div>

            <div>
              <Label className={errors.valor ? "text-destructive" : ""}>Valor *</Label>
              <Input 
                type="number" 
                step="0.01"
                {...register("valor")} 
                className={errors.valor ? "border-destructive" : ""} 
              />
              {errors.valor && <p className="text-sm text-destructive mt-1">{errors.valor.message}</p>}
            </div>

            <div className="col-span-2">
              <Label className={errors.local ? "text-destructive" : ""}>Local *</Label>
              <Input {...register("local")} className={errors.local ? "border-destructive" : ""} />
              {errors.local && <p className="text-sm text-destructive mt-1">{errors.local.message}</p>}
            </div>

            <div>
              <Label>CCA (Opcional)</Label>
              <Select onValueChange={(value) => setValue("cca_id", value)} value={watch("cca_id") || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o CCA (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {ccas.map((cca) => (
                    <SelectItem key={cca.id} value={cca.id.toString()}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Finalidade</Label>
              <Select onValueChange={(value) => setValue("finalidade", value)} value={watch("finalidade") || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a finalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trabalho">Trabalho</SelectItem>
                  <SelectItem value="pessoal">Pessoal</SelectItem>
                  <SelectItem value="emergencia">Emergência</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? "Salvando..." : isEditMode ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
