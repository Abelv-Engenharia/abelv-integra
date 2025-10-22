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
  numero_cartao: z.string().min(4, "Número inválido"),
  bandeira: z.string().min(1, "Bandeira é obrigatória"),
  status: z.string().min(1, "Status é obrigatório"),
  condutor_nome: z.string().min(1, "Condutor é obrigatório"),
  placa: z.string().min(7, "Placa é obrigatória"),
  data_validade: z.string().min(1, "Data de validade é obrigatória"),
  limite_credito: z.string().min(1, "Limite de crédito é obrigatório"),
  veiculo_modelo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CartaoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemParaEdicao?: any;
  onSuccess?: () => void;
}

export function CartaoFormModal({ open, onOpenChange, itemParaEdicao, onSuccess }: CartaoFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!itemParaEdicao;

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: itemParaEdicao ? {
      numero_cartao: itemParaEdicao.numero_cartao,
      bandeira: itemParaEdicao.bandeira,
      status: itemParaEdicao.status,
      condutor_nome: itemParaEdicao.condutor_nome,
      placa: itemParaEdicao.placa,
      data_validade: itemParaEdicao.data_validade ? format(new Date(itemParaEdicao.data_validade), "yyyy-MM-dd") : "",
      limite_credito: itemParaEdicao.limite_credito?.toString() || "",
      veiculo_modelo: itemParaEdicao.veiculo_modelo || "",
    } : {
      status: "ativo"
    }
  });

  useEffect(() => {
    if (open && itemParaEdicao) {
      reset({
        numero_cartao: itemParaEdicao.numero_cartao,
        bandeira: itemParaEdicao.bandeira,
        status: itemParaEdicao.status,
        condutor_nome: itemParaEdicao.condutor_nome,
        placa: itemParaEdicao.placa,
        data_validade: itemParaEdicao.data_validade ? format(new Date(itemParaEdicao.data_validade), "yyyy-MM-dd") : "",
        limite_credito: itemParaEdicao.limite_credito?.toString() || "",
        veiculo_modelo: itemParaEdicao.veiculo_modelo || "",
      });
    } else if (open && !itemParaEdicao) {
      reset({
        numero_cartao: "",
        bandeira: "",
        status: "ativo",
        condutor_nome: "",
        placa: "",
        data_validade: "",
        limite_credito: "",
        veiculo_modelo: "",
      });
    }
  }, [open, itemParaEdicao, reset]);

  const createMutation = useMutation({
    mutationFn: async (values: FormData) => {
      const { data, error } = await supabase
        .from('veiculos_cartoes_abastecimento')
        .insert([{ 
          numero_cartao: values.numero_cartao,
          numero_cartao_hash: values.numero_cartao,
          tipo_cartao: values.bandeira,
          bandeira: values.bandeira,
          status: values.status,
          condutor_nome: values.condutor_nome,
          placa: values.placa.toUpperCase(),
          data_validade: values.data_validade,
          limite_credito: parseFloat(values.limite_credito),
          veiculo_modelo: values.veiculo_modelo
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartoes-abastecimento'] });
      toast({ title: "Sucesso", description: "Cartão cadastrado com sucesso!" });
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
        .from('veiculos_cartoes_abastecimento')
        .update({ 
          ...values, 
          placa: values.placa.toUpperCase(),
          limite_credito: parseFloat(values.limite_credito)
        })
        .eq('id', itemParaEdicao.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartoes-abastecimento'] });
      toast({ title: "Sucesso", description: "Cartão atualizado com sucesso!" });
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
          <DialogTitle>{isEditMode ? "Editar Cartão" : "Novo Cartão"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={errors.numero_cartao ? "text-destructive" : ""}>Número do Cartão *</Label>
              <Input {...register("numero_cartao")} className={errors.numero_cartao ? "border-destructive" : ""} />
              {errors.numero_cartao && <p className="text-sm text-destructive mt-1">{errors.numero_cartao.message}</p>}
            </div>

            <div>
              <Label className={errors.bandeira ? "text-destructive" : ""}>Bandeira *</Label>
              <Select onValueChange={(value) => setValue("bandeira", value)} defaultValue={watch("bandeira")}>
                <SelectTrigger className={errors.bandeira ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crédito">Crédito</SelectItem>
                  <SelectItem value="débito">Débito</SelectItem>
                </SelectContent>
              </Select>
              {errors.bandeira && <p className="text-sm text-destructive mt-1">{errors.bandeira.message}</p>}
            </div>

            <div>
              <Label className={errors.status ? "text-destructive" : ""}>Status *</Label>
              <Select onValueChange={(value) => setValue("status", value)} defaultValue={watch("status")}>
                <SelectTrigger className={errors.status ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
            </div>

            <div>
              <Label className={errors.condutor_nome ? "text-destructive" : ""}>Condutor *</Label>
              <Input {...register("condutor_nome")} className={errors.condutor_nome ? "border-destructive" : ""} />
              {errors.condutor_nome && <p className="text-sm text-destructive mt-1">{errors.condutor_nome.message}</p>}
            </div>

            <div>
              <Label className={errors.placa ? "text-destructive" : ""}>Placa *</Label>
              <Input {...register("placa")} className={errors.placa ? "border-destructive" : ""} placeholder="ABC1234" />
              {errors.placa && <p className="text-sm text-destructive mt-1">{errors.placa.message}</p>}
            </div>

            <div>
              <Label>Modelo do Veículo</Label>
              <Input {...register("veiculo_modelo")} />
            </div>

            <div>
              <Label className={errors.data_validade ? "text-destructive" : ""}>Data de Validade *</Label>
              <Input type="date" {...register("data_validade")} className={errors.data_validade ? "border-destructive" : ""} />
              {errors.data_validade && <p className="text-sm text-destructive mt-1">{errors.data_validade.message}</p>}
            </div>

            <div>
              <Label className={errors.limite_credito ? "text-destructive" : ""}>Limite de Crédito *</Label>
              <Input 
                type="number" 
                step="0.01"
                {...register("limite_credito")} 
                className={errors.limite_credito ? "border-destructive" : ""} 
              />
              {errors.limite_credito && <p className="text-sm text-destructive mt-1">{errors.limite_credito.message}</p>}
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
