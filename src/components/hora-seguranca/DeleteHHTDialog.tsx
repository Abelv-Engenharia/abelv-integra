
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

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
import { deleteHorasTrabalhadas } from "@/services/hora-seguranca/horasTrabalhadasService";

interface DeleteHHTDialogProps {
  hht: {
    id: string;
    mes: number;
    ano: number;
    horas_trabalhadas: number;
    codigo: string;
    nome: string;
  };
  onSuccess: () => void;
}

export function DeleteHHTDialog({ hht, onSuccess }: DeleteHHTDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteHorasTrabalhadas(hht.id);

      if (success) {
        toast({
          title: "Registro excluído com sucesso",
          description: `HHT do CCA ${hht.codigo} - ${hht.nome} foi excluído`,
        });
        onSuccess();
      } else {
        toast({
          title: "Erro ao excluir registro",
          description: "Ocorreu um erro ao excluir o registro de HHT",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting HHT:", error);
      toast({
        title: "Erro ao excluir registro",
        description: "Ocorreu um erro ao excluir o registro de HHT",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir este registro de HHT?
            <br />
            <br />
            <strong>CCA:</strong> {hht.codigo} - {hht.nome}
            <br />
            <strong>Período:</strong> {hht.mes}/{hht.ano}
            <br />
            <strong>Horas:</strong> {hht.horas_trabalhadas.toLocaleString('pt-BR')} horas
            <br />
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
