import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useEffect } from "react";
import { useCCAs } from "@/hooks/useCCAs";
import { useVeiculos } from "@/hooks/gestao-pessoas/useVeiculos";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
  // Linha 1
  cca_id: z.string().min(1, "CCA é obrigatório"),
  
  // Linha 2
  veiculo_id: z.string().min(1, "Veículo é obrigatório"),
  condutor_id: z.string().optional(),
  condutor_nome: z.string().min(1, "Condutor é obrigatório"),
  placa: z.string().min(1, "Placa é obrigatória"),
  veiculo_modelo: z.string().optional(),
  
  // Linha 3
  local: z.string().min(1, "Local é obrigatório"),
  data_utilizacao: z.date({
    required_error: "Data de utilização é obrigatória",
  }),
  horario: z.string().min(1, "Horário é obrigatório"),
  
  // Linha 4
  tipo_servico: z.string().min(1, "Tipo de serviço é obrigatório"),
  finalidade: z.string().optional(),
  valor: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
  const { data: veiculos = [] } = useVeiculos();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cca_id: "",
      veiculo_id: "",
      condutor_id: "",
      condutor_nome: "",
      placa: "",
      veiculo_modelo: "",
      local: "",
      data_utilizacao: undefined,
      horario: "",
      tipo_servico: "",
      finalidade: "",
      valor: undefined,
    },
  });

  // Resetar form quando abrir/fechar ou mudar item
  useEffect(() => {
    if (open && itemParaEdicao) {
      form.reset({
        cca_id: itemParaEdicao.cca_id?.toString() || "",
        veiculo_id: itemParaEdicao.veiculo_id || "",
        condutor_id: itemParaEdicao.condutor_id || "",
        condutor_nome: itemParaEdicao.condutor_nome || "",
        placa: itemParaEdicao.placa || "",
        veiculo_modelo: "",
        local: itemParaEdicao.local || "",
        data_utilizacao: itemParaEdicao.data_utilizacao ? new Date(itemParaEdicao.data_utilizacao) : undefined,
        horario: itemParaEdicao.horario || "",
        tipo_servico: itemParaEdicao.tipo_servico || "",
        finalidade: itemParaEdicao.finalidade || "",
        valor: itemParaEdicao.valor || undefined,
      });
    } else if (open && !itemParaEdicao) {
      form.reset({
        cca_id: "",
        veiculo_id: "",
        condutor_id: "",
        condutor_nome: "",
        placa: "",
        veiculo_modelo: "",
        local: "",
        data_utilizacao: undefined,
        horario: "",
        tipo_servico: "",
        finalidade: "",
        valor: undefined,
      });
    }
  }, [open, itemParaEdicao, form]);

  // Auto-preencher condutor e placa ao selecionar veículo
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'veiculo_id' && value.veiculo_id && veiculos) {
        const veiculoSelecionado = veiculos.find(v => v.id === value.veiculo_id);
        if (veiculoSelecionado) {
          form.setValue('placa', veiculoSelecionado.placa);
          form.setValue('veiculo_modelo', veiculoSelecionado.modelo);
          form.setValue('condutor_nome', veiculoSelecionado.condutor_principal_nome || '');
          form.setValue('condutor_id', veiculoSelecionado.condutor_principal_id || '');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, veiculos]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const dataToSave = {
        cca_id: parseInt(values.cca_id),
        veiculo_id: values.veiculo_id,
        condutor_id: values.condutor_id || null,
        condutor_nome: values.condutor_nome,
        placa: values.placa.toUpperCase(),
        local: values.local,
        data_utilizacao: format(values.data_utilizacao, "yyyy-MM-dd"),
        horario: values.horario,
        tipo_servico: values.tipo_servico,
        finalidade: values.finalidade || null,
        valor: values.valor || null,
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('veiculos_pedagogios_estacionamentos')
          .update(dataToSave)
          .eq('id', itemParaEdicao.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('veiculos_pedagogios_estacionamentos')
          .insert([dataToSave]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedagogios-estacionamentos'] });
      toast({
        title: "Sucesso",
        description: isEditMode ? "Transação atualizada com sucesso!" : "Transação cadastrada com sucesso!",
      });
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar transação. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Transação" : "Nova Transação"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* LINHA 1: CCA (linha inteira) */}
            <FormField
              control={form.control}
              name="cca_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(!field.value && "text-destructive")}>
                    CCA *
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={cn(!field.value && "border-destructive")}>
                        <SelectValue placeholder="Selecione o CCA" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ccas?.map((cca) => (
                        <SelectItem key={cca.id} value={cca.id.toString()}>
                          {cca.codigo} - {cca.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LINHA 2: Veículo | Condutor | Placa */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="veiculo_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Veículo *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn(!field.value && "border-destructive")}>
                          <SelectValue placeholder="Selecione o veículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {veiculos?.map((veiculo) => (
                          <SelectItem key={veiculo.id} value={veiculo.id}>
                            {veiculo.modelo} - {veiculo.placa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condutor_nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Condutor *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Selecionado automaticamente" 
                        className={cn("bg-muted", !field.value && "border-destructive")}
                        {...field}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="placa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Placa *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="AAA-0000" 
                        className={cn("bg-muted", !field.value && "border-destructive")}
                        {...field}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* LINHA 3: Local | Data de Utilização | Horário */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="local"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Local *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Local de utilização" 
                        className={cn(!field.value && "border-destructive")}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_utilizacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Data de Utilização *
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground border-destructive"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="horario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Horário *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        className={cn(!field.value && "border-destructive")}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* LINHA 4: Tipo de Serviço | Finalidade | Valor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="tipo_servico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Tipo de Serviço *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn(!field.value && "border-destructive")}>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pedagio">Pedágio</SelectItem>
                        <SelectItem value="estacionamento">Estacionamento</SelectItem>
                        <SelectItem value="lavagem">Lavagem</SelectItem>
                        <SelectItem value="posto">Posto de Combustível</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="finalidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Finalidade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a finalidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="trabalho">Trabalho</SelectItem>
                        <SelectItem value="pessoal">Pessoal</SelectItem>
                        <SelectItem value="emergencia">Emergência</SelectItem>
                        <SelectItem value="manutencao">Manutenção</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="R$ 0,00" 
                        value={field.value ? `R$ ${field.value.toFixed(2).replace('.', ',')}` : ''}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "")
                          const numValue = Number(value) / 100
                          field.onChange(numValue)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : isEditMode ? "Salvar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}