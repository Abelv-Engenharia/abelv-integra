
import React from "react";
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
import { ccaService, CCA } from "@/services/admin/ccaService";
import { toast } from "@/hooks/use-toast";
import { useCCAInvalidation } from "@/hooks/useCCAInvalidation";

interface DeleteCCADialogProps {
  cca: CCA;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const DeleteCCADialog: React.FC<DeleteCCADialogProps> = ({
  cca,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { invalidateAllCCAQueries } = useCCAInvalidation();

  const handleDelete = async () => {
    try {
      const success = await ccaService.delete(cca.id);
      
      if (success) {
        toast({
          title: "Sucesso",
          description: "CCA inativado com sucesso! Todas as listas foram atualizadas.",
        });
        
        // Invalidate all CCA-related queries across the application
        await invalidateAllCCAQueries();
        
        onSuccess();
      } else {
        toast({
          title: "Erro",
          description: "Erro ao inativar CCA. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao inativar CCA:", error);
      toast({
        title: "Erro",
        description: "Erro interno. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Inativação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja inativar o CCA "{cca.codigo} - {cca.nome}"?
            Esta ação não pode ser desfeita e o CCA será removido de todas as listas da aplicação.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Inativar CCA
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
