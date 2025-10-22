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

const formSchema = z.object({
  status: z.string().min(1, "Status é obrigatório"),
  locadora_nome: z.string().min(1, "Locadora é obrigatória"),
  tipo_locacao: z.string().min(1, "Tipo é obrigatório"),
  placa: z.string().min(7, "Placa inválida"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  franquia_km: z.string().min(1, "Franquia Km é obrigatória"),
  condutor_principal_nome: z.string().min(1, "Condutor principal é obrigatório"),
  data_retirada: z.string().min(1, "Data de retirada é obrigatória"),
  data_devolucao: z.string().min(1, "Data de devolução é obrigatória"),
});

type FormData = z.infer<typeof formSchema>;

interface VeiculoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemParaEdicao?: any;
  onSuccess?: () => void;
}

export function VeiculoFormModal({ open, onOpenChange, itemParaEdicao, onSuccess }: VeiculoFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!itemParaEdicao;

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: itemParaEdicao ? {
      status: itemParaEdicao.status,
      locadora_nome: itemParaEdicao.locadora_nome,
      tipo_locacao: itemParaEdicao.tipo_locacao,
      placa: itemParaEdicao.placa,
      modelo: itemParaEdicao.modelo,
      franquia_km: itemParaEdicao.franquia_km,
      condutor_principal_nome: itemParaEdicao.condutor_principal_nome,
      data_retirada: itemParaEdicao.data_retirada ? format(new Date(itemParaEdicao.data_retirada), "yyyy-MM-dd") : "",
      data_devolucao: itemParaEdicao.data_devolucao ? format(new Date(itemParaEdicao.data_devolucao), "yyyy-MM-dd") : "",
    } : undefined
  });

  useEffect(() => {
    if (open && itemParaEdicao) {
      reset({
        status: itemParaEdicao.status,
        locadora_nome: itemParaEdicao.locadora_nome,
        tipo_locacao: itemParaEdicao.tipo_locacao,
        placa: itemParaEdicao.placa,
        modelo: itemParaEdicao.modelo,
        franquia_km: itemParaEdicao.franquia_km,
        condutor_principal_nome: itemParaEdicao.condutor_principal_nome,
        data_retirada: itemParaEdicao.data_retirada ? format(new Date(itemParaEdicao.data_retirada), "yyyy-MM-dd") : "",
        data_devolucao: itemParaEdicao.data_devolucao ? format(new Date(itemParaEdicao.data_devolucao), "yyyy-MM-dd") : "",
      });
    } else if (open && !itemParaEdicao) {
      reset({
        status: "",
        locadora_nome: "",
        tipo_locacao: "",
        placa: "",
        modelo: "",
        franquia_km: "",
        condutor_principal_nome: "",
        data_retirada: "",
        data_devolucao: "",
      });
    }
  }, [open, itemParaEdicao, reset]);

  const createMutation = useMutation({
    mutationFn: async (values: FormData) => {
      const { data, error } = await supabase
        .from('veiculos')
        .insert([{ 
          status: values.status,
          locadora_nome: values.locadora_nome,
          tipo_locacao: values.tipo_locacao,
          placa: values.placa.toUpperCase(),
          modelo: values.modelo,
          franquia_km: values.franquia_km,
          condutor_principal_nome: values.condutor_principal_nome,
          data_retirada: values.data_retirada,
          data_devolucao: values.data_devolucao
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veiculos'] });
      toast({ title: "Sucesso", description: "Veículo cadastrado com sucesso!" });
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
        .from('veiculos')
        .update({ ...values, placa: values.placa.toUpperCase() })
        .eq('id', itemParaEdicao.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veiculos'] });
      toast({ title: "Sucesso", description: "Veículo atualizado com sucesso!" });
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
          <DialogTitle>{isEditMode ? "Editar Veículo" : "Novo Veículo"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={errors.status ? "text-destructive" : ""}>Status *</Label>
              <Select onValueChange={(value) => setValue("status", value)} defaultValue={watch("status")}>
                <SelectTrigger className={errors.status ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
            </div>

            <div>
              <Label className={errors.locadora_nome ? "text-destructive" : ""}>Locadora *</Label>
              <Input {...register("locadora_nome")} className={errors.locadora_nome ? "border-destructive" : ""} />
              {errors.locadora_nome && <p className="text-sm text-destructive mt-1">{errors.locadora_nome.message}</p>}
            </div>

            <div>
              <Label className={errors.tipo_locacao ? "text-destructive" : ""}>Tipo de Locação *</Label>
              <Select onValueChange={(value) => setValue("tipo_locacao", value)} defaultValue={watch("tipo_locacao")}>
                <SelectTrigger className={errors.tipo_locacao ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diária">Diária</SelectItem>
                  <SelectItem value="Mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_locacao && <p className="text-sm text-destructive mt-1">{errors.tipo_locacao.message}</p>}
            </div>

            <div>
              <Label className={errors.placa ? "text-destructive" : ""}>Placa *</Label>
              <Input {...register("placa")} className={errors.placa ? "border-destructive" : ""} placeholder="ABC1234" />
              {errors.placa && <p className="text-sm text-destructive mt-1">{errors.placa.message}</p>}
            </div>

            <div>
              <Label className={errors.modelo ? "text-destructive" : ""}>Modelo *</Label>
              <Input {...register("modelo")} className={errors.modelo ? "border-destructive" : ""} />
              {errors.modelo && <p className="text-sm text-destructive mt-1">{errors.modelo.message}</p>}
            </div>

            <div>
              <Label className={errors.franquia_km ? "text-destructive" : ""}>Franquia Km *</Label>
              <Input {...register("franquia_km")} className={errors.franquia_km ? "border-destructive" : ""} />
              {errors.franquia_km && <p className="text-sm text-destructive mt-1">{errors.franquia_km.message}</p>}
            </div>

            <div>
              <Label className={errors.condutor_principal_nome ? "text-destructive" : ""}>Condutor Principal *</Label>
              <Input {...register("condutor_principal_nome")} className={errors.condutor_principal_nome ? "border-destructive" : ""} />
              {errors.condutor_principal_nome && <p className="text-sm text-destructive mt-1">{errors.condutor_principal_nome.message}</p>}
            </div>

            <div>
              <Label className={errors.data_retirada ? "text-destructive" : ""}>Data de Retirada *</Label>
              <Input type="date" {...register("data_retirada")} className={errors.data_retirada ? "border-destructive" : ""} />
              {errors.data_retirada && <p className="text-sm text-destructive mt-1">{errors.data_retirada.message}</p>}
            </div>

            <div>
              <Label className={errors.data_devolucao ? "text-destructive" : ""}>Data de Devolução *</Label>
              <Input type="date" {...register("data_devolucao")} className={errors.data_devolucao ? "border-destructive" : ""} />
              {errors.data_devolucao && <p className="text-sm text-destructive mt-1">{errors.data_devolucao.message}</p>}
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
