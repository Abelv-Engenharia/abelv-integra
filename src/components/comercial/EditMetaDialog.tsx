import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMetasAnuais, MetaAnual } from "@/hooks/comercial/useMetasAnuais";

interface EditMetaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meta: MetaAnual;
}

export const EditMetaDialog = ({ open, onOpenChange, meta }: EditMetaDialogProps) => {
  const { toast } = useToast();
  const { updateMeta } = useMetasAnuais();
  const [formData, setFormData] = useState({
    metaAnual: meta.meta_anual,
    metaT1: meta.meta_t1,
    metaT2: meta.meta_t2,
    metaT3: meta.meta_t3,
    metaT4: meta.meta_t4
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open && meta) {
      setFormData({
        metaAnual: meta.meta_anual,
        metaT1: meta.meta_t1,
        metaT2: meta.meta_t2,
        metaT3: meta.meta_t3,
        metaT4: meta.meta_t4
      });
      setErrors({});
    }
  }, [open, meta]);

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

    // Validar que a soma das metas trimestrais é igual à meta anual
    const totalTrimestral = formData.metaT1 + formData.metaT2 + formData.metaT3 + formData.metaT4;
    if (Math.abs(totalTrimestral - formData.metaAnual) > 0.01) {
      newErrors.metaAnual = true;
      newErrors.metaT1 = true;
      newErrors.metaT2 = true;
      newErrors.metaT3 = true;
      newErrors.metaT4 = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const totalTrimestral = formData.metaT1 + formData.metaT2 + formData.metaT3 + formData.metaT4;
    
    if (Math.abs(totalTrimestral - formData.metaAnual) > 0.01) {
      toast({
        title: "Erro de validação",
        description: "A soma das metas trimestrais deve ser igual à meta anual.",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Preencha todos os campos obrigatórios corretamente.",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateMeta.mutateAsync({
        id: meta.id,
        meta_anual: formData.metaAnual,
        meta_t1: formData.metaT1,
        meta_t2: formData.metaT2,
        meta_t3: formData.metaT3,
        meta_t4: formData.metaT4,
      });

      toast({
        title: "Meta atualizada!",
        description: `Meta para ${meta.ano} foi atualizada com sucesso.`,
      });

      onOpenChange(false);
    } catch (error) {
      // Error já tratado no hook
    }
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
            <div className={`rounded-lg p-4 ${Math.abs(totalTrimestral - formData.metaAnual) > 0.01 ? 'bg-destructive/10 border border-destructive' : 'bg-muted/50'}`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Soma das Metas Trimestrais:</span>
                <span className="text-lg font-bold">{formatCurrency(totalTrimestral)}</span>
              </div>
              {Math.abs(totalTrimestral - formData.metaAnual) > 0.01 && (
                <p className="text-xs text-destructive font-medium mt-2">
                  ⚠️ A soma das metas trimestrais deve ser igual à meta anual. Diferença: {formatCurrency(Math.abs(totalTrimestral - formData.metaAnual))}
                </p>
              )}
              {Math.abs(totalTrimestral - formData.metaAnual) <= 0.01 && totalTrimestral > 0 && (
                <p className="text-xs text-green-600 font-medium mt-2">
                  ✓ As metas trimestrais somam corretamente à meta anual
                </p>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={handleSave} 
              className="gap-2"
              disabled={updateMeta.isPending}
            >
              {updateMeta.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {updateMeta.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={updateMeta.isPending}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
