
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
import { IDSMSIndicador } from "@/types/treinamentos";
import { idsmsService } from "@/services/idsms/idsmsService";
import { toast } from "@/hooks/use-toast";

interface DeleteIndicadorDialogProps {
  indicador: IDSMSIndicador | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const tipoNomes = {
  'IID': 'IID',
  'HSA': 'HSA', 
  'HT': 'HT',
  'IPOM': 'IPOM',
  'INSPECAO_ALTA_LIDERANCA': 'Inspeção Alta Liderança',
  'INSPECAO_GESTAO_SMS': 'Inspeção Gestão SMS',
  'INDICE_REATIVO': 'Índice Reativo'
};

export const DeleteIndicadorDialog: React.FC<DeleteIndicadorDialogProps> = ({
  indicador,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const handleDelete = async () => {
    if (!indicador) return;
    
    try {
      const success = await idsmsService.deleteIndicador(indicador.id);
      
      if (success) {
        toast({
          title: "Sucesso",
          description: "Indicador IDSMS excluído com sucesso!",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: "Erro",
          description: "Erro ao excluir indicador. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir indicador:", error);
      toast({
        title: "Erro",
        description: "Erro interno. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (!indicador) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este indicador IDSMS?
            <br />
            <br />
            <strong>Tipo:</strong> {tipoNomes[indicador.tipo as keyof typeof tipoNomes] || indicador.tipo}
            <br />
            <strong>Resultado:</strong> {Number(indicador.resultado).toFixed(1)}%
            <br />
            <strong>Data:</strong> {new Date(indicador.data).toLocaleDateString('pt-BR')}
            <br />
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
