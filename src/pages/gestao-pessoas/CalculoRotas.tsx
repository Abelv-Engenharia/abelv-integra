import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculoRotasCard } from "@/components/gestao-pessoas/veiculos/CalculoRotasCard";
import { HistoricoCalculosRotas } from "@/components/gestao-pessoas/veiculos/HistoricoCalculosRotas";
import { useVeiculos } from "@/hooks/gestao-pessoas/useVeiculos";
import { useCartoesAbastecimento } from "@/hooks/gestao-pessoas/useCartoesAbastecimento";
import { useCalculosRotas } from "@/hooks/gestao-pessoas/useCalculosRotas";
import { Loader2 } from "lucide-react";

export default function CalculoRotas() {
  const { data: veiculos = [], isLoading: isLoadingVeiculos } = useVeiculos();
  const { data: cartoes = [], isLoading: isLoadingCartoes } = useCartoesAbastecimento();
  const { calculos, isLoading: isLoadingCalculos, salvarCalculo, excluirCalculo } = useCalculosRotas();

  if (isLoadingVeiculos || isLoadingCartoes) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        Gestão de Pessoas &gt; Recursos & Benefícios &gt; Gestão de Veículos &gt; 
        <span className="text-foreground font-medium"> Cálculo de Rotas</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Cálculo de Rotas e Estimativas</h1>
        <p className="text-muted-foreground mt-2">
          Calcule estimativas de combustível e custos para rotas de veículos
        </p>
      </div>

      {/* Calculadora */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Estimativa</CardTitle>
        </CardHeader>
        <CardContent>
          <CalculoRotasCard 
            veiculos={veiculos}
            cartoes={cartoes}
            onCalculoSalvo={salvarCalculo} 
          />
        </CardContent>
      </Card>

      {/* Histórico */}
      <HistoricoCalculosRotas 
        calculos={calculos}
        onExcluir={excluirCalculo}
        isLoading={isLoadingCalculos}
      />
    </div>
  );
}
