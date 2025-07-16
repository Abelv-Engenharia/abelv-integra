import { useState, useEffect } from 'react';

interface RelatorioItem {
  title: string;
  description: string;
  icon: JSX.Element;
  link: string;
}

export interface RelatorioConfig {
  value: string;
  label: string;
  path: string;
}

export const useRelatoriosManager = () => {
  const [relatorios, setRelatorios] = useState<RelatorioConfig[]>([]);

  // Função para mapear um report card para um relatório config
  const mapReportToConfig = (reportCard: RelatorioItem): RelatorioConfig => {
    // Extrai o nome do valor baseado no link
    const linkParts = reportCard.link.split('/');
    const value = linkParts[linkParts.length - 1];
    
    return {
      value,
      label: reportCard.title,
      path: reportCard.link,
    };
  };

  // Função para registrar um novo relatório
  const registrarRelatorio = (reportCard: RelatorioItem) => {
    const config = mapReportToConfig(reportCard);
    
    setRelatorios(prev => {
      // Evita duplicatas
      const exists = prev.some(r => r.value === config.value);
      if (exists) {
        return prev;
      }
      
      return [...prev, config];
    });
  };

  // Função para registrar múltiplos relatórios
  const registrarRelatorios = (reportCards: RelatorioItem[]) => {
    const configs = reportCards.map(mapReportToConfig);
    
    setRelatorios(prev => {
      const novosRelatorios = configs.filter(config => 
        !prev.some(r => r.value === config.value)
      );
      
      return [...prev, ...novosRelatorios];
    });
  };

  // Função para remover um relatório
  const removerRelatorio = (value: string) => {
    setRelatorios(prev => prev.filter(r => r.value !== value));
  };

  return {
    relatorios,
    registrarRelatorio,
    registrarRelatorios,
    removerRelatorio,
  };
};