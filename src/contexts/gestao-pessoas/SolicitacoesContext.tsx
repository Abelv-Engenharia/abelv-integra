import { createContext, useContext, ReactNode, useMemo } from 'react';
import { SolicitacaoServico, StatusSolicitacao, PrioridadeSolicitacao, TipoServico } from '@/types/gestao-pessoas/solicitacao';
import { verificarEAtualizarStatus } from '@/utils/gestao-pessoas/solicitacaoStatus';
import { useSolicitacoesServicos } from '@/hooks/gestao-pessoas/useSolicitacoesServicos';
import { Database } from '@/integrations/supabase/types';

type SolicitacaoServicoRow = Database["public"]["Tables"]["solicitacoes_servicos"]["Row"];

interface SolicitacoesContextType {
  solicitacoes: SolicitacaoServico[];
  addSolicitacao: (solicitacao: any) => void;
  updateSolicitacao: (id: string, updates: any) => void;
  deleteSolicitacao: (id: string) => void;
  getSolicitacaoById: (id: string) => SolicitacaoServico | undefined;
  verificarEAtualizarStatusAutomatico: () => void;
  isLoading: boolean;
}

const SolicitacoesContext = createContext<SolicitacoesContextType | undefined>(undefined);

// Função para converter dados do Supabase para o formato do frontend
const converterParaSolicitacao = (row: SolicitacaoServicoRow): any => {
  return {
    id: row.id,
    dataSolicitacao: new Date(row.data_solicitacao),
    solicitante: row.solicitante_nome,
    solicitanteId: row.solicitante_id,
    centroCusto: '', // TODO: buscar do CCA
    tipoServico: row.tipo_servico as TipoServico,
    prioridade: row.prioridade as PrioridadeSolicitacao,
    status: row.status as StatusSolicitacao,
    observacoes: row.observacoes || undefined,
    observacoesgestao: row.observacoes_gestao || undefined,
    estimativavalor: row.estimativa_valor || undefined,
    imagemAnexo: row.imagem_anexo || undefined,
    responsavelaprovacao: '', // TODO: buscar nome do responsável
    responsavelaprovacaoId: row.responsavel_aprovacao_id || undefined,
    aprovadopor: '', // TODO: buscar nome do aprovador
    aprovadoporId: row.aprovado_por_id || undefined,
    dataaprovacao: row.data_aprovacao ? new Date(row.data_aprovacao) : undefined,
    justificativaaprovacao: row.justificativa_aprovacao || undefined,
    justificativareprovacao: row.justificativa_reprovacao || undefined,
    concluidopor: '', // TODO: buscar nome do concluído por
    concluidoporId: row.concluido_por_id || undefined,
    dataconclusao: row.data_conclusao ? new Date(row.data_conclusao) : undefined,
    observacoesconclusao: row.observacoes_conclusao || undefined,
    comprovanteconclusao: row.comprovante_conclusao || undefined,
    statusanterior: row.status_anterior as StatusSolicitacao | undefined,
    foimovidoautomaticamente: row.foi_movido_automaticamente || undefined,
    datamudancaautomatica: row.data_mudanca_automatica ? new Date(row.data_mudanca_automatica) : undefined,
    motivomudancaautomatica: row.motivo_mudanca_automatica || undefined,
    ccaId: row.cca_id || undefined,
  };
};

export function SolicitacoesProvider({ children }: { children: ReactNode }) {
  const {
    solicitacoes: solicitacoesDb,
    isLoading,
    createSolicitacao: createDb,
    updateSolicitacao: updateDb,
    deleteSolicitacao: deleteDb,
    getSolicitacaoById: getByIdDb,
  } = useSolicitacoesServicos();

  // Converter dados do banco para o formato esperado pelo frontend
  const solicitacoes = useMemo(() => {
    return solicitacoesDb.map(converterParaSolicitacao);
  }, [solicitacoesDb]);

  const addSolicitacao = (solicitacao: any) => {
    // Validar que o solicitanteId está presente
    if (!solicitacao.solicitanteId) {
      console.error('solicitanteId é obrigatório');
      throw new Error('ID do solicitante não encontrado. Por favor, faça login novamente.');
    }

    const novaSolicitacao = {
      solicitante_id: solicitacao.solicitanteId,
      solicitante_nome: solicitacao.solicitante || 'Usuário',
      tipo_servico: solicitacao.tipoServico,
      prioridade: solicitacao.prioridade || 'media',
      observacoes: solicitacao.observacoes,
      observacoes_gestao: solicitacao.observacoesgestao,
      estimativa_valor: solicitacao.estimativavalor,
      imagem_anexo: solicitacao.imagemAnexo,
      responsavel_aprovacao_id: solicitacao.responsavelaprovacaoId,
      cca_id: solicitacao.ccaId,
    };

    createDb(novaSolicitacao);
  };

  const updateSolicitacao = (id: string, updates: any) => {
    // Converter campos do frontend para o banco
    const dbUpdates: any = {};
    
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.observacoes) dbUpdates.observacoes = updates.observacoes;
    if (updates.observacoesgestao) dbUpdates.observacoes_gestao = updates.observacoesgestao;
    if (updates.estimativavalor !== undefined) dbUpdates.estimativa_valor = updates.estimativavalor;
    if (updates.justificativaaprovacao) dbUpdates.justificativa_aprovacao = updates.justificativaaprovacao;
    if (updates.justificativareprovacao) dbUpdates.justificativa_reprovacao = updates.justificativareprovacao;
    if (updates.dataaprovacao) dbUpdates.data_aprovacao = updates.dataaprovacao.toISOString();
    if (updates.aprovadoporId) dbUpdates.aprovado_por_id = updates.aprovadoporId;
    if (updates.dataconclusao) dbUpdates.data_conclusao = updates.dataconclusao.toISOString();
    if (updates.concluidoporId) dbUpdates.concluido_por_id = updates.concluidoporId;
    if (updates.observacoesconclusao) dbUpdates.observacoes_conclusao = updates.observacoesconclusao;
    if (updates.comprovanteconclusao) dbUpdates.comprovante_conclusao = updates.comprovanteconclusao;
    if (updates.statusanterior) dbUpdates.status_anterior = updates.statusanterior;
    if (updates.foimovidoautomaticamente !== undefined) dbUpdates.foi_movido_automaticamente = updates.foimovidoautomaticamente;
    if (updates.datamudancaautomatica) dbUpdates.data_mudanca_automatica = updates.datamudancaautomatica.toISOString();
    if (updates.motivomudancaautomatica) dbUpdates.motivo_mudanca_automatica = updates.motivomudancaautomatica;

    updateDb({ id, updates: dbUpdates });
  };

  const deleteSolicitacao = (id: string) => {
    deleteDb(id);
  };

  const getSolicitacaoById = (id: string) => {
    return solicitacoes.find(sol => sol.id === id);
  };

  const verificarEAtualizarStatusAutomatico = () => {
    // TODO: Implementar verificação automática com o banco
    solicitacoes.forEach(solicitacao => {
      const novoStatus = verificarEAtualizarStatus(solicitacao);
      
      if (novoStatus !== solicitacao.status && novoStatus === StatusSolicitacao.PENDENTE) {
        console.log(`[AUTO-MOVE] Solicitação ${solicitacao.id} movida para PENDENTE`);
        
        updateSolicitacao(solicitacao.id, {
          status: novoStatus,
          statusanterior: solicitacao.status,
          datamudancaautomatica: new Date(),
          motivomudancaautomatica: "Movida automaticamente após 3 dias úteis sem atendimento",
          foimovidoautomaticamente: true
        });
      }
    });
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
        isLoading,
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
