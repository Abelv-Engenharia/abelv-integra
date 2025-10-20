import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Colaborador {
  id: string;
  empresa: string;
  nome: string;
  funcao: string;
  disciplina: string;
  classificacao: string;
  dataInclusao: string;
  validacaoAdmissaoId?: string;
  cpf?: string;
  status?: string;
  cca_codigo?: string;
  cca_nome?: string;
}

interface ColaboradoresContextType {
  colaboradores: Colaborador[];
  adicionarColaborador: (colaborador: Omit<Colaborador, 'id' | 'dataInclusao'>) => Promise<void>;
  atualizarColaborador: (id: string, colaborador: Omit<Colaborador, 'id' | 'dataInclusao'>) => Promise<void>;
  removerColaborador: (id: string) => Promise<void>;
  loading: boolean;
}

const ColaboradoresAbelvPJContext = createContext<ColaboradoresContextType | undefined>(undefined);

export function ColaboradoresAbelvPJProvider({ children }: { children: ReactNode }) {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Buscar colaboradores do tipo 'abelv' do Supabase
  const carregarColaboradores = async () => {
    try {
      const { data, error } = await supabase
        .from('colaboradores_efetivo')
        .select('*')
        .eq('tipo_colaborador', 'abelv')
        .eq('status', 'ativo')
        .order('data_inclusao', { ascending: false });

      if (error) throw error;

      const colaboradoresFormatados = (data || []).map(col => ({
        id: col.id,
        empresa: col.empresa,
        nome: col.nome,
        funcao: col.funcao,
        disciplina: col.disciplina,
        classificacao: col.classificacao,
        dataInclusao: col.data_inclusao || new Date().toISOString().split('T')[0],
        validacaoAdmissaoId: col.validacao_admissao_id,
        cpf: col.cpf,
        status: col.status,
        cca_codigo: col.cca_codigo,
        cca_nome: col.cca_nome
      }));

      setColaboradores(colaboradoresFormatados);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os colaboradores.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarColaboradores();

    // Configurar realtime subscription
    const channel = supabase
      .channel('colaboradores_efetivo_abelv_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'colaboradores_efetivo',
          filter: 'tipo_colaborador=eq.abelv'
        },
        () => {
          carregarColaboradores();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const adicionarColaborador = async (novoColaborador: Omit<Colaborador, 'id' | 'dataInclusao'> & { cca_codigo?: string; cca_nome?: string }) => {
    try {
      const { data, error } = await supabase
        .from('colaboradores_efetivo')
        .insert({
          empresa: novoColaborador.empresa,
          nome: novoColaborador.nome,
          cpf: novoColaborador.cpf || '',
          funcao: novoColaborador.funcao,
          disciplina: novoColaborador.disciplina,
          classificacao: novoColaborador.classificacao,
          cca_codigo: novoColaborador.cca_codigo || '',
          cca_nome: novoColaborador.cca_nome || '',
          tipo_colaborador: 'abelv',
          status: 'ativo'
        })
        .select()
        .single();

      if (error) throw error;

      // Atualiza estado local imediatamente (otimista)
      if (data) {
        const novo = {
          id: data.id,
          empresa: data.empresa,
          nome: data.nome,
          funcao: data.funcao,
          disciplina: data.disciplina,
          classificacao: data.classificacao,
          dataInclusao: data.data_inclusao || new Date().toISOString().split('T')[0],
          validacaoAdmissaoId: data.validacao_admissao_id,
          cpf: data.cpf,
          status: data.status,
          cca_codigo: data.cca_codigo,
          cca_nome: data.cca_nome
        };
        setColaboradores(prev => [novo, ...prev]);
      }

      toast({
        title: "Sucesso",
        description: "Colaborador adicionado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao adicionar colaborador:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o colaborador.",
        variant: "destructive"
      });
    }
  };

  const atualizarColaborador = async (id: string, colaboradorAtualizado: Omit<Colaborador, 'id' | 'dataInclusao'> & { cca_codigo?: string; cca_nome?: string }) => {
    try {
      const { error } = await supabase
        .from('colaboradores_efetivo')
        .update({
          empresa: colaboradorAtualizado.empresa,
          nome: colaboradorAtualizado.nome,
          funcao: colaboradorAtualizado.funcao,
          disciplina: colaboradorAtualizado.disciplina,
          classificacao: colaboradorAtualizado.classificacao,
          cca_codigo: colaboradorAtualizado.cca_codigo || '',
          cca_nome: colaboradorAtualizado.cca_nome || ''
        })
        .eq('id', id);

      if (error) throw error;

      // Atualiza estado local
      setColaboradores(prev => prev.map(c => 
        c.id === id ? {
          ...c,
          empresa: colaboradorAtualizado.empresa,
          nome: colaboradorAtualizado.nome,
          funcao: colaboradorAtualizado.funcao,
          disciplina: colaboradorAtualizado.disciplina,
          classificacao: colaboradorAtualizado.classificacao,
          cca_codigo: colaboradorAtualizado.cca_codigo || '',
          cca_nome: colaboradorAtualizado.cca_nome || ''
        } : c
      ));

      toast({
        title: "Sucesso",
        description: "Colaborador atualizado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao atualizar colaborador:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o colaborador.",
        variant: "destructive"
      });
    }
  };

  const removerColaborador = async (id: string) => {
    try {
      const { error } = await supabase
        .from('colaboradores_efetivo')
        .update({ status: 'inativo' })
        .eq('id', id);

      if (error) throw error;

      // Remove do estado local
      setColaboradores(prev => prev.filter(c => c.id !== id));

      toast({
        title: "Sucesso",
        description: "Colaborador removido com sucesso."
      });
    } catch (error) {
      console.error('Erro ao remover colaborador:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o colaborador.",
        variant: "destructive"
      });
    }
  };

  return (
    <ColaboradoresAbelvPJContext.Provider 
      value={{ 
        colaboradores, 
        adicionarColaborador, 
        atualizarColaborador, 
        removerColaborador,
        loading
      }}
    >
      {children}
    </ColaboradoresAbelvPJContext.Provider>
  );
}

export function useColaboradoresAbelvPJ() {
  const context = useContext(ColaboradoresAbelvPJContext);
  if (context === undefined) {
    throw new Error('useColaboradoresAbelvPJ deve ser usado dentro de ColaboradoresAbelvPJProvider');
  }
  return context;
}
