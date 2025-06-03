
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IDSMSIndicador } from "@/types/treinamentos";
import { idsmsService } from "@/services/idsms/idsmsService";
import { toast } from "@/hooks/use-toast";

const indicadorSchema = z.object({
  cca_id: z.number().min(1, "CCA é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  data: z.string().min(1, "Data é obrigatória"),
  resultado: z.number().min(0).max(100, "Resultado deve estar entre 0 e 100"),
  motivo: z.string().optional(),
});

type IndicadorFormData = z.infer<typeof indicadorSchema>;

interface EditIndicadorDialogProps {
  indicador: IDSMSIndicador;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  ccas: Array<{ id: number; codigo: string; nome: string }>;
}

const tipoOptions = [
  { value: 'IID', label: 'IID' },
  { value: 'HSA', label: 'HSA' },
  { value: 'HT', label: 'HT' },
  { value: 'IPOM', label: 'IPOM' },
  { value: 'INSPECAO_ALTA_LIDERANCA', label: 'Inspeção Alta Liderança' },
  { value: 'INSPECAO_GESTAO_SMS', label: 'Inspeção Gestão SMS' },
  { value: 'INDICE_REATIVO', label: 'Índice Reativo' },
];

export const EditIndicadorDialog: React.FC<EditIndicadorDialogProps> = ({
  indicador,
  open,
  onOpenChange,
  onSuccess,
  ccas,
}) => {
  const form = useForm<IndicadorFormData>({
    resolver: zodResolver(indicadorSchema),
    defaultValues: {
      cca_id: indicador.cca_id,
      tipo: indicador.tipo,
      data: indicador.data,
      resultado: Number(indicador.resultado),
      motivo: indicador.motivo || "",
    },
  });

  useEffect(() => {
    if (indicador) {
      form.reset({
        cca_id: indicador.cca_id,
        tipo: indicador.tipo,
        data: indicador.data,
        resultado: Number(indicador.resultado),
        motivo: indicador.motivo || "",
      });
    }
  }, [indicador, form]);

  const onSubmit = async (data: IndicadorFormData) => {
    try {
      const dataObj = new Date(data.data);
      const updateData = {
        cca_id: data.cca_id,
        tipo: data.tipo as IDSMSIndicador['tipo'],
        data: data.data,
        ano: dataObj.getFullYear(),
        mes: dataObj.getMonth() + 1,
        resultado: data.resultado,
        motivo: data.motivo || null,
      };

      const result = await idsmsService.updateIndicador(indicador.id, updateData);
      
      if (result) {
        toast({
          title: "Sucesso",
          description: "Indicador IDSMS atualizado com sucesso!",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: "Erro",
          description: "Erro ao atualizar indicador. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar indicador:", error);
      toast({
        title: "Erro",
        description: "Erro interno. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Indicador IDSMS</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cca_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CCA *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um CCA" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ccas.map((cca) => (
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

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Indicador *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tipoOptions.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
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
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resultado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resultado (%) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="Digite o resultado"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo/Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite o motivo ou observações (opcional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
