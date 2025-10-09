
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ccaService, CCA } from "@/services/admin/ccaService";
import { useCCAInvalidation } from "@/hooks/useCCAInvalidation";
import { CCAFormFields } from "./CCAFormFields";
import { SubcentrosCustosTable } from "./SubcentrosCustosTable";
import { CreateSubcentroCustoDialog } from "./CreateSubcentroCustoDialog";
import { EditSubcentroCustoDialog } from "./EditSubcentroCustoDialog";
import { DeleteSubcentroCustoDialog } from "./DeleteSubcentroCustoDialog";
import { SubcentroCusto } from "@/services/admin/subcentroCustoService";
import { Plus } from "lucide-react";

interface EditCCADialogProps {
  cca: CCA | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditCCADialog = ({ cca, open, onOpenChange, onSuccess }: EditCCADialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { invalidateAllCCAQueries } = useCCAInvalidation();
  
  // Estados para gerenciar subcentros
  const [createSubcentroOpen, setCreateSubcentroOpen] = useState(false);
  const [editSubcentro, setEditSubcentro] = useState<SubcentroCusto | null>(null);
  const [deleteSubcentro, setDeleteSubcentro] = useState<SubcentroCusto | null>(null);
  
  const form = useForm({
    defaultValues: {
      codigo: "",
      nome: "",
      tipo: "",
      ativo: true,
    },
  });

  useEffect(() => {
    if (cca && open) {
      form.reset({
        codigo: cca.codigo,
        nome: cca.nome,
        tipo: cca.tipo,
        ativo: cca.ativo,
      });
    }
  }, [cca, open, form]);

  const onSubmit = async (data: any) => {
    if (!cca) return;

    setIsLoading(true);
    try {
      const updatedCCA = await ccaService.update(cca.id, data);
      
      if (updatedCCA) {
        toast({
          title: "CCA atualizado",
          description: "O CCA foi atualizado com sucesso.",
        });
        
        // Invalidar todas as queries relacionadas a CCAs para atualização imediata
        await invalidateAllCCAQueries();
        
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar CCA:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o CCA.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubcentroSuccess = () => {
    // Apenas fecha os diálogos - a tabela será atualizada automaticamente
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar CCA</DialogTitle>
            <DialogDescription>
              Atualize as informações do CCA selecionado.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CCAFormFields />
              
              {/* Seção de Subcentros de Custo */}
              {cca && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Subcentros de custo</h3>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setCreateSubcentroOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar subcentro
                    </Button>
                  </div>
                  
                  <SubcentrosCustosTable
                    ccaId={cca.id}
                    onEdit={(subcentro) => setEditSubcentro(subcentro)}
                    onDelete={(subcentro) => setDeleteSubcentro(subcentro)}
                  />
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogos de Subcentros */}
      {cca && (
        <>
          <CreateSubcentroCustoDialog
            ccaId={cca.id}
            open={createSubcentroOpen}
            onOpenChange={setCreateSubcentroOpen}
            onSuccess={handleSubcentroSuccess}
          />

          <EditSubcentroCustoDialog
            subcentro={editSubcentro}
            open={!!editSubcentro}
            onOpenChange={(open) => !open && setEditSubcentro(null)}
            onSuccess={handleSubcentroSuccess}
          />

          <DeleteSubcentroCustoDialog
            subcentro={deleteSubcentro}
            open={!!deleteSubcentro}
            onOpenChange={(open) => !open && setDeleteSubcentro(null)}
            onSuccess={handleSubcentroSuccess}
          />
        </>
      )}
    </>
  );
};

export { EditCCADialog };
