import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Target, Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { annualGoalsMockData } from "@/data/annualGoalsMockData";
import { AnnualGoals } from "@/types/commercial";
import { EditMetaDialog } from "@/components/comercial/EditMetaDialog";
import { AddMetaDialog } from "@/components/comercial/AddMetaDialog";

const AnnualGoalsForm = () => {
  const navigate = useNavigate();
  const [editingMeta, setEditingMeta] = useState<AnnualGoals | null>(null);
  const [addingMeta, setAddingMeta] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAddSave = (meta: {
    ano: number;
    metaAnual: number;
    metaT1: number;
    metaT2: number;
    metaT3: number;
    metaT4: number;
  }) => {
    // Simular salvamento
    console.log("Meta adicionada:", meta);
  };

  const handleEditSave = (updatedMeta: AnnualGoals) => {
    // Simular atualização
    console.log("Meta atualizada:", updatedMeta);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/comercial/controle/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Metas Anuais</h1>
              <p className="text-muted-foreground mt-2">Cadastro e gerenciamento de metas de vendas</p>
            </div>
          </div>
          <Button onClick={() => setAddingMeta(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>

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

      <AddMetaDialog
        open={addingMeta}
        onOpenChange={setAddingMeta}
        onSave={handleAddSave}
      />

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