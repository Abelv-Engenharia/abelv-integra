
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ccaService, CCA } from "@/services/admin/ccaService";
import { useCCAInvalidation } from "@/hooks/useCCAInvalidation";

interface DeleteCCADialogProps {
  cca: CCA | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteCCADialog = ({ cca, open, onOpenChange, onSuccess }: DeleteCCADialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { invalidateAllCCAQueries } = useCCAInvalidation();

  const handleDelete = async () => {
    if (!cca) return;

    setIsLoading(true);
    try {
      const success = await ccaService.delete(cca.id);
      
      if (success) {
        toast({
          title: "CCA inativado",
          description: "O CCA foi inativado com sucesso.",
        });
        
        // Invalidar todas as queries relacionadas a CCAs para atualização imediata
        await invalidateAllCCAQueries();
        
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erro ao inativar CCA:', error);
      toast({
        title: "Erro ao inativar",
        description: "Ocorreu um erro ao inativar o CCA.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Inativar CCA</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja inativar o CCA "{cca?.nome}" ({cca?.codigo})?
            Esta ação irá torná-lo indisponível para novos registros.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Inativando..." : "Inativar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteCCADialog };
