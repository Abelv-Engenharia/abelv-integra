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
  dataAbertura?: string;
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

const initialOSList: OS[] = [];

const initialHHHistoricos: HHHistorico[] = [
  // Janeiro - Meta 70%
  { mes: '01/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 145, metaMensal: 190, percentualMeta: 76.3, statusMeta: 'atingido' },
  { mes: '01/2025', cca: '24022', cliente: 'Vale', disciplina: 'Mecânica', hhApropriado: 128, metaMensal: 190, percentualMeta: 67.4, statusMeta: 'nao-atingido' },
  { mes: '02/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 152, metaMensal: 190, percentualMeta: 80.0, statusMeta: 'atingido' },
  { mes: '02/2025', cca: '24023', cliente: 'Braskem', disciplina: 'Mecânica', hhApropriado: 138, metaMensal: 190, percentualMeta: 72.6, statusMeta: 'atingido' },
  { mes: '03/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 158, metaMensal: 190, percentualMeta: 83.2, statusMeta: 'atingido' },
  { mes: '03/2025', cca: '24022', cliente: 'Vale', disciplina: 'Mecânica', hhApropriado: 142, metaMensal: 190, percentualMeta: 74.7, statusMeta: 'atingido' },
  { mes: '04/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 165, metaMensal: 190, percentualMeta: 86.8, statusMeta: 'atingido' },
  { mes: '04/2025', cca: '24024', cliente: 'Ultragaz', disciplina: 'Elétrica', hhApropriado: 18, metaMensal: 190, percentualMeta: 9.5, statusMeta: 'nao-atingido' },
  { mes: '04/2025', cca: '24022', cliente: 'Vale', disciplina: 'Mecânica', hhApropriado: 148, metaMensal: 190, percentualMeta: 77.9, statusMeta: 'nao-atingido' },
  { mes: '05/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 172, metaMensal: 190, percentualMeta: 90.5, statusMeta: 'atingido' },
  { mes: '05/2025', cca: '24024', cliente: 'Ultragaz', disciplina: 'Elétrica', hhApropriado: 12, metaMensal: 190, percentualMeta: 6.3, statusMeta: 'nao-atingido' },
  { mes: '05/2025', cca: '24023', cliente: 'Braskem', disciplina: 'Mecânica', hhApropriado: 155, metaMensal: 190, percentualMeta: 81.6, statusMeta: 'atingido' },
  { mes: '06/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 178, metaMensal: 190, percentualMeta: 93.7, statusMeta: 'atingido' },
  { mes: '06/2025', cca: '24022', cliente: 'Vale', disciplina: 'Mecânica', hhApropriado: 162, metaMensal: 190, percentualMeta: 85.3, statusMeta: 'atingido' },
  { mes: '07/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 185, metaMensal: 190, percentualMeta: 97.4, statusMeta: 'atingido' },
  { mes: '07/2025', cca: '24024', cliente: 'Ultragaz', disciplina: 'Elétrica', hhApropriado: 6, metaMensal: 190, percentualMeta: 3.2, statusMeta: 'nao-atingido' },
  { mes: '07/2025', cca: '24023', cliente: 'Braskem', disciplina: 'Mecânica', hhApropriado: 168, metaMensal: 190, percentualMeta: 88.4, statusMeta: 'atingido' },
  { mes: '08/2025', cca: '24021', cliente: 'Petrobras', disciplina: 'Elétrica', hhApropriado: 180, metaMensal: 190, percentualMeta: 94.7, statusMeta: 'atingido' },
  { mes: '08/2025', cca: '24022', cliente: 'Vale', disciplina: 'Mecânica', hhApropriado: 175, metaMensal: 190, percentualMeta: 92.1, statusMeta: 'atingido' },
];

export const OSProvider = ({ children }: { children: ReactNode }) => {
  const [osList, setOsList] = useState<OS[]>(() => {
    try {
      const savedData = localStorage.getItem('engenharia_matricial_osList');
      if (!savedData) return initialOSList;
      
      const loadedList = JSON.parse(savedData);
      if (!Array.isArray(loadedList)) return initialOSList;
      
      const migratedList = loadedList.map((os: any) => {
        try {
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
      localStorage.removeItem('engenharia_matricial_osList');
      return initialOSList;
    }
  });

  const [hhHistoricos, setHHHistoricos] = useState<HHHistorico[]>(() => {
    const savedData = localStorage.getItem('engenharia_matricial_hhHistoricos');
    return savedData ? JSON.parse(savedData) : initialHHHistoricos;
  });

  useEffect(() => {
    localStorage.setItem('engenharia_matricial_osList', JSON.stringify(osList));
  }, [osList]);

  useEffect(() => {
    localStorage.setItem('engenharia_matricial_hhHistoricos', JSON.stringify(hhHistoricos));
  }, [hhHistoricos]);

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
      localStorage.setItem('engenharia_matricial_osList', JSON.stringify(updated));
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
      localStorage.setItem('engenharia_matricial_osList', JSON.stringify(nextList));
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
            status: "aguardando-aceite-replanejamento",
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
                usuario: "Engenharia Matricial"
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
    avancarFase(osId);
  };

  const concluirOS = (osId: number) => {
    setOsList(prev => prev.map(os => 
      os.id === osId 
        ? { ...os, status: "aguardando-aceite-fechamento", dataConclusao: new Date().toISOString() }
        : os
    ));
  };

  const avancarFase = (osId: number, dadosAdicionais?: any) => {
    setOsList(prev => {
      const os = prev.find(o => o.id === osId);
      if (!os) return prev;

      return prev.map(osItem => {
        if (osItem.id !== osId) return osItem;

        switch (osItem.status) {
          case "aberta":
            return { ...osItem, status: "em-planejamento" };
          
          case "em-planejamento":
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
            return { ...osItem, status: "em-execucao" };
          
          case "em-execucao":
            return { ...osItem, status: "aguardando-aceite-fechamento", dataConclusao: new Date().toISOString() };
          
          case "aguardando-aceite-fechamento":
            return { ...osItem, status: "concluida" };
          
          default:
            return osItem;
        }
      });
    });
  };

  const finalizarOS = (osId: number, valorEngenharia: string, valorSuprimentos: string, dataConclusao?: string, competencia?: string, justificativaEngenharia?: string) => {
    const dataFinal = dataConclusao ? new Date(dataConclusao).toISOString() : new Date().toISOString();
    
    const dataConclusaoObj = new Date(dataFinal);
    const mes = String(dataConclusaoObj.getMonth() + 1).padStart(2, '0');
    const ano = dataConclusaoObj.getFullYear();
    const competenciaFinal = `${mes}/${ano}`;
    
    setOsList(prev => prev.map(os => 
      os.id === osId 
        ? { 
            ...os, 
            status: "aguardando-aceite-fechamento",
            dataConclusao: dataFinal,
            dataEntregaReal: dataFinal,
            valorSAO: os.valorOrcamento,
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
    
    const metaPorcentagem = mesNum >= 1 && mesNum <= 3 ? 70 : 80;
    const metaMensal = (META_HH_MENSAL * metaPorcentagem) / 100;
    const percentualMeta = (hhData.hhApropriado / META_HH_MENSAL) * 100;
    const statusMeta: 'atingido' | 'nao-atingido' = percentualMeta >= metaPorcentagem ? 'atingido' : 'nao-atingido';

    setHHHistoricos(prev => [...prev, {
      ...hhData,
      percentualMeta,
      statusMeta
    }]);
  };

  const addMultipleHHHistoricos = (hhDataArray: Omit<HHHistorico, 'percentualMeta' | 'statusMeta'>[]) => {
    const META_HH_MENSAL = 190;
    
    const processedData = hhDataArray.map(hhData => {
      const [mes] = hhData.mes.split('/');
      const mesNum = parseInt(mes);
      
      const metaPorcentagem = mesNum >= 1 && mesNum <= 3 ? 70 : 80;
      const metaMensal = (META_HH_MENSAL * metaPorcentagem) / 100;
      const percentualMeta = (hhData.hhApropriado / META_HH_MENSAL) * 100;
      const statusMeta: 'atingido' | 'nao-atingido' = percentualMeta >= metaPorcentagem ? 'atingido' : 'nao-atingido';

      return {
        ...hhData,
        percentualMeta,
        statusMeta
      };
    });

    setHHHistoricos(prev => [...prev, ...processedData]);
  };

  const clearAllOS = () => {
    setOsList([]);
    localStorage.removeItem('engenharia_matricial_osList');
  };

  const clearHHHistoricos = () => {
    setHHHistoricos([]);
    localStorage.removeItem('engenharia_matricial_hhHistoricos');
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
      clearHHHistoricos,
    }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within OSProvider');
  }
  return context;
};
