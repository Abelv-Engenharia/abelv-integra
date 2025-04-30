
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

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  onConfirm: () => void;
}

export const DeleteUserDialog = ({
  open,
  onOpenChange,
  selectedUser,
  onConfirm,
}: DeleteUserDialogProps) => {
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
            <p className="font-medium">{selectedUser?.nome}</p>
            <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={onConfirm}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
