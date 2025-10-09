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
import { tipoDocumentoService } from "@/services/admin/tipoDocumentoService";
import { TipoDocumentoFormFields } from "./TipoDocumentoFormFields";

interface CreateTipoDocumentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateTipoDocumentoDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}: CreateTipoDocumentoDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      codigo: "",
      descricao: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await tipoDocumentoService.create(data);
      
      toast({
        title: "Tipo de documento criado",
        description: "O tipo de documento foi criado com sucesso.",
      });
      
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao criar tipo de documento:', error);
      toast({
        title: "Erro ao criar",
        description: "Ocorreu um erro ao criar o tipo de documento.",
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
          <DialogTitle>Criar Novo Tipo de Documento</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo tipo de documento.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TipoDocumentoFormFields />
            
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
                {isLoading ? "Criando..." : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
