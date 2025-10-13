import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface OS {
  id: number;
  numero?: string;
  cca: number;
  cliente: string;
  disciplina: string;
  disciplinasEnvolvidas: string[];
  familiaSAO: string;
  descricao: string;
  status: string;
  valorOrcamento: number;
  hhPlanejado: number;
  hhAdicional: number;
  valorHoraHH: number;
  dataCompromissada: string;
  dataInicioPrevista?: string | null;
  dataFimPrevista?: string | null;
  dataAtendimento?: string | null;
  dataEntregaReal?: string | null;
  dataConclusao?: string | null;
  valorFinal?: number | null;
  valorSAO?: number | null;
  valorEngenharia?: number | null;
  valorSuprimentos?: number | null;
  justificativaEngenharia?: string | null;
  percentualSaving?: number | null;
  competencia: string;
  responsavelObra: string;
  responsavelEM: string;
  slaStatus: string;
  dataAbertura: string;
  nomeSolicitante: string;
  anexos?: File[];
  historicoReplanejamentos?: ReplanejamentoHistorico[];
}

export interface ReplanejamentoHistorico {
  data: string;
  hhAdicional: number;
  novaDataInicio: string;
  novaDataFim: string;
  motivo: string;
  usuario: string;
}

export interface HHHistorico {
  mes: string; // formato: MM/YYYY
  cca: string;
  cliente: string;
  disciplina: string;
  hhApropriado: number;
  metaMensal: number;
  percentualMeta: number;
  statusMeta: 'atingido' | 'nao-atingido';
}

interface NovaOSData {
  numero?: string;
  cca: string;
  nomeSolicitante: string;
  cliente: string;
  disciplina: string;
  disciplinasEnvolvidas: string[];
  familiaSAO: string;
  descricao: string;
  dataCompromissada: string;
  valorOrcamento: string;
  anexos: File[];
  responsavelEM: string;
  // Campos opcionais
  dataAbertura?: string;
  // Campos opcionais para importação de OSs já concluídas
  status?: string;
  dataConclusao?: string;
  dataEntregaReal?: string;
  competencia?: string;
  valorSAO?: number;
  valorEngenharia?: number;
  valorSuprimentos?: number;
  valorFinal?: number;
  hhPlanejado?: number;
  percentualSaving?: number;
}

