import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculoRotasCard } from "@/components/gestao-pessoas/veiculos/CalculoRotasCard";
import { HistoricoCalculosRotas } from "@/components/gestao-pessoas/veiculos/HistoricoCalculosRotas";
import type { CalculoEstimativaCartao } from "@/types/gestao-pessoas/route";
import { toast } from "@/hooks/use-toast";

export default function CalculoRotas() {
  const [historicoCalculos, setHistoricoCalculos] = useState<CalculoEstimativaCartao[]>([]);
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [cartoes, setCartoes] = useState<any[]>([]);

  useEffect(() => {
    // Carregar veículos do localStorage
    const veiculosData = localStorage.getItem("veiculos");
    if (veiculosData) {
      setVeiculos(JSON.parse(veiculosData));
    }

    // Carregar cartões do localStorage
    const cartoesData = localStorage.getItem("cartoes");
    if (cartoesData) {
      setCartoes(JSON.parse(cartoesData));
    }
  }, []);

  const handleNovoCalculo = (calculo: CalculoEstimativaCartao) => {
    setHistoricoCalculos(prev => [calculo, ...prev]);
    toast({
      title: "Cálculo salvo",
      description: "O cálculo de rota foi adicionado ao histórico.",
    });
  };

  const handleExcluirCalculo = (id: string) => {
    setHistoricoCalculos(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Cálculo excluído",
      description: "O cálculo foi removido do histórico.",
    });
  };

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
            onCalculoSalvo={handleNovoCalculo} 
          />
        </CardContent>
      </Card>

      {/* Histórico */}
      <HistoricoCalculosRotas 
        calculos={historicoCalculos}
        onExcluir={handleExcluirCalculo}
      />
    </div>
  );
}
