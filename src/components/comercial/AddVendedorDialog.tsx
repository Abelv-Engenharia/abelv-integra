import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

interface AddVendedorDialogProps {
  usuarios: Usuario[];
  vendedoresExistentes: string[];
  onAdd: (usuarioId: string) => void;
  isLoading?: boolean;
}

export default function AddVendedorDialog({ 
  usuarios, 
  vendedoresExistentes,
  onAdd, 
  isLoading 
}: AddVendedorDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState("");

  const usuariosDisponiveis = usuarios.filter(
    u => !vendedoresExistentes.includes(u.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUsuarioId) {
      toast.error("Selecione um usuário");
      return;
    }

    onAdd(selectedUsuarioId);
    setSelectedUsuarioId("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar vendedor</DialogTitle>
          <DialogDescription>
            Selecione um usuário para adicionar como vendedor
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[400px] pr-4">
            <RadioGroup
              value={selectedUsuarioId}
              onValueChange={setSelectedUsuarioId}
              className="space-y-2"
            >
              {usuariosDisponiveis.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Todos os usuários já são vendedores
                </p>
              ) : (
                usuariosDisponiveis.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => setSelectedUsuarioId(usuario.id)}
                  >
                    <RadioGroupItem value={usuario.id} id={usuario.id} />
                    <Label
                      htmlFor={usuario.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{usuario.nome}</span>
                        <span className="text-sm text-muted-foreground">
                          {usuario.email}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))
              )}
            </RadioGroup>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !selectedUsuarioId || usuariosDisponiveis.length === 0}
            >
              {isLoading ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
