
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
import { ccaService, CCA } from "@/services/admin/ccaService";
import { toast } from "@/hooks/use-toast";
import { useCCAInvalidation } from "@/hooks/useCCAInvalidation";

const ccaSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  ativo: z.boolean(),
});

type CCAFormData = z.infer<typeof ccaSchema>;

interface EditCCADialogProps {
  cca: CCA;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditCCADialog: React.FC<EditCCADialogProps> = ({
  cca,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { invalidateAllCCAQueries } = useCCAInvalidation();
  
  const form = useForm<CCAFormData>({
    resolver: zodResolver(ccaSchema),
    defaultValues: {
      codigo: cca.codigo,
      nome: cca.nome,
      tipo: cca.tipo,
      ativo: cca.ativo,
    },
  });

  useEffect(() => {
    form.reset({
      codigo: cca.codigo,
      nome: cca.nome,
      tipo: cca.tipo,
      ativo: cca.ativo,
    });
  }, [cca, form]);

  const onSubmit = async (data: CCAFormData) => {
    try {
      const result = await ccaService.update(cca.id, {
        codigo: data.codigo,
        nome: data.nome,
        tipo: data.tipo,
        ativo: data.ativo,
      });
      
      if (result) {
        toast({
          title: "Sucesso",
          description: "CCA atualizado com sucesso! Todas as listas foram atualizadas.",
        });
        
        // Invalidate all CCA-related queries across the application
        await invalidateAllCCAQueries();
        
        onSuccess();
      } else {
        toast({
          title: "Erro",
          description: "Erro ao atualizar CCA. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar CCA:", error);
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
          <DialogTitle>Editar CCA</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o código do CCA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do CCA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sede">Sede</SelectItem>
                      <SelectItem value="Obra">Obra</SelectItem>
                    </SelectContent>
                  </Select>
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
