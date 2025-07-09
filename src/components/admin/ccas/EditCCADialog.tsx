
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
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ccaService, CCA } from "@/services/admin/ccaService";
import { useCCAInvalidation } from "@/hooks/useCCAInvalidation";
import { CCAFormFields } from "./CCAFormFields";

interface EditCCADialogProps {
  cca: CCA | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditCCADialog = ({ cca, open, onOpenChange, onSuccess }: EditCCADialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { invalidateAllCCAQueries } = useCCAInvalidation();
  
  const form = useForm({
    defaultValues: {
      codigo: "",
      nome: "",
      tipo: "",
      ativo: true,
    },
  });

  useEffect(() => {
    if (cca && open) {
      form.reset({
        codigo: cca.codigo,
        nome: cca.nome,
        tipo: cca.tipo,
        ativo: cca.ativo,
      });
    }
  }, [cca, open, form]);

  const onSubmit = async (data: any) => {
    if (!cca) return;

    setIsLoading(true);
    try {
      const updatedCCA = await ccaService.update(cca.id, data);
      
      if (updatedCCA) {
        toast({
          title: "CCA atualizado",
          description: "O CCA foi atualizado com sucesso.",
        });
        
        // Invalidar todas as queries relacionadas a CCAs para atualização imediata
        await invalidateAllCCAQueries();
        
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar CCA:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o CCA.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar CCA</DialogTitle>
          <DialogDescription>
            Atualize as informações do CCA selecionado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CCAFormFields />
            
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

export { EditCCADialog };
