
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Perfil, Permissoes } from "@/types/users";
import { PerfilForm } from "./PerfilForm";

interface PerfilDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  perfilSelecionado: Perfil | null;
  loading: boolean;
  permissoesIniciais: Permissoes;
  onSalvar: (nome: string, descricao: string, permissoes: Permissoes) => void;
}

export const PerfilDialog = ({ 
  open, 
  onOpenChange, 
  perfilSelecionado, 
  loading,
  permissoesIniciais,
  onSalvar 
}: PerfilDialogProps) => {
  const initialData = perfilSelecionado ? {
    nome: perfilSelecionado.nome,
    descricao: perfilSelecionado.descricao,
    permissoes: perfilSelecionado.permissoes
  } : {
    nome: '',
    descricao: '',
    permissoes: permissoesIniciais
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {perfilSelecionado ? `Editar perfil: ${perfilSelecionado.nome}` : "Novo Perfil de Acesso"}
          </DialogTitle>
          <DialogDescription>
            {perfilSelecionado 
              ? "Atualize as informações do perfil e suas permissões" 
              : "Crie um novo perfil de acesso e defina suas permissões"
            }
          </DialogDescription>
        </DialogHeader>
        
        <PerfilForm
          initialData={initialData}
          onCancel={() => onOpenChange(false)}
          onSave={onSalvar}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};
