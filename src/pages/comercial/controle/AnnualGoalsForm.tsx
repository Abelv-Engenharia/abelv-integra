import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { annualGoalsMockData } from "@/data/annualGoalsMockData";

const AnnualGoalsForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedYear] = useState(new Date().getFullYear());

  const currentYearGoal = annualGoalsMockData.find(g => g.ano === selectedYear) || annualGoalsMockData[0];
  
  const [metaAnual, setMetaAnual] = useState(currentYearGoal.metaAnual);
  const [metaT1, setMetaT1] = useState(currentYearGoal.metaT1);
  const [metaT2, setMetaT2] = useState(currentYearGoal.metaT2);
  const [metaT3, setMetaT3] = useState(currentYearGoal.metaT3);
  const [metaT4, setMetaT4] = useState(currentYearGoal.metaT4);

  const handleSave = () => {
    toast({
      title: "Metas salvas com sucesso!",
      description: `Metas anuais de ${selectedYear} foram atualizadas.`,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const totalTrimestres = metaT1 + metaT2 + metaT3 + metaT4;

  return (
    <div className="flex flex-col min-h-screen p-6 bg-background">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/comercial/controle")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Metas Anuais {selectedYear}</h1>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Metas
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumo Anual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Meta Anual Definida</p>
              <p className="text-2xl font-bold">{formatCurrency(metaAnual)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Soma dos Trimestres</p>
              <p className="text-2xl font-bold">{formatCurrency(totalTrimestres)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Meta Anual</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="metaAnual">Meta Anual Total (R$)</Label>
            <Input
              id="metaAnual"
              type="number"
              value={metaAnual}
              onChange={(e) => setMetaAnual(parseFloat(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metas Trimestrais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div>
                <Label htmlFor="metaT1">T1 (Jan-Mar) - Meta (R$)</Label>
                <Input
                  id="metaT1"
                  type="number"
                  value={metaT1}
                  onChange={(e) => setMetaT1(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="metaT2">T2 (Abr-Jun) - Meta (R$)</Label>
                <Input
                  id="metaT2"
                  type="number"
                  value={metaT2}
                  onChange={(e) => setMetaT2(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="metaT3">T3 (Jul-Set) - Meta (R$)</Label>
                <Input
                  id="metaT3"
                  type="number"
                  value={metaT3}
                  onChange={(e) => setMetaT3(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="metaT4">T4 (Out-Dez) - Meta (R$)</Label>
                <Input
                  id="metaT4"
                  type="number"
                  value={metaT4}
                  onChange={(e) => setMetaT4(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnualGoalsForm;
