
import { UserRound } from "lucide-react";
import { User } from "@/types/users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExcluirUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null | undefined;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const ExcluirUsuarioDialog = ({
  open,
  onOpenChange,
  user,
  onConfirm,
  isDeleting
}: ExcluirUsuarioDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Excluir Usuário</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este usuário? Esta ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-4 py-4">
          <div className="bg-muted p-2 rounded-full">
            <UserRound className="h-8 w-8" />
          </div>
          <div>
            <p className="font-medium">{user.nome}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">Perfil: {user.perfil}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
