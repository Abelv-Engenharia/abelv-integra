
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService, DesvioCompleto } from "@/services/desvios/desviosCompletosService";

interface EditDesvioDialogProps {
  desvio: DesvioCompleto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDesvioUpdated: () => void;
}

const EditDesvioDialog = ({ desvio, open, onOpenChange, onDesvioUpdated }: EditDesvioDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      data_desvio: "",
      local: "",
      descricao_desvio: "",
      acao_imediata: "",
      status: "",
      classificacao_risco: "",
    },
  });

  useEffect(() => {
    if (desvio && open) {
      form.reset({
        data_desvio: desvio.data_desvio || "",
        local: desvio.local || "",
        descricao_desvio: desvio.descricao_desvio || "",
        acao_imediata: desvio.acao_imediata || "",
        status: desvio.status || "PENDENTE",
        classificacao_risco: desvio.classificacao_risco || "",
      });
    }
  }, [desvio, open, form]);

  const onSubmit = async (data: any) => {
    if (!desvio?.id) return;

    setIsLoading(true);
    try {
      const updatedDesvio = await desviosCompletosService.update(desvio.id, {
        data_desvio: data.data_desvio,
        local: data.local,
        descricao_desvio: data.descricao_desvio,
        acao_imediata: data.acao_imediata,
        status: data.status,
        classificacao_risco: data.classificacao_risco,
      });

      if (updatedDesvio) {
        toast({
          title: "Desvio atualizado",
          description: "O desvio foi atualizado com sucesso.",
        });
        onDesvioUpdated();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar desvio:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o desvio.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Desvio</DialogTitle>
          <DialogDescription>
            Edite as informações do desvio selecionado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_desvio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Desvio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDENTE">PENDENTE</SelectItem>
                        <SelectItem value="EM ANDAMENTO">EM ANDAMENTO</SelectItem>
                        <SelectItem value="CONCLUÍDO">CONCLUÍDO</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input placeholder="Local do desvio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="classificacao_risco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classificação de Risco</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a classificação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TRIVIAL">TRIVIAL</SelectItem>
                      <SelectItem value="TOLERÁVEL">TOLERÁVEL</SelectItem>
                      <SelectItem value="MODERADO">MODERADO</SelectItem>
                      <SelectItem value="SUBSTANCIAL">SUBSTANCIAL</SelectItem>
                      <SelectItem value="INTOLERÁVEL">INTOLERÁVEL</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="descricao_desvio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Desvio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o desvio identificado"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="acao_imediata"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ação Imediata</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a ação imediata tomada"
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDesvioDialog;
