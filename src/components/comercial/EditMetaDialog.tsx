import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { AnnualGoals } from "@/types/commercial";
import { useToast } from "@/hooks/use-toast";

interface EditMetaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meta: AnnualGoals;
  onSave: (meta: AnnualGoals) => void;
}

export const EditMetaDialog = ({ open, onOpenChange, meta, onSave }: EditMetaDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    metaAnual: meta.metaAnual,
    metaT1: meta.metaT1,
    metaT2: meta.metaT2,
    metaT3: meta.metaT3,
    metaT4: meta.metaT4
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.metaAnual || formData.metaAnual <= 0) newErrors.metaAnual = true;
    if (!formData.metaT1 || formData.metaT1 <= 0) newErrors.metaT1 = true;
    if (!formData.metaT2 || formData.metaT2 <= 0) newErrors.metaT2 = true;
    if (!formData.metaT3 || formData.metaT3 <= 0) newErrors.metaT3 = true;
    if (!formData.metaT4 || formData.metaT4 <= 0) newErrors.metaT4 = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Preencha todos os campos obrigatórios corretamente.",
        variant: "destructive"
      });
      return;
    }

    onSave({
      ...meta,
      ...formData
    });

    toast({
      title: "Meta atualizada!",
      description: `Meta para ${meta.ano} foi atualizada com sucesso.`,
    });

    onOpenChange(false);
  };

  const totalTrimestral = formData.metaT1 + formData.metaT2 + formData.metaT3 + formData.metaT4;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Meta - Ano {meta.ano}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground">
              Meta Anual <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.metaAnual || ''}
              onChange={(e) => setFormData({ ...formData, metaAnual: parseFloat(e.target.value) || 0 })}
              className={errors.metaAnual ? "border-destructive" : ""}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(formData.metaAnual)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Meta T1 <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.metaT1 || ''}
                onChange={(e) => setFormData({ ...formData, metaT1: parseFloat(e.target.value) || 0 })}
                className={errors.metaT1 ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(formData.metaT1)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Meta T2 <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.metaT2 || ''}
                onChange={(e) => setFormData({ ...formData, metaT2: parseFloat(e.target.value) || 0 })}
                className={errors.metaT2 ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(formData.metaT2)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Meta T3 <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.metaT3 || ''}
                onChange={(e) => setFormData({ ...formData, metaT3: parseFloat(e.target.value) || 0 })}
                className={errors.metaT3 ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(formData.metaT3)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Meta T4 <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.metaT4 || ''}
                onChange={(e) => setFormData({ ...formData, metaT4: parseFloat(e.target.value) || 0 })}
                className={errors.metaT4 ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(formData.metaT4)}
              </p>
            </div>
          </div>

          {totalTrimestral > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Soma das Metas Trimestrais:</span>
                <span className="text-lg font-bold">{formatCurrency(totalTrimestral)}</span>
              </div>
              {Math.abs(totalTrimestral - formData.metaAnual) > 0.01 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Diferença com a meta anual: {formatCurrency(totalTrimestral - formData.metaAnual)}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Salvar Alterações
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
