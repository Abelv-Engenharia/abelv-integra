import { useState } from "react";
import { RelatoriosTab } from "@/components/veiculos/relatorios/RelatoriosTab";
import { 
  veiculosData, 
  multasDataInitial, 
  condutoresData, 
  cartoesData, 
  semPararData 
} from "@/data/mockVeiculosData";
import ChecklistDataService from "@/services/ChecklistDataService";

export default function RelatoriosVeiculos() {
  const [historicoCalculos] = useState([]);
  const checklistsData = ChecklistDataService.obterTodos();

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
        multas={multasDataInitial}
        condutores={condutoresData}
        cartoes={cartoesData}
        pedagogios={semPararData}
        calculos={historicoCalculos}
      />
    </div>
  );
}
