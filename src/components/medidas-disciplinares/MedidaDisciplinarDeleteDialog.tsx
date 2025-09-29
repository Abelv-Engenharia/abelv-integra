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
import { MedidaDisciplinar } from "@/types/medidasDisciplinares";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  medida: MedidaDisciplinar;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const MedidaDisciplinarDeleteDialog = ({ medida, open, onOpenChange, onSuccess }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("medidas_disciplinares")
        .delete()
        .eq("id", medida.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Medida disciplinar excluída!",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast({
        title: "Erro ao excluir",
        variant: "destructive",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta medida disciplinar? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700">
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MedidaDisciplinarDeleteDialog;
