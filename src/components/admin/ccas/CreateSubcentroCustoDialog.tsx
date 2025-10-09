import { useState } from "react";
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
import { subcentroCustoService, CreateSubcentroCustoInput } from "@/services/admin/subcentroCustoService";
import { useSubcentroCustoInvalidation } from "@/hooks/useSubcentroCustoInvalidation";
import { SubcentroCustoFormFields } from "./SubcentroCustoFormFields";

interface CreateSubcentroCustoDialogProps {
  ccaId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateSubcentroCustoDialog = ({
  ccaId,
  open,
  onOpenChange,
  onSuccess,
}: CreateSubcentroCustoDialogProps) => {
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

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const input: CreateSubcentroCustoInput = {
        cca_id: ccaId,
        id_sienge: parseInt(data.id_sienge),
        faturamento: data.faturamento,
        empresa_sienge_id: data.empresa_sienge_id,
      };

      await subcentroCustoService.create(input);

      toast({
        title: "Subcentro criado",
        description: "O subcentro de custo foi criado com sucesso.",
      });

      await invalidateSubcentrosQueries(ccaId);
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao criar subcentro:', error);
      
      let errorMessage = "Ocorreu um erro ao criar o subcentro de custo.";
      if (error?.message?.includes('duplicate key')) {
        errorMessage = "Já existe um subcentro com este ID Sienge neste CCA.";
      }
      
      toast({
        title: "Erro ao criar",
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
          <DialogTitle>Adicionar subcentro de custo</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo subcentro de custo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                {isLoading ? "Criando..." : "Criar subcentro"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { CreateSubcentroCustoDialog };
