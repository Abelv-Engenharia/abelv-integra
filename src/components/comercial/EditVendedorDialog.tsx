import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil } from "lucide-react";

interface EditVendedorDialogProps {
  vendedor: {
    id: string;
    ativo: boolean;
    nome: string;
  };
  onUpdate: (id: string, ativo: boolean) => void;
  isLoading?: boolean;
}

export default function EditVendedorDialog({ vendedor, onUpdate, isLoading }: EditVendedorDialogProps) {
  const [open, setOpen] = useState(false);
  const [ativo, setAtivo] = useState(vendedor.ativo);

  useEffect(() => {
    setAtivo(vendedor.ativo);
  }, [vendedor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(vendedor.id, ativo);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar vendedor</DialogTitle>
          <DialogDescription>
            Altere o status do vendedor {vendedor.nome}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ativo-vendedor">Ativo</Label>
              <Switch
                id="ativo-vendedor"
                checked={ativo}
                onCheckedChange={setAtivo}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
