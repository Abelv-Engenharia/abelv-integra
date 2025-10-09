import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { subcentroCustoService, SubcentroCusto } from "@/services/admin/subcentroCustoService";
import { useSubcentroCustoInvalidation } from "@/hooks/useSubcentroCustoInvalidation";

interface DeleteSubcentroCustoDialogProps {
  subcentro: SubcentroCusto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteSubcentroCustoDialog = ({
  subcentro,
  open,
  onOpenChange,
  onSuccess,
}: DeleteSubcentroCustoDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { invalidateSubcentrosQueries } = useSubcentroCustoInvalidation();

  const handleDelete = async () => {
    if (!subcentro) return;

    setIsLoading(true);
    try {
      await subcentroCustoService.delete(subcentro.id);

      toast({
        title: "Subcentro excluído",
        description: "O subcentro de custo foi excluído com sucesso.",
      });

      await invalidateSubcentrosQueries(subcentro.cca_id);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao excluir subcentro:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o subcentro de custo.",
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
          <DialogTitle>Excluir subcentro de custo</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o subcentro de custo com ID Sienge{" "}
            <strong>{subcentro?.id_sienge}</strong>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteSubcentroCustoDialog };
