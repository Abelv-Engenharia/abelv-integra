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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface EditSegmentDialogProps {
  segmento: {
    id: string;
    nome: string;
    ativo: boolean;
  };
  onUpdate: (id: string, nome: string, ativo: boolean) => void;
  isLoading?: boolean;
}

export default function EditSegmentDialog({ segmento, onUpdate, isLoading }: EditSegmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState(segmento.nome);
  const [ativo, setAtivo] = useState(segmento.ativo);

  useEffect(() => {
    setNome(segmento.nome);
    setAtivo(segmento.ativo);
  }, [segmento]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast.error("Digite um nome para o segmento");
      return;
    }

    onUpdate(segmento.id, nome.trim(), ativo);
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
          <DialogTitle>Editar segmento</DialogTitle>
          <DialogDescription>
            Altere as informações do segmento
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome-edit">Nome do segmento</Label>
              <Input
                id="nome-edit"
                placeholder="Ex: Infraestrutura"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ativo-edit">Ativo</Label>
              <Switch
                id="ativo-edit"
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
