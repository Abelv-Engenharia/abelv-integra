import { useState } from "react";
import { RelatoriosTab } from "@/components/gestao-pessoas/veiculos/relatorios/RelatoriosTab";
import ChecklistDataService from "@/services/gestao-pessoas/ChecklistDataService";
import { useVeiculos } from "@/hooks/gestao-pessoas/useVeiculos";
import { useCondutores } from "@/hooks/gestao-pessoas/useCondutores";
import { useMultas } from "@/hooks/gestao-pessoas/useMultas";
import { useCartoesAbastecimento } from "@/hooks/gestao-pessoas/useCartoesAbastecimento";
import { usePedagiosEstacionamentos } from "@/hooks/gestao-pessoas/usePedagiosEstacionamentos";

export default function RelatoriosVeiculos() {
  const [historicoCalculos] = useState([]);
  const checklistsData = ChecklistDataService.obterTodos();
  
  // Buscar dados reais do banco de dados
  const { data: veiculosData = [], isLoading: isLoadingVeiculos } = useVeiculos();
  const { data: multasData = [], isLoading: isLoadingMultas } = useMultas();
  const { data: condutoresData = [], isLoading: isLoadingCondutores } = useCondutores();
  const { data: cartoesData = [], isLoading: isLoadingCartoes } = useCartoesAbastecimento();
  const { data: pedagogiosData = [], isLoading: isLoadingPedagios } = usePedagiosEstacionamentos();

  const isLoading = isLoadingVeiculos || isLoadingMultas || isLoadingCondutores || isLoadingCartoes || isLoadingPedagios;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados dos relatórios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-4 text-muted-foreground">
        Gestão de Pessoas &gt; Recursos & Benefícios &gt; Gestão de Veículos &gt; <span className="text-foreground font-medium">Relatórios</span>
      </nav>
      
      {/* Título */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Relatórios de Veículos</h1>
        <p className="text-muted-foreground mt-2">
          Análise consolidada e detalhada de gestão de veículos
        </p>
      </div>
      
      {/* Componente de Relatórios */}
      <RelatoriosTab 
        veiculos={veiculosData}
        checklists={checklistsData}
        multas={multasData}
        condutores={condutoresData}
        cartoes={cartoesData}
        pedagogios={pedagogiosData}
        calculos={historicoCalculos}
      />
    </div>
  );
}
