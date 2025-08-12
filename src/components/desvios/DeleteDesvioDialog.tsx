
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService, DesvioCompleto } from "@/services/desvios/desviosCompletosService";

interface DeleteDesvioDialogProps {
  desvio: DesvioCompleto;
  onDesvioDeleted: (id?: string, deleted?: boolean) => void;
}

const DeleteDesvioDialog = ({ desvio, onDesvioDeleted }: DeleteDesvioDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!desvio.id) {
      toast({
        title: "Erro",
        description: "ID do desvio não encontrado.",
        variant: "destructive",
      });
      onDesvioDeleted(undefined, false);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Iniciando processo de exclusão do desvio:', desvio.id);
      const success = await desviosCompletosService.delete(desvio.id);
      console.log('Resultado da exclusão:', success);

      if (success) {
        toast({
          title: "Desvio excluído",
          description: "O desvio foi excluído permanentemente do sistema.",
        });
        setOpen(false);
        
        // Garantir que o callback seja chamado com os parâmetros corretos
        console.log('Chamando callback onDesvioDeleted com sucesso:', desvio.id);
        onDesvioDeleted(desvio.id, true);
      } else {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o desvio. Verifique as permissões ou tente novamente.",
          variant: "destructive",
        });
        onDesvioDeleted(desvio.id, false);
        console.error('Falha na exclusão do desvio:', desvio.id);
      }
    } catch (error) {
      console.error('Erro inesperado durante exclusão:', error);
      toast({
        title: "Erro técnico",
        description: "Ocorreu um erro inesperado ao tentar excluir o desvio.",
        variant: "destructive",
      });
      onDesvioDeleted(desvio.id, false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este desvio permanentemente? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium">ID: {desvio.id?.slice(0, 8)}...</p>
            <p className="text-sm text-gray-600 mt-1">Data: {new Date(desvio.data_desvio).toLocaleDateString('pt-BR')}</p>
            <p className="text-sm text-gray-600 mt-1">Local: {desvio.local}</p>
            <p className="text-sm text-gray-600 mt-1">
              Descrição: {desvio.descricao_desvio?.substring(0, 100)}
              {desvio.descricao_desvio && desvio.descricao_desvio.length > 100 ? '...' : ''}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Excluindo..." : "Excluir Definitivamente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDesvioDialog;
