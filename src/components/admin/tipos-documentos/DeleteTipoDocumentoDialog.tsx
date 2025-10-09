import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { tipoDocumentoService, TipoDocumento } from "@/services/admin/tipoDocumentoService";

interface DeleteTipoDocumentoDialogProps {
  documento: TipoDocumento;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const DeleteTipoDocumentoDialog = ({ 
  documento, 
  open, 
  onOpenChange, 
  onSuccess 
}: DeleteTipoDocumentoDialogProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await tipoDocumentoService.delete(documento.id);
      
      toast({
        title: "Tipo de documento excluído",
        description: "O tipo de documento foi excluído com sucesso.",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao excluir tipo de documento:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o tipo de documento. Pode haver registros vinculados a ele.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o tipo de documento <strong>{documento.codigo} - {documento.descricao}</strong>?
            <br /><br />
            Esta ação não pode ser desfeita e pode afetar registros existentes que utilizam este tipo de documento.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