interface OSContextType {
  osList: OS[];
  hhHistoricos: HHHistorico[];
  addOS: (osData: NovaOSData) => void;
  addHHHistorico: (hhData: Omit<HHHistorico, 'percentualMeta' | 'statusMeta'>) => void;
  addMultipleHHHistoricos: (hhDataArray: Omit<HHHistorico, 'percentualMeta' | 'statusMeta'>[]) => void;
  updateOSStatus: (osId: number, newStatus: string, observacao?: string) => void;
  updateOSPlanejamento: (osId: number, planejamentoData: { dataInicioPrevista: string; dataFimPrevista: string; hhPlanejado: number; hhAdicional?: number; valorOrcamento?: number }) => void;
  updateOSHH: (osId: number, hhPlanejado: number) => void;
  replanejamentoOS: (osId: number, replanejamentoData: { novaDataInicio: string; novaDataFim: string; hhAdicional: number; motivo: string }) => void;
  cancelarOS: (osId: number, motivo: string) => void;
  aprovarPlanejamento: (osId: number) => void;
  concluirOS: (osId: number) => void;
  finalizarOS: (osId: number, valorEngenharia: string, valorSuprimentos: string, dataConclusao?: string, competencia?: string, justificativaEngenharia?: string) => void;
  aceitarFechamento: (osId: number) => void;
  rejeitarFechamento: (osId: number) => void;
  avancarFase: (osId: number, dadosAdicionais?: any) => void;
  getOSById: (osId: number) => OS | undefined;
  clearAllOS: () => void;
  clearHHHistoricos: () => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

// Array vazio para iniciar testes
const initialOSList: OS[] = [];

// Dados de exemplo para histórico Jan-Ago/2025
const initialHHHistoricos: HHHistorico[] = [
  // Janeiro - Meta 70%
  { mes: '01/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 145, metaMensal: 190, percentualMeta: 76.3, statusMeta: 'atingido' },
  { mes: '01/2025', cca: '24022', cliente: 'Vale', disciplina: 'Mecânica', hhApropriado: 128, metaMensal: 190, percentualMeta: 67.4, statusMeta: 'nao-atingido' },
  
  // Fevereiro - Meta 70%
  { mes: '02/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 152, metaMensal: 190, percentualMeta: 80.0, statusMeta: 'atingido' },
  { mes: '02/2025', cca: '24023', cliente: 'Braskem', disciplina: 'Mecânica', hhApropriado: 138, metaMensal: 190, percentualMeta: 72.6, statusMeta: 'atingido' },
  
  // Março - Meta 70%
  { mes: '03/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 158, metaMensal: 190, percentualMeta: 83.2, statusMeta: 'atingido' },
  { mes: '03/2025', cca: '24022', cliente: 'Vale', disciplina: 'Mecânica', hhApropriado: 142, metaMensal: 190, percentualMeta: 74.7, statusMeta: 'atingido' },
  
  // Abril - Meta 80%
  { mes: '04/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 165, metaMensal: 190, percentualMeta: 86.8, statusMeta: 'atingido' },
  { mes: '04/2025', cca: '24024', cliente: 'Ultragaz', disciplina: 'Elétrica', hhApropriado: 18, metaMensal: 190, percentualMeta: 9.5, statusMeta: 'nao-atingido' },
  { mes: '04/2025', cca: '24022', cliente: 'Vale', disciplina: 'Mecânica', hhApropriado: 148, metaMensal: 190, percentualMeta: 77.9, statusMeta: 'nao-atingido' },
  
  // Maio - Meta 80%
  { mes: '05/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 172, metaMensal: 190, percentualMeta: 90.5, statusMeta: 'atingido' },
  { mes: '05/2025', cca: '24024', cliente: 'Ultragaz', disciplina: 'Elétrica', hhApropriado: 12, metaMensal: 190, percentualMeta: 6.3, statusMeta: 'nao-atingido' },
  { mes: '05/2025', cca: '24023', cliente: 'Braskem', disciplina: 'Mecânica', hhApropriado: 155, metaMensal: 190, percentualMeta: 81.6, statusMeta: 'atingido' },
  
  // Junho - Meta 80%
  { mes: '06/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 178, metaMensal: 190, percentualMeta: 93.7, statusMeta: 'atingido' },
  { mes: '06/2025', cca: '24022', cliente: 'Vale', disciplina: 'Mecânica', hhApropriado: 162, metaMensal: 190, percentualMeta: 85.3, statusMeta: 'atingido' },
  
  // Julho - Meta 80%
  { mes: '07/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 185, metaMensal: 190, percentualMeta: 97.4, statusMeta: 'atingido' },
  { mes: '07/2025', cca: '24024', cliente: 'Ultragaz', disciplina: 'Elétrica', hhApropriado: 6, metaMensal: 190, percentualMeta: 3.2, statusMeta: 'nao-atingido' },
  { mes: '07/2025', cca: '24023', cliente: 'Braskem', disciplina: 'Mecânica', hhApropriado: 168, metaMensal: 190, percentualMeta: 88.4, statusMeta: 'atingido' },
  
  // Agosto - Meta 80%
  { mes: '08/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 180, metaMensal: 190, percentualMeta: 94.7, statusMeta: 'atingido' },
  { mes: '08/2025', cca: '24022', cliente: 'Vale', disciplina: 'Mecânica', hhApropriado: 175, metaMensal: 190, percentualMeta: 92.1, statusMeta: 'atingido' },
];

export const OSProvider = ({ children }: { children: ReactNode }) => {
  const [osList, setOsList] = useState<OS[]>(() => {
    try {
      const savedData = localStorage.getItem('osList');
      if (!savedData) return initialOSList;
      
      const loadedList = JSON.parse(savedData);
      if (!Array.isArray(loadedList)) return initialOSList;
      
      // Migração: garantir que valorOrcamento existe e zerar para OS não concluídas
      const migratedList = loadedList.map((os: any) => {
        try {
          // Zerar valorOrcamento para todas as OS que não estão concluídas
          const statusNaoConcluido = os.status !== "concluida" && os.status !== "aguardando-aceite-fechamento";
          return {
            ...os,
            valorOrcamento: statusNaoConcluido ? 0 : (os.valorOrcamento ?? 0)
          };
        } catch {
          return os;
        }
      });
      
      return migratedList;
    } catch (error) {
      console.error('Error loading OS data:', error);
      localStorage.removeItem('osList');
      return initialOSList;
    }
  });

  const [hhHistoricos, setHHHistoricos] = useState<HHHistorico[]>(() => {
    const savedData = localStorage.getItem('hhHistoricos');
    return savedData ? JSON.parse(savedData) : initialHHHistoricos;
  });

  useEffect(() => {
    localStorage.setItem('osList', JSON.stringify(osList));
  }, [osList]);

  useEffect(() => {
    localStorage.setItem('hhHistoricos', JSON.stringify(hhHistoricos));
  }, [hhHistoricos]);

  // Migração: corrigir responsável EM de Mecânica para "Ricardo Cunha"
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let altered = false;
    const updated = osList.map(os => {
      const isMecanica = typeof os.disciplina === "string" && os.disciplina.toLowerCase() === "mecanica";
      if (isMecanica && (os.responsavelEM === "Roberto Silva" || os.responsavelEM === "Roberto Cunha")) {
        altered = true;
        return { ...os, responsavelEM: "Ricardo Cunha" } as OS;
      }
      return os;
    });
    if (altered) {
      setOsList(updated);
      localStorage.setItem('osList', JSON.stringify(updated));
    }
  }, []);

  const addOS = (osData: NovaOSData) => {
    setOsList(prev => {
      const nextId = Math.max(...prev.map(os => os.id), 0) + 1;
      const dataAbertura = osData.dataAbertura || new Date().toISOString().split('T')[0];
      const newOS: OS = {
        id: nextId,
        numero: osData.numero,
        cca: parseInt(osData.cca),
        cliente: osData.cliente,
        disciplina: osData.disciplina,
        disciplinasEnvolvidas: osData.disciplinasEnvolvidas,
        familiaSAO: osData.familiaSAO,
        descricao: osData.descricao,
        status: osData.status || "aberta",
        valorOrcamento: parseFloat(osData.valorOrcamento),
        hhPlanejado: osData.hhPlanejado || 0,
        hhAdicional: 0,
        valorHoraHH: 95.00,
        dataCompromissada: osData.dataCompromissada,
        dataEntregaReal: osData.dataEntregaReal || null,
        dataConclusao: osData.dataConclusao || null,
        valorFinal: osData.valorFinal || null,
        valorSAO: osData.valorSAO || null,
        valorEngenharia: osData.valorEngenharia || null,
        valorSuprimentos: osData.valorSuprimentos || null,
        percentualSaving: osData.percentualSaving || null,
        competencia: osData.competencia || "",
        responsavelObra: "",
        responsavelEM: osData.responsavelEM,
        slaStatus: "no-prazo",
        dataAbertura,
        nomeSolicitante: osData.nomeSolicitante,
        anexos: osData.anexos,
        dataInicioPrevista: null,
        dataFimPrevista: null
      };

      const nextList = [newOS, ...prev];
      // Persistir imediatamente para evitar perda ao navegar
      localStorage.setItem('osList', JSON.stringify(nextList));
      return nextList;
    });
  };

  const updateOSStatus = (osId: number, newStatus: string, observacao?: string) => {
    setOsList(prev => prev.map(os => 
      os.id === osId 
        ? { ...os, status: newStatus }
        : os
    ));
  };

  const updateOSPlanejamento = (osId: number, planejamentoData: { dataInicioPrevista: string; dataFimPrevista: string; hhPlanejado: number; hhAdicional?: number; valorOrcamento?: number }) => {
    console.log("=== CONTEXTO: ATUALIZANDO PLANEJAMENTO ===");
    console.log("OS ID:", osId);
    console.log("Dados recebidos:", planejamentoData);
    
    // Usar a função avancarFase para transição automática
    avancarFase(osId, { planejamento: planejamentoData });
  };

  const updateOSHH = (osId: number, hhPlanejado: number) => {
    setOsList(prev => prev.map(os => 
      os.id === osId 
        ? { ...os, hhPlanejado }
        : os
    ));
  };

  const replanejamentoOS = (osId: number, replanejamentoData: { novaDataInicio: string; novaDataFim: string; hhAdicional: number; motivo: string }) => {
    setOsList(prev => prev.map(os => 
      os.id === osId 
        ? { 
            ...os, 
            status: "aguardando-aceite",
            dataInicioPrevista: replanejamentoData.novaDataInicio,
            dataFimPrevista: replanejamentoData.novaDataFim,
            hhAdicional: (os.hhAdicional || 0) + replanejamentoData.hhAdicional,
            historicoReplanejamentos: [
              ...(os.historicoReplanejamentos || []),
              {
                data: new Date().toISOString(),
                hhAdicional: replanejamentoData.hhAdicional,
                novaDataInicio: replanejamentoData.novaDataInicio,
                novaDataFim: replanejamentoData.novaDataFim,
                motivo: replanejamentoData.motivo,
                usuario: "Engenharia Matricial" // Em um sistema real, seria o usuário logado
              }
            ]
          }
        : os
    ));
  };

  const cancelarOS = (osId: number, motivo: string) => {
    setOsList(prev => prev.map(os => 
      os.id === osId 
        ? { ...os, status: "cancelada" }
        : os
    ));
  };

  const aprovarPlanejamento = (osId: number) => {
    // Usar a função avancarFase para transição automática
    avancarFase(osId);
  };

  const concluirOS = (osId: number) => {
    setOsList(prev => prev.map(os => 
      os.id === osId 
        ? { ...os, status: "aguardando-aceite-fechamento", dataConclusao: new Date().toISOString() }
        : os
    ));
  };

  // Função para avançar automaticamente para a próxima fase
  const avancarFase = (osId: number, dadosAdicionais?: any) => {
    setOsList(prev => {
      const os = prev.find(o => o.id === osId);
      if (!os) return prev;

      return prev.map(osItem => {
        if (osItem.id !== osId) return osItem;

        switch (osItem.status) {
          case "aberta":
            // OS aberta avança para em-planejamento
            return { ...osItem, status: "em-planejamento" };
          
          case "em-planejamento":
            // Em planejamento avança para aguardando-aceite
            if (dadosAdicionais && dadosAdicionais.planejamento) {
              const p = dadosAdicionais.planejamento;
              return { 
                ...osItem, 
                status: "aguardando-aceite",
                dataInicioPrevista: p.dataInicioPrevista,
                dataFimPrevista: p.dataFimPrevista,
                hhPlanejado: p.hhPlanejado,
                hhAdicional: p.hhAdicional || 0,
                ...(typeof p.valorOrcamento === 'number' ? { valorOrcamento: p.valorOrcamento } : {})
              };
            }
            return { ...osItem, status: "aguardando-aceite" };
          
          case "aguardando-aceite":
            // Aguardando aceite avança para em-execução
            return { ...osItem, status: "em-execucao" };
          
          case "em-execucao":
            // Em execução avança para aguardando-aceite-fechamento
            return { ...osItem, status: "aguardando-aceite-fechamento", dataConclusao: new Date().toISOString() };
          
          case "aguardando-aceite-fechamento":
            // Aguardando aceite fechamento avança para concluída
            return { ...osItem, status: "concluida" };
          
          default:
            return osItem;
        }
      });
    });
  };

  const finalizarOS = (osId: number, valorEngenharia: string, valorSuprimentos: string, dataConclusao?: string, competencia?: string, justificativaEngenharia?: string) => {
    const dataFinal = dataConclusao ? new Date(dataConclusao).toISOString() : new Date().toISOString();
    
    // Calcular competência automaticamente baseada na data de conclusão (formato MM/YYYY)
    const dataConclusaoObj = new Date(dataFinal);
    const mes = String(dataConclusaoObj.getMonth() + 1).padStart(2, '0');
    const ano = dataConclusaoObj.getFullYear();
    const competenciaFinal = `${mes}/${ano}`;
    
    console.log('Debug finalizarOS - osId:', osId, 'valorEngenharia:', valorEngenharia, 'valorSuprimentos:', valorSuprimentos, 'competencia:', competenciaFinal);
    
    setOsList(prev => prev.map(os => 
      os.id === osId 
        ? { 
            ...os, 
            status: "aguardando-aceite-fechamento",
            dataConclusao: dataFinal,
            dataEntregaReal: dataFinal,
            valorSAO: os.valorOrcamento, // Valor SAO é automático (baseado no orçamento)
            valorEngenharia: parseFloat(valorEngenharia) || 0,
            valorSuprimentos: parseFloat(valorSuprimentos) || 0,
            justificativaEngenharia: justificativaEngenharia || null,
            valorFinal: parseFloat(valorSuprimentos) || 0,
            percentualSaving: os.valorOrcamento > 0 
              ? ((os.valorOrcamento - parseFloat(valorSuprimentos)) / os.valorOrcamento) * 100 
              : 0,
            competencia: competenciaFinal
          }
        : os
    ));
  };

  const aceitarFechamento = (osId: number) => {
    // Usar a função avancarFase para transição automática
    avancarFase(osId);
  };

  const rejeitarFechamento = (osId: number) => {
    setOsList(prev => prev.map(os => 
      os.id === osId 
        ? { ...os, status: "em-execucao" }
        : os
    ));
  };

  const getOSById = (osId: number) => {
    return osList.find(os => os.id === osId);
  };

  const addHHHistorico = (hhData: Omit<HHHistorico, 'percentualMeta' | 'statusMeta'>) => {
    const META_HH_MENSAL = 190;
    const [mes, ano] = hhData.mes.split('/');
    const mesNum = parseInt(mes);
    
    // Definir meta baseada no mês
    const metaPorcentagem = mesNum >= 1 && mesNum <= 3 ? 70 : 80;
    const metaMensal = (META_HH_MENSAL * metaPorcentagem) / 100;
    const percentualMeta = (hhData.hhApropriado / META_HH_MENSAL) * 100;
    const statusMeta = percentualMeta >= metaPorcentagem ? 'atingido' : 'nao-atingido';

    const novoHH: HHHistorico = {
      ...hhData,
      metaMensal,
      percentualMeta,
      statusMeta: statusMeta as 'atingido' | 'nao-atingido'
    };

    setHHHistoricos(prev => [...prev, novoHH]);
  };

  const addMultipleHHHistoricos = (hhDataArray: Omit<HHHistorico, 'percentualMeta' | 'statusMeta'>[]) => {
    const META_HH_MENSAL = 190;
    
    const novosHH = hhDataArray.map(hhData => {
      const [mes, ano] = hhData.mes.split('/');
      const mesNum = parseInt(mes);
      
      const metaPorcentagem = mesNum >= 1 && mesNum <= 3 ? 70 : 80;
      const metaMensal = (META_HH_MENSAL * metaPorcentagem) / 100;
      const percentualMeta = (hhData.hhApropriado / META_HH_MENSAL) * 100;
      const statusMeta = percentualMeta >= metaPorcentagem ? 'atingido' : 'nao-atingido';

      return {
        ...hhData,
        metaMensal,
        percentualMeta,
        statusMeta: statusMeta as 'atingido' | 'nao-atingido'
      };
    });

    setHHHistoricos(prev => [...prev, ...novosHH]);
  };

  const clearAllOS = () => {
    setOsList([]);
    localStorage.removeItem('osList');
  };

  const clearHHHistoricos = () => {
    setHHHistoricos([]);
    localStorage.removeItem('hhHistoricos');
  };

  return (
    <OSContext.Provider value={{ 
      osList, 
      hhHistoricos,
      addOS, 
      addHHHistorico,
      addMultipleHHHistoricos,
      updateOSStatus, 
      updateOSPlanejamento, 
      updateOSHH, 
      replanejamentoOS, 
      cancelarOS, 
      aprovarPlanejamento, 
      concluirOS, 
      finalizarOS, 
      aceitarFechamento, 
      rejeitarFechamento, 
      avancarFase, 
      getOSById, 
      clearAllOS,
      clearHHHistoricos
    }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (context === undefined) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};