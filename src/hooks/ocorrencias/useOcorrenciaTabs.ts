
import { useState } from "react";

export const ocorrenciaTabs = [
  { id: "identificacao", label: "Identificação" },
  { id: "informacoes", label: "Informações da Ocorrência" },
  { id: "classificacaoRisco", label: "Classificação de Risco" },
  { id: "planoAcao", label: "Plano de Ação" },
  { id: "fechamento", label: "Fechamento" },
];

export function useOcorrenciaTabs() {
  const [activeTab, setActiveTab] = useState(ocorrenciaTabs[0].id);

  const onNext = () => {
    const idx = ocorrenciaTabs.findIndex(tab => tab.id === activeTab);
    if (idx < ocorrenciaTabs.length - 1) setActiveTab(ocorrenciaTabs[idx + 1].id);
  };

  const onPrevious = () => {
    const idx = ocorrenciaTabs.findIndex(tab => tab.id === activeTab);
    if (idx > 0) setActiveTab(ocorrenciaTabs[idx - 1].id);
  };

  return { tabs: ocorrenciaTabs, activeTab, setActiveTab, onNext, onPrevious };
}
