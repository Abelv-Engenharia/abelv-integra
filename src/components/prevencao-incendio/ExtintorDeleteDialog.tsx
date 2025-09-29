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
import { toast } from "@/hooks/use-toast";
import { deleteExtintor } from "@/services/extintores/extintoresService";

interface ExtintorDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extintor: any;
  onSuccess: () => void;
}

export function ExtintorDeleteDialog({ open, onOpenChange, extintor, onSuccess }: ExtintorDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteExtintor(extintor.id);

      toast({
        title: "Sucesso!",
        description: "Extintor excluído com sucesso.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao excluir extintor:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir extintor.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!extintor) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá excluir permanentemente o extintor{" "}
            <strong>{extintor.codigo}</strong>.
            <br />
            <br />
            O histórico de inspeções vinculadas a este extintor será mantido,
            mas o extintor não estará mais disponível para novas inspeções.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
