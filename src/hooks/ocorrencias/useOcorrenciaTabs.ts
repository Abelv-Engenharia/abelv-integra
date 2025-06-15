
import { useState } from "react";

export const useOcorrenciaTabs = () => {
  const tabs = [
    { id: "identificacao", label: "Identificação" },
    { id: "informacoes", label: "Informações da Ocorrência" },
    { id: "classificacaoRisco", label: "Classificação de Risco" },
    { id: "planoAcao", label: "Plano de Ação" },
    { id: "fechamento", label: "Fechamento" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleNext = () => {
    const idx = tabs.findIndex(tab => tab.id === activeTab);
    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
  };

  const handlePrevious = () => {
    const idx = tabs.findIndex(tab => tab.id === activeTab);
    if (idx > 0) setActiveTab(tabs[idx - 1].id);
  };

  return { tabs, activeTab, setActiveTab, handleNext, handlePrevious };
};
