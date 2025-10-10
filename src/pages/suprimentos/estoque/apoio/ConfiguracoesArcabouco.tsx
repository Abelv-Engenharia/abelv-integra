import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ConfiguracoesArcabouco = () => {
  const [percentual, setPercentual] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!percentual) {
      toast({
        title: "Erro",
        description: "O percentual é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const numPercentual = parseFloat(percentual);
    if (isNaN(numPercentual) || numPercentual < 0 || numPercentual > 100) {
      toast({
        title: "Erro", 
        description: "Digite um percentual válido entre 0 e 100",
        variant: "destructive",
      });
      return;
    }

    // Aqui seria implementada a lógica para salvar as configurações
    toast({
      title: "Sucesso",
      description: "Configurações salvas com sucesso!",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Arcabouço</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="percentual">
                % do valor dos item a serem transferidos entre obras *
              </Label>
              <Input
                id="percentual"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={percentual}
                onChange={(e) => setPercentual(e.target.value)}
                placeholder="Digite o percentual"
                className={!percentual ? "border-red-500" : ""}
              />
              {!percentual && (
                <p className="text-sm text-red-500">Este campo é obrigatório</p>
              )}
            </div>
            
            <Button type="submit" className="w-full sm:w-auto">
              Salvar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfiguracoesArcabouco;
