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
import { subcentroCustoService, SubcentroCusto, UpdateSubcentroCustoInput } from "@/services/admin/subcentroCustoService";
import { useSubcentroCustoInvalidation } from "@/hooks/useSubcentroCustoInvalidation";
import { SubcentroCustoFormFields } from "./SubcentroCustoFormFields";

interface EditSubcentroCustoDialogProps {
  subcentro: SubcentroCusto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditSubcentroCustoDialog = ({
  subcentro,
  open,
  onOpenChange,
  onSuccess,
}: EditSubcentroCustoDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { invalidateSubcentrosQueries } = useSubcentroCustoInvalidation();

  const form = useForm({
    defaultValues: {
      id_sienge: "",
      faturamento: "",
      empresa_sienge_id: "",
    },
  });

  useEffect(() => {
    if (subcentro && open) {
      form.reset({
        id_sienge: subcentro.id_sienge.toString(),
        faturamento: subcentro.faturamento,
        empresa_sienge_id: subcentro.empresa_sienge_id,
      });
    }
  }, [subcentro, open, form]);

  const onSubmit = async (data: any) => {
    if (!subcentro) return;

    setIsLoading(true);
    try {
      const input: UpdateSubcentroCustoInput = {
        id_sienge: parseInt(data.id_sienge),
        faturamento: data.faturamento,
        empresa_sienge_id: data.empresa_sienge_id,
      };

      await subcentroCustoService.update(subcentro.id, input);

      toast({
        title: "Subcentro atualizado",
        description: "O subcentro de custo foi atualizado com sucesso.",
      });

      await invalidateSubcentrosQueries(subcentro.cca_id);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao atualizar subcentro:', error);
      
      let errorMessage = "Ocorreu um erro ao atualizar o subcentro de custo.";
      if (error?.message?.includes('duplicate key')) {
        errorMessage = "Já existe um subcentro com este ID Sienge neste CCA.";
      }
      
      toast({
        title: "Erro ao atualizar",
        description: errorMessage,
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
          <DialogTitle>Editar subcentro de custo</DialogTitle>
          <DialogDescription>
            Atualize as informações do subcentro de custo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
                e.preventDefault();
              }
            }}
            className="space-y-4"
          >
            <SubcentroCustoFormFields />

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
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { EditSubcentroCustoDialog };
