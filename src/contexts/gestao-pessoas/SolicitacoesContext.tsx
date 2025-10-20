import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SolicitacaoServico, StatusSolicitacao } from '@/types/gestao-pessoas/solicitacao';
import { verificarEAtualizarStatus } from '@/utils/gestao-pessoas/solicitacaoStatus';

interface SolicitacoesContextType {
  solicitacoes: SolicitacaoServico[];
  addSolicitacao: (solicitacao: any) => void;
  updateSolicitacao: (id: string, updates: any) => void;
  deleteSolicitacao: (id: string) => void;
  getSolicitacaoById: (id: string) => SolicitacaoServico | undefined;
  verificarEAtualizarStatusAutomatico: () => void;
}

const SolicitacoesContext = createContext<SolicitacoesContextType | undefined>(undefined);

const STORAGE_KEY = 'solicitacoes';

const loadSolicitacoes = (): SolicitacaoServico[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((sol: any) => ({
        ...sol,
        dataSolicitacao: new Date(sol.dataSolicitacao),
        dataUso: sol.dataUso ? new Date(sol.dataUso) : undefined,
        dataRetirada: sol.dataRetirada ? new Date(sol.dataRetirada) : undefined,
        dataViagem: sol.dataViagem ? new Date(sol.dataViagem) : undefined,
        dataVolta: sol.dataVolta ? new Date(sol.dataVolta) : undefined,
        dataInicio: sol.dataInicio ? new Date(sol.dataInicio) : undefined,
        dataFim: sol.dataFim ? new Date(sol.dataFim) : undefined,
        dataServico: sol.dataServico ? new Date(sol.dataServico) : undefined,
        data: sol.data ? new Date(sol.data) : undefined,
      }));
    }
  } catch (error) {
    console.error('Erro ao carregar solicitações:', error);
  }
  return [];
};

const saveSolicitacoes = (solicitacoes: SolicitacaoServico[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitacoes));
  } catch (error) {
    console.error('Erro ao salvar solicitações:', error);
  }
};

const generateId = () => `SOL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function SolicitacoesProvider({ children }: { children: ReactNode }) {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoServico[]>([]);

  useEffect(() => {
    setSolicitacoes(loadSolicitacoes());
  }, []);

  useEffect(() => {
    if (solicitacoes.length > 0) {
      saveSolicitacoes(solicitacoes);
    }
  }, [solicitacoes]);

  const addSolicitacao = (solicitacao: any) => {
    const novaSolicitacao = {
      ...solicitacao,
      id: generateId(),
      dataSolicitacao: new Date(),
      status: solicitacao.status || StatusSolicitacao.EM_ANDAMENTO,
    } as SolicitacaoServico;

    setSolicitacoes(prev => [novaSolicitacao, ...prev]);
  };

  const updateSolicitacao = (id: string, updates: any) => {
    setSolicitacoes(prev =>
      prev.map(sol => (sol.id === id ? { ...sol, ...updates } as SolicitacaoServico : sol))
    );
  };

  const deleteSolicitacao = (id: string) => {
    setSolicitacoes(prev => prev.filter(sol => sol.id !== id));
  };

  const getSolicitacaoById = (id: string) => {
    return solicitacoes.find(sol => sol.id === id);
  };

  const verificarEAtualizarStatusAutomatico = () => {
    const solicitacoesAtualizadas = solicitacoes.map(solicitacao => {
      const novoStatus = verificarEAtualizarStatus(solicitacao);
      
      // Se o status mudou automaticamente
      if (novoStatus !== solicitacao.status && novoStatus === StatusSolicitacao.PENDENTE) {
        console.log(`[AUTO-MOVE] Solicitação ${solicitacao.id} movida para PENDENTE`);
        
        return {
          ...solicitacao,
          status: novoStatus,
          statusanterior: solicitacao.status,
          datamudancaautomatica: new Date(),
          motivomudancaautomatica: "Movida automaticamente após 3 dias úteis sem atendimento",
          foimovidoautomaticamente: true
        };
      }
      
      return solicitacao;
    });
    
    setSolicitacoes(solicitacoesAtualizadas);
  };

  return (
    <SolicitacoesContext.Provider
      value={{
        solicitacoes,
        addSolicitacao,
        updateSolicitacao,
        deleteSolicitacao,
        getSolicitacaoById,
        verificarEAtualizarStatusAutomatico,
      }}
    >
      {children}
    </SolicitacoesContext.Provider>
  );
}

export function useSolicitacoes() {
  const context = useContext(SolicitacoesContext);
  if (context === undefined) {
    throw new Error('useSolicitacoes must be used within a SolicitacoesProvider');
  }
  return context;
}
