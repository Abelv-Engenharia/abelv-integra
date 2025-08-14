
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
      console.error('❌ ID do desvio não encontrado');
      toast({
        title: "Erro",
        description: "ID do desvio não encontrado.",
        variant: "destructive",
      });
      onDesvioDeleted(undefined, false);
      return;
    }

    setIsLoading(true);
    console.log('🗑️ Iniciando processo de exclusão para:', desvio.id);
    
    try {
      const success = await desviosCompletosService.delete(desvio.id);
      console.log('📊 Resultado da exclusão:', success);

      if (success) {
        console.log('✅ Exclusão bem-sucedida, atualizando UI');
        toast({
          title: "Sucesso",
          description: "Desvio excluído com sucesso.",
        });
        setOpen(false);
        onDesvioDeleted(desvio.id, true);
      } else {
        console.error('❌ Falha na exclusão - serviço retornou false');
        toast({
          title: "Erro na exclusão",
          description: "Não foi possível excluir o desvio. Verifique suas permissões.",
          variant: "destructive",
        });
        onDesvioDeleted(desvio.id, false);
      }
    } catch (error) {
      console.error('💥 Erro inesperado durante exclusão:', error);
      toast({
        title: "Erro técnico",
        description: "Ocorreu um erro inesperado. Tente novamente.",
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
            <p className="text-sm text-gray-600 mt-1">Responsável: {desvio.responsavel_inspecao}</p>
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
