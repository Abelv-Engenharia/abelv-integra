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
import { tipoDocumentoService, TipoDocumento } from "@/services/admin/tipoDocumentoService";
import { TipoDocumentoFormFields } from "./TipoDocumentoFormFields";

interface EditTipoDocumentoDialogProps {
  documento: TipoDocumento;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditTipoDocumentoDialog = ({ 
  documento, 
  open, 
  onOpenChange, 
  onSuccess 
}: EditTipoDocumentoDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      codigo: documento.codigo,
      descricao: documento.descricao,
    },
  });

  useEffect(() => {
    if (documento) {
      form.reset({
        codigo: documento.codigo,
        descricao: documento.descricao,
      });
    }
  }, [documento, form]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await tipoDocumentoService.update(documento.id, data);
      
      toast({
        title: "Tipo de documento atualizado",
        description: "O tipo de documento foi atualizado com sucesso.",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar tipo de documento:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o tipo de documento.",
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
          <DialogTitle>Editar Tipo de Documento</DialogTitle>
          <DialogDescription>
            Atualize as informações do tipo de documento.
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
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
