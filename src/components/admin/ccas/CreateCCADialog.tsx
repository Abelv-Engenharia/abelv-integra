
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
import { ccaService } from "@/services/admin/ccaService";
import { useCCAInvalidation } from "@/hooks/useCCAInvalidation";
import { CCAFormFields } from "./CCAFormFields";

interface CreateCCADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateCCADialog = ({ open, onOpenChange, onSuccess }: CreateCCADialogProps) => {
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

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const newCCA = await ccaService.create(data);
      
      if (newCCA) {
        toast({
          title: "CCA criado",
          description: "O CCA foi criado com sucesso.",
        });
        
        // Invalidar todas as queries relacionadas a CCAs para atualização imediata
        await invalidateAllCCAQueries();
        
        form.reset();
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erro ao criar CCA:', error);
      toast({
        title: "Erro ao criar",
        description: "Ocorreu um erro ao criar o CCA.",
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
          <DialogTitle>Criar Novo CCA</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo CCA.
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
                {isLoading ? "Criando..." : "Criar CCA"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { CreateCCADialog };
