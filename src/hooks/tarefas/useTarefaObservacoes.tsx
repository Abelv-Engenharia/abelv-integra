import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TarefaObservacao {
  id: string;
  tarefa_id: string;
  usuario_id: string;
  observacao: string;
  created_at: string;
  updated_at: string;
  usuario_nome?: string;
}

export const useTarefaObservacoes = (tarefaId: string | undefined) => {
  const [observacoes, setObservacoes] = useState<TarefaObservacao[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchObservacoes = async () => {
    if (!tarefaId) return;

    setIsLoading(true);
    try {
      // Primeiro buscar as observações
      const { data: observacoesData, error: observacoesError } = await supabase
        .from('tarefa_observacoes')
        .select('*')
        .eq('tarefa_id', tarefaId)
        .order('created_at', { ascending: false });

      if (observacoesError) throw observacoesError;

      // Depois buscar os nomes dos usuários para cada observação
      const observacoesComNome: TarefaObservacao[] = [];
      
      if (observacoesData && observacoesData.length > 0) {
        for (const obs of observacoesData) {
          // Buscar o nome do usuário
          const { data: profileData } = await supabase
            .from('profiles')
            .select('nome')
            .eq('id', obs.usuario_id)
            .single();

          observacoesComNome.push({
            ...obs,
            usuario_nome: profileData?.nome || 'Usuário'
          });
        }
      }

      setObservacoes(observacoesComNome);
    } catch (error) {
      console.error('Erro ao buscar observações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const adicionarObservacao = async (observacao: string) => {
    if (!tarefaId || !observacao.trim()) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('tarefa_observacoes')
        .insert({
          tarefa_id: tarefaId,
          usuario_id: user.id,
          observacao: observacao.trim()
        });

      if (error) throw error;

      // Atualizar a lista de observações
      await fetchObservacoes();
      return true;
    } catch (error) {
      console.error('Erro ao adicionar observação:', error);
      return false;
    }
  };

  const excluirObservacao = async (observacaoId: string) => {
    try {
      const { error } = await supabase
        .from('tarefa_observacoes')
        .delete()
        .eq('id', observacaoId);

      if (error) throw error;

      // Atualizar a lista removendo a observação excluída
      setObservacoes(prev => prev.filter(obs => obs.id !== observacaoId));
      return true;
    } catch (error) {
      console.error('Erro ao excluir observação:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchObservacoes();
  }, [tarefaId]);

  return {
    observacoes,
    isLoading,
    adicionarObservacao,
    excluirObservacao,
    refetch: fetchObservacoes
  };
};