import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { updateExtintor } from "@/services/extintores/extintoresService";
import { formatarTipoExtintor } from "@/utils/extintorUtils";

interface ExtintorEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extintor: any;
  onSuccess: () => void;
}

export function ExtintorEditDialog({ open, onOpenChange, extintor, onSuccess }: ExtintorEditDialogProps) {
  const [formData, setFormData] = useState({
    localizacao: "",
    fabricante: "",
    data_fabricacao: "",
    data_vencimento: "",
    observacoes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (extintor) {
      setFormData({
        localizacao: extintor.localizacao || "",
        fabricante: extintor.fabricante || "",
        data_fabricacao: extintor.data_fabricacao || "",
        data_vencimento: extintor.data_vencimento || "",
        observacoes: extintor.observacoes || "",
      });
    }
  }, [extintor]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateExtintor(extintor.id, {
        localizacao: formData.localizacao,
        fabricante: formData.fabricante || null,
        data_fabricacao: formData.data_fabricacao || null,
        data_vencimento: formData.data_vencimento || null,
        observacoes: formData.observacoes || null,
      } as any);

      toast({
        title: "Sucesso!",
        description: "Extintor atualizado com sucesso.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar extintor:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar extintor.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!extintor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Extintor</DialogTitle>
          <DialogDescription>
            Atualize as informações do extintor
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informações não editáveis */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Código</p>
              <p className="text-base font-semibold">{extintor.codigo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">CCA</p>
              <p className="text-base">{extintor.ccas?.codigo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <p className="text-base">{formatarTipoExtintor(extintor.tipo)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Capacidade</p>
              <p className="text-base">{extintor.capacidade}</p>
            </div>
          </div>

          {/* Campos editáveis */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="localizacao">Localização *</Label>
              <Input
                id="localizacao"
                value={formData.localizacao}
                onChange={(e) => handleInputChange("localizacao", e.target.value)}
                required
                placeholder="Ex: Pavimento 1 - Corredor A"
              />
            </div>

            <div>
              <Label htmlFor="fabricante">Fabricante</Label>
              <Input
                id="fabricante"
                value={formData.fabricante}
                onChange={(e) => handleInputChange("fabricante", e.target.value)}
                placeholder="Nome do fabricante"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data_fabricacao">Data de Fabricação</Label>
                <Input
                  id="data_fabricacao"
                  type="date"
                  value={formData.data_fabricacao}
                  onChange={(e) => handleInputChange("data_fabricacao", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="data_vencimento">Data de Vencimento</Label>
                <Input
                  id="data_vencimento"
                  type="date"
                  value={formData.data_vencimento}
                  onChange={(e) => handleInputChange("data_vencimento", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange("observacoes", e.target.value)}
                placeholder="Informações adicionais..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
