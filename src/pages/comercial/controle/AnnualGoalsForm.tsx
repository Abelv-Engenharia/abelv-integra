import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Target, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { annualGoalsMockData } from "@/data/annualGoalsMockData";
import { AnnualGoals } from "@/types/commercial";
import { useToast } from "@/hooks/use-toast";
import { EditMetaDialog } from "@/components/comercial/EditMetaDialog";

const AnnualGoalsForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<Omit<AnnualGoals, 'id' | 'criadoEm' | 'ativo'>>({
    ano: currentYear,
    metaAnual: 0,
    metaT1: 0,
    metaT2: 0,
    metaT3: 0,
    metaT4: 0
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [editingMeta, setEditingMeta] = useState<AnnualGoals | null>(null);

  useEffect(() => {
    // Buscar meta existente para o ano atual se houver
    const existingGoal = annualGoalsMockData.find(goal => goal.ano === currentYear && goal.ativo);
    if (existingGoal) {
      setFormData({
        ano: existingGoal.ano,
        metaAnual: existingGoal.metaAnual,
        metaT1: existingGoal.metaT1,
        metaT2: existingGoal.metaT2,
        metaT3: existingGoal.metaT3,
        metaT4: existingGoal.metaT4
      });
    }
  }, [currentYear]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.ano || formData.ano < 2022) newErrors.ano = true;
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

    // Simular salvamento
    toast({
      title: "Meta salva com sucesso!",
      description: `Meta anual para ${formData.ano} foi cadastrada.`,
    });
    
    navigate('/comercial/controle/dashboard');
  };

  const handleEditSave = (updatedMeta: AnnualGoals) => {
    // Simular atualização
    console.log("Meta atualizada:", updatedMeta);
  };

  const totalTrimestral = formData.metaT1 + formData.metaT2 + formData.metaT3 + formData.metaT4;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/comercial/controle/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Metas Anuais</h1>
            <p className="text-muted-foreground mt-2">Cadastro e gerenciamento de metas de vendas</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Target className="h-6 w-6" />
              </div>
              <CardTitle>Definição de Metas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Ano da Meta <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  min="2022"
                  max="2030"
                  value={formData.ano || ''}
                  onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) || 0 })}
                  className={errors.ano ? "border-destructive" : ""}
                />
              </div>

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
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Soma das Metas Trimestrais:</span>
                    <span className="text-lg font-bold">{formatCurrency(totalTrimestral)}</span>
                  </div>
                  {Math.abs(totalTrimestral - formData.metaAnual) > 0.01 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Diferença com a meta anual: {formatCurrency(totalTrimestral - formData.metaAnual)}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Meta
              </Button>
              <Button variant="outline" onClick={() => navigate('/comercial/controle/dashboard')}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Target className="h-6 w-6" />
              </div>
              <CardTitle>Metas Cadastradas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {annualGoalsMockData.filter(goal => goal.ativo).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Nenhuma meta cadastrada</p>
            ) : (
              <div className="space-y-4">
                {annualGoalsMockData
                  .filter(goal => goal.ativo)
                  .sort((a, b) => b.ano - a.ano)
                  .map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-lg">Ano {goal.ano}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {new Date(goal.criadoEm).toLocaleDateString('pt-BR')}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingMeta(goal)}
                            className="gap-2"
                          >
                            <Pencil className="h-4 w-4" />
                            Editar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Meta Anual</p>
                          <p className="text-lg font-bold">{formatCurrency(goal.metaAnual)}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">T1</p>
                            <p className="text-sm font-semibold">{formatCurrency(goal.metaT1)}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">T2</p>
                            <p className="text-sm font-semibold">{formatCurrency(goal.metaT2)}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">T3</p>
                            <p className="text-sm font-semibold">{formatCurrency(goal.metaT3)}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">T4</p>
                            <p className="text-sm font-semibold">{formatCurrency(goal.metaT4)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Somente uma meta anual ativa por ano é permitida</p>
              <p>• Se cadastrar nova meta para o mesmo ano, a anterior será sobrescrita</p>
              <p>• As metas são automaticamente exibidas nos gráficos de acompanhamento</p>
              <p>• Todos os valores devem ser preenchidos em reais (R$)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {editingMeta && (
        <EditMetaDialog
          open={!!editingMeta}
          onOpenChange={(open) => !open && setEditingMeta(null)}
          meta={editingMeta}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default AnnualGoalsForm;