
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ccaService, CCA } from "@/services/admin/ccaService";
import { toast } from "@/hooks/use-toast";

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
  const handleInactivate = async () => {
    try {
      const result = await ccaService.delete(cca.id);
      
      if (result) {
        toast({
          title: "Sucesso",
          description: "CCA inativado com sucesso!",
        });
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

  const handleActivate = async () => {
    try {
      const result = await ccaService.activate(cca.id);
      
      if (result) {
        toast({
          title: "Sucesso",
          description: "CCA ativado com sucesso!",
        });
        onSuccess();
      } else {
        toast({
          title: "Erro",
          description: "Erro ao ativar CCA. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao ativar CCA:", error);
      toast({
        title: "Erro",
        description: "Erro interno. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {cca.ativo ? "Inativar CCA" : "Ativar CCA"}
          </DialogTitle>
          <DialogDescription>
            {cca.ativo 
              ? "Tem certeza que deseja inativar este CCA? Ele ficará indisponível para uso no sistema."
              : "Tem certeza que deseja ativar este CCA? Ele ficará disponível para uso no sistema."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Código:</span>
                <span>{cca.codigo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Nome:</span>
                <span>{cca.nome}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Tipo:</span>
                <Badge variant="secondary">{cca.tipo}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Status Atual:</span>
                <Badge variant={cca.ativo ? "default" : "destructive"}>
                  {cca.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          {cca.ativo ? (
            <Button
              variant="destructive"
              onClick={handleInactivate}
            >
              Inativar CCA
            </Button>
          ) : (
            <Button
              onClick={handleActivate}
            >
              Ativar CCA
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
